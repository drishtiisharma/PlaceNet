import uuid
import json
import logging
import time
from sqlalchemy.orm import Session
from typing import List

from app.database.models import HiringProfile, CandidateProfile, RankedCandidate
from app.services.resume.vector_service import VectorService
from app.services.resume.embedding_service import EmbeddingService
from app.ai.client import llm_service
from app.schemas.candidate_profile import RankingResult

logger = logging.getLogger(__name__)

class RankingService:
    @staticmethod
    async def process_all_candidates_stream(db: Session, hiring_profile_id: str, user_id: str):
        # Delete existing RankedCandidate for this profile to start fresh
        db.query(RankedCandidate).filter(RankedCandidate.hiring_profile_id == hiring_profile_id, RankedCandidate.user_id == user_id).delete()
        db.commit()

        hp = db.query(HiringProfile).filter(HiringProfile.id == hiring_profile_id, HiringProfile.user_id == user_id).first()
        if not hp:
            yield {"type": "error", "detail": "Hiring Profile not found"}
            return

        all_candidates = db.query(CandidateProfile).filter(CandidateProfile.user_id == user_id).all()
        total_candidates = len(all_candidates)
        if total_candidates == 0:
            yield {"type": "complete"}
            return

        yield {"type": "progress", "processed": 0, "total": total_candidates}

        query_text = f"Job Title: {hp.job_title}\nSummary: {hp.job_summary}\nRequired Skills: {', '.join(hp.required_skills)}"
        query_embedding = EmbeddingService.generate_embeddings([query_text])[0]
        
        search_results = VectorService.collection.query(
            query_embeddings=[query_embedding],
            n_results=min(50, total_candidates),
            include=["metadatas", "distances"]
        )
        
        semantic_scores = {}
        if search_results and "metadatas" in search_results and search_results["metadatas"]:
            for metas, distances in zip(search_results["metadatas"], search_results["distances"]):
                for meta, dist in zip(metas, distances):
                    r_id = meta["resume_id"]
                    score = max(0, 20 - (dist * 10))
                    semantic_scores[r_id] = max(semantic_scores.get(r_id, 0), score)

        ranked_profiles = []
        req_skills = [s.strip().lower() for s in hp.required_skills]
        pref_skills = [s.strip().lower() for s in hp.preferred_skills]
        
        for c in all_candidates:
            c_skills = [s.strip().lower() for s in (c.skills or [])]
            
            matched = set(req_skills).intersection(c_skills)
            missing = set(req_skills) - set(c_skills)
            pref_present = set(pref_skills).intersection(c_skills)
            extra = set(c_skills) - set(req_skills) - set(pref_skills)
            
            skill_score = (len(matched) / len(req_skills)) * 60 if req_skills else 60
            sem_score = semantic_scores.get(c.resume_id, 0)
            
            exp_edu_score = 10
            c_edu = " ".join(c.education).lower() if c.education else ""
            c_exp = " ".join(c.experience).lower() if c.experience else ""
            if hp.education and hp.education.lower() in c_edu:
                exp_edu_score += 5
            if hp.experience and hp.experience.lower() in c_exp:
                exp_edu_score += 5
                
            total_score = min(100, round(skill_score + sem_score + exp_edu_score))
            
            ranked_profiles.append({
                "profile": c,
                "score": total_score,
                "matched": list(matched),
                "missing": list(missing),
                "pref_present": list(pref_present),
                "extra": list(extra)
            })

        ranked_profiles.sort(key=lambda x: x["score"], reverse=True)
        
        batch_size = 10
        processed = 0

        for i in range(0, total_candidates, batch_size):
            batch = ranked_profiles[i:i+batch_size]
            hp_json = {
                "job_title": hp.job_title,
                "job_summary": hp.job_summary
            }
            
            candidates_json = []
            for item in batch:
                c = item["profile"]
                candidates_json.append({
                    "resume_id": c.resume_id,
                    "full_name": c.full_name,
                    "skills": c.skills,
                    "experience": c.experience,
                    "match_score": item["score"]
                })
                
            from app.prompts.loader import load_prompt
            prompt = load_prompt(
                "ranking.md",
                hp_json=json.dumps(hp_json, indent=2),
                candidates_json=json.dumps(candidates_json, indent=2)
            )
            
            new_explanations = {}
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    response = llm_service.chat_completion(
                        messages=[{"role": "user", "content": prompt}],
                        response_format={"type": "json_object"}
                    )
                    
                    content = response.choices[0].message.content
                    data = json.loads(content)
                    
                    for expl in data.get("explanations", []):
                        r_id = expl["resume_id"]
                        new_explanations[r_id] = expl
                    break
                except Exception as e:
                    logger.error(f"Failed to generate explanations (attempt {attempt+1}): {e}")
                    if attempt < max_retries - 1:
                        time.sleep(2 ** attempt)

            for idx, item in enumerate(batch):
                c = item["profile"]
                r_id = c.resume_id
                expl_data = new_explanations.get(r_id) or {
                    "ai_summary": "Summary could not be generated.",
                    "strengths": [],
                    "weaknesses": [],
                    "recommendations": "",
                    "why_this_score": "Score computed deterministically."
                }
                
                ranking_data = {
                    "matched_skills": item["matched"],
                    "missing_skills": item["missing"],
                    "preferred_skills_present": item["pref_present"],
                    "missing_requirements": [],
                    "additional_relevant_skills": item["extra"],
                    "ai_summary": expl_data.get("ai_summary", ""),
                    "strengths": expl_data.get("strengths", []),
                    "weaknesses": expl_data.get("weaknesses", []),
                    "recommendations": expl_data.get("recommendations", ""),
                    "why_this_score": expl_data.get("why_this_score", ""),
                }
                
                db_rc = RankedCandidate(
                    id=str(uuid.uuid4()),
                    user_id=user_id,
                    hiring_profile_id=hp.id,
                    resume_id=r_id,
                    match_score=item["score"],
                    ranking_data=ranking_data
                )
                db.add(db_rc)
            
            db.commit()
            processed += len(batch)
            yield {"type": "progress", "processed": processed, "total": total_candidates}

        yield {"type": "complete"}

    @staticmethod
    def get_paginated_results(db: Session, hiring_profile_id: str, page: int, limit: int, user_id: str) -> dict:
        total = db.query(RankedCandidate).filter(RankedCandidate.hiring_profile_id == hiring_profile_id, RankedCandidate.user_id == user_id).count()
        
        offset = (page - 1) * limit
        ranked_records = db.query(RankedCandidate, CandidateProfile).join(
            CandidateProfile, RankedCandidate.resume_id == CandidateProfile.resume_id
        ).filter(
            RankedCandidate.hiring_profile_id == hiring_profile_id,
            RankedCandidate.user_id == user_id
        ).order_by(
            RankedCandidate.match_score.desc()
        ).offset(offset).limit(limit).all()

        results = []
        for idx, (rc, cp) in enumerate(ranked_records):
            rd = rc.ranking_data or {}
            res_dict = {
                "resume_id": rc.resume_id,
                "full_name": cp.full_name,
                "match_score": rc.match_score,
                "ranking_position": offset + idx + 1,
                "matched_skills": rd.get("matched_skills", []),
                "missing_skills": rd.get("missing_skills", []),
                "preferred_skills_present": rd.get("preferred_skills_present", []),
                "missing_requirements": rd.get("missing_requirements", []),
                "additional_relevant_skills": rd.get("additional_relevant_skills", []),
                "ai_summary": rd.get("ai_summary", ""),
                "strengths": rd.get("strengths", []),
                "weaknesses": rd.get("weaknesses", []),
                "recommendations": rd.get("recommendations", ""),
                "why_this_score": rd.get("why_this_score", ""),
                "skills": cp.skills or [],
                "education": cp.education or [],
                "projects": cp.projects or [],
                "experience": cp.experience or [],
                "certifications": cp.certifications or [],
                "department": cp.department,
                "cgpa": cp.cgpa
            }
            results.append(RankingResult(**res_dict))
            
        return {
            "items": results,
            "total": total,
            "page": page,
            "limit": limit
        }

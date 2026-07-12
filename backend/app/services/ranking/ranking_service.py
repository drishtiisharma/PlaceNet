from sqlalchemy.orm import Session
from typing import List, Dict, Any
import json

from app.database.models import HiringProfile, CandidateProfile
from app.services.resume.vector_service import VectorService
from app.services.resume.embedding_service import EmbeddingService
from app.ai.client import llm_service
from app.schemas.candidate_profile import RankingResult

class RankingService:
    @staticmethod
    def rank_candidates(db: Session, hiring_profile_id: str, top_k: int) -> List[RankingResult]:
        from app.database.models import RankingExplanationCache
        import uuid
        
        # 1. Fetch Hiring Profile
        hp = db.query(HiringProfile).filter(HiringProfile.id == hiring_profile_id).first()
        if not hp:
            raise ValueError("Hiring Profile not found")

        # 2. Fetch all candidates
        all_candidates = db.query(CandidateProfile).all()
        if not all_candidates:
            return []
            
        # 3. Semantic Retrieval (to get similarity scores)
        query_text = f"Job Title: {hp.job_title}\nSummary: {hp.job_summary}\nRequired Skills: {', '.join(hp.required_skills)}"
        query_embedding = EmbeddingService.generate_embeddings([query_text])[0]
        
        # Get top 50 matches for semantic scoring
        search_results = VectorService.collection.query(
            query_embeddings=[query_embedding],
            n_results=min(50, len(all_candidates)),
            include=["metadatas", "distances"]
        )
        
        # Map resume_id -> semantic_score (0-20 points)
        # Lower distance = better match. We'll normalize roughly based on observed L2/Cosine distances.
        semantic_scores = {}
        if search_results and "metadatas" in search_results and search_results["metadatas"]:
            for metas, distances in zip(search_results["metadatas"], search_results["distances"]):
                for meta, dist in zip(metas, distances):
                    r_id = meta["resume_id"]
                    # Inverse distance mapping (rough heuristic: distance 0->20pts, distance 2.0->0pts)
                    score = max(0, 20 - (dist * 10))
                    # Take max if chunk appears multiple times
                    semantic_scores[r_id] = max(semantic_scores.get(r_id, 0), score)

        # 4. Deterministic Scoring
        ranked_profiles = []
        req_skills = [s.strip().lower() for s in hp.required_skills]
        pref_skills = [s.strip().lower() for s in hp.preferred_skills]
        
        for c in all_candidates:
            c_skills = [s.strip().lower() for s in (c.skills or [])]
            
            matched = set(req_skills).intersection(c_skills)
            missing = set(req_skills) - set(c_skills)
            pref_present = set(pref_skills).intersection(c_skills)
            extra = set(c_skills) - set(req_skills) - set(pref_skills)
            
            # Skill Score (60 points)
            skill_score = 0
            if req_skills:
                skill_score = (len(matched) / len(req_skills)) * 60
            else:
                skill_score = 60 # Default if no required skills
                
            # Semantics (20 points)
            sem_score = semantic_scores.get(c.resume_id, 0)
            
            # Education/Experience Bonus (20 points) - simplified deterministic logic
            exp_edu_score = 10 # Default base
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

        # Sort descending by score, take top_k
        ranked_profiles.sort(key=lambda x: x["score"], reverse=True)
        top_candidates = ranked_profiles[:top_k]
        
        if not top_candidates:
            return []

        # 5. Check Cache for Explanations
        top_resume_ids = [item["profile"].resume_id for item in top_candidates]
        cached_explanations = db.query(RankingExplanationCache).filter(
            RankingExplanationCache.hiring_profile_id == hp.id,
            RankingExplanationCache.resume_id.in_(top_resume_ids)
        ).all()
        
        cache_map = {c.resume_id: c.explanation_data for c in cached_explanations}
        uncached_candidates = [item for item in top_candidates if item["profile"].resume_id not in cache_map]
        
        import logging
        logger = logging.getLogger(__name__)
        logger.info(f"[AI METRICS] Ranking Cache Hits: {len(cached_explanations)} | Uncached: {len(uncached_candidates)}")

        # 6. Batch LLM Generation for Uncached
        new_explanations = {}
        if uncached_candidates:
            hp_json = {
                "job_title": hp.job_title,
                "job_summary": hp.job_summary
            }
            
            candidates_json = []
            for item in uncached_candidates:
                c = item["profile"]
                candidates_json.append({
                    "resume_id": c.resume_id,
                    "candidate_name": c.candidate_name,
                    "skills": c.skills,
                    "experience": c.experience,
                    "match_score": item["score"]
                })
                
            from pathlib import Path
            prompt_path = Path(__file__).resolve().parent.parent.parent / "ai" / "prompts" / "ranking_explanation.md"
            prompt_template = prompt_path.read_text(encoding="utf-8")
            
            prompt = prompt_template.format(
                hp_json=json.dumps(hp_json, indent=2),
                candidates_json=json.dumps(candidates_json, indent=2)
            )
            
            import time
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
                        
                        # Save to cache
                        db_cache = RankingExplanationCache(
                            id=str(uuid.uuid4()),
                            resume_id=r_id,
                            hiring_profile_id=hp.id,
                            explanation_data=expl
                        )
                        db.add(db_cache)
                    db.commit()
                    break # Success!
                except Exception as e:
                    logger.error(f"Failed to generate explanations (attempt {attempt+1}): {e}")
                    db.rollback()
                    if attempt < max_retries - 1:
                        time.sleep(2 ** attempt) # Exponential backoff

        # 7. Construct Final Result
        results = []
        for idx, item in enumerate(top_candidates):
            c = item["profile"]
            r_id = c.resume_id
            
            # Explanations from cache or newly generated, or default empty if LLM failed completely
            expl_data = cache_map.get(r_id) or new_explanations.get(r_id) or {
                "ai_summary": "Summary could not be generated.",
                "strengths": [],
                "weaknesses": [],
                "recommendations": "",
                "why_this_score": "Score computed deterministically."
            }
            
            res_dict = {
                "resume_id": r_id,
                "candidate_name": c.candidate_name,
                "match_score": item["score"],
                "ranking_position": idx + 1,
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
                # UI needed fields:
                "skills": c.skills or [],
                "education": c.education or [],
                "projects": c.projects or [],
                "experience": c.experience or [],
                "certifications": c.certifications or [],
                "department": c.department,
                "cgpa": c.cgpa
            }
            results.append(RankingResult(**res_dict))
            
        return results

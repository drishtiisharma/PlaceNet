from sqlalchemy.orm import Session
from typing import List, Dict, Any
import json

from app.database.models import HiringProfile, CandidateProfile
from app.services.resume.vector_service import VectorService
from app.services.resume.embedding_service import EmbeddingService
from app.ai.client import client
from app.schemas.candidate_profile import RankingResult

class RankingService:
    @staticmethod
    def rank_candidates(db: Session, hiring_profile_id: str, top_k: int) -> List[RankingResult]:
        # 1. Fetch Hiring Profile
        hp = db.query(HiringProfile).filter(HiringProfile.id == hiring_profile_id).first()
        if not hp:
            raise ValueError("Hiring Profile not found")

        # 2. Fetch all candidates
        all_candidates = db.query(CandidateProfile).all()
        
        # 3. Simple Exact Match Pre-filtering (Optional logic based on requirements)
        # For simplicity, we just keep all of them here or filter strictly on CGPA/Department if they exist.
        filtered_candidates = []
        for c in all_candidates:
            # We could add strict filtering logic here
            # e.g., if hp.cgpa_requirement and c.cgpa < hp.cgpa_requirement: continue
            filtered_candidates.append(c)

        if not filtered_candidates:
            return []

        # 4. Semantic Retrieval
        # Construct a query based on hiring profile skills and summary
        query_text = f"Job Title: {hp.job_title}\nSummary: {hp.job_summary}\nRequired Skills: {', '.join(hp.required_skills)}"
        
        # Generate embedding for the query
        # EmbeddingService takes list of chunks, returns list of embeddings
        query_embedding = EmbeddingService.generate_embeddings([query_text])[0]
        
        # Search ChromaDB
        search_results = VectorService.search(query_embedding, top_k=top_k * 2) # Get a larger pool for LLM
        
        # Extract resume_ids from vector search
        retrieved_resume_ids = set()
        if search_results and "metadatas" in search_results and search_results["metadatas"]:
            for metas in search_results["metadatas"]:
                for meta in metas:
                    retrieved_resume_ids.add(meta["resume_id"])

        # Intersection with DB filtered
        shortlisted_profiles = [c for c in filtered_candidates if c.resume_id in retrieved_resume_ids]
        
        if not shortlisted_profiles:
            return []

        # 5. LLM Reranking
        # Prepare payload for LLM
        hp_json = {
            "job_title": hp.job_title,
            "required_skills": hp.required_skills,
            "preferred_skills": hp.preferred_skills,
            "job_summary": hp.job_summary
        }
        
        candidates_json = []
        for c in shortlisted_profiles[:top_k * 2]:
            candidates_json.append({
                "resume_id": c.resume_id,
                "candidate_name": c.candidate_name,
                "skills": c.skills,
                "experience": c.experience,
                "education": c.education
            })
            
        prompt = f"""
        You are an expert HR recruiter. Rank the following candidates based on the given Hiring Profile.
        
        Hiring Profile:
        {json.dumps(hp_json, indent=2)}
        
        Candidates:
        {json.dumps(candidates_json, indent=2)}
        
        Analyze each candidate against the hiring profile. Return ONLY a JSON object with a list of "rankings". 
        Limit to top {top_k} candidates.
        Format exactly like this:
        {{
          "rankings": [
            {{
              "resume_id": "string",
              "candidate_name": "string",
              "match_score": integer (0-100),
              "ranking_position": integer,
              "matched_skills": ["string"],
              "missing_skills": ["string"],
              "explanation": "short string explaining why"
            }}
          ]
        }}
        """

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            response_format={"type": "json_object"}
        )
        
        content = response.choices[0].message.content
        data = json.loads(content)
        
        results = []
        for item in data.get("rankings", []):
            results.append(RankingResult(**item))
            
        # Sort by ranking position
        results.sort(key=lambda x: x.ranking_position)
        return results

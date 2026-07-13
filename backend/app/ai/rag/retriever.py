from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database.models import CandidateProfile, HiringProfile
from app.services.resume.vector_service import VectorService
from app.services.resume.embedding_service import EmbeddingService
from app.services.hiring_profile.hiring_profile_vector_service import HiringProfileVectorService

class RAGRetriever:
    @staticmethod
    def retrieve(db: Session, intent_data: dict, query: str) -> str:
        intent = intent_data.get("intent", "general")
        names = intent_data.get("names", [])
        skills = intent_data.get("skills", [])
        job_titles = intent_data.get("job_titles", [])
        companies = intent_data.get("companies", [])
        
        context_parts = []

        import logging
        logger = logging.getLogger(__name__)

        # Sync Check
        try:
            db_count = db.query(CandidateProfile).count()
            chroma_count = VectorService.get_unique_resume_count()
            if db_count != chroma_count:
                logger.warning(f"Inconsistency detected! DB Candidates: {db_count}, ChromaDB Unique Resumes: {chroma_count}. Triggering automatic rebuild.")
                VectorService.rebuild_index_from_db(db)
        except Exception as e:
            logger.error(f"Failed to run automatic rebuild: {e}")

        # 1. Candidate Retrieval
        if intent in ["summarize_candidate", "compare_candidates", "search_candidates", "general"] or names or skills:
            if names:
                for name in names:
                    candidates = db.query(CandidateProfile).filter(
                        CandidateProfile.full_name.ilike(f"%{name}%")
                    ).limit(3).all()
                    for c in candidates:
                        context_parts.append(f"Candidate: {c.full_name} (Resume ID: {c.resume_id})\nSkills: {', '.join(c.skills if c.skills else [])}\nExperience: {c.experience}\nEducation: {c.education}")
            
            if intent == "search_candidates" or skills or (not names and intent == "general"):
                query_embedding = EmbeddingService.generate_embeddings([query])[0]
                vector_results = VectorService.search(query_embedding, top_k=150)
                
                resume_ids = []
                seen_resumes = set()
                
                retrieved_doc_ids = []
                retrieved_candidate_names = set()
                similarity_scores = []
                
                if vector_results and "metadatas" in vector_results and vector_results["metadatas"]:
                    for metas, doc_ids, dists in zip(
                        vector_results.get("metadatas", [[]]),
                        vector_results.get("ids", [[]]),
                        vector_results.get("distances", [[]]) if "distances" in vector_results else [[]] * len(vector_results.get("metadatas", [[]]))
                    ):
                        for meta, d_id, dist in zip(metas, doc_ids, dists if dists else [0.0] * len(metas)):
                            retrieved_doc_ids.append(d_id)
                            similarity_scores.append(dist)
                            
                            r_id = meta.get("resume_id")
                            c_name = meta.get("full_name")
                            if c_name:
                                retrieved_candidate_names.add(c_name)
                                
                            if r_id and r_id not in seen_resumes:
                                seen_resumes.add(r_id)
                                resume_ids.append(r_id)
                                if len(resume_ids) >= 50:
                                    break
                        if len(resume_ids) >= 50:
                            break
                
                if resume_ids:
                    candidates = db.query(CandidateProfile).filter(CandidateProfile.resume_id.in_(resume_ids)).all()
                    for c in candidates:
                        context_parts.append(f"Candidate: {c.full_name} (Resume ID: {c.resume_id})\nSkills: {', '.join(c.skills if c.skills else [])}\nExperience: {c.experience}")

                total_db_cands = db.query(CandidateProfile).count()
                total_chroma_docs = VectorService.collection.count()
                logger.info(f"[RETRIEVAL METRICS]")
                logger.info(f"Total candidates in PostgreSQL: {total_db_cands}")
                logger.info(f"Total documents in ChromaDB: {total_chroma_docs}")
                logger.info(f"Collection name: {VectorService.collection.name}")
                logger.info(f"Number of embeddings: {total_chroma_docs}")
                logger.info(f"Retriever k: 150")
                logger.info(f"Retrieved document IDs: {retrieved_doc_ids}")
                logger.info(f"Retrieved candidate names: {list(retrieved_candidate_names)}")
                logger.info(f"Similarity scores: {similarity_scores}")
                logger.info(f"Metadata filters applied: None")

        # 2. Hiring Profile Retrieval
        if intent in ["summarize_hiring_profile", "compare_hiring_profiles", "search_hiring_profiles", "general"] or job_titles or companies:
            if job_titles or companies:
                # Exact or partial match in SQL
                filters = []
                for title in job_titles:
                    filters.append(HiringProfile.job_title.ilike(f"%{title}%"))
                for company in companies:
                    filters.append(HiringProfile.company.ilike(f"%{company}%"))
                
                if filters:
                    profiles = db.query(HiringProfile).filter(or_(*filters)).limit(5).all()
                    for p in profiles:
                        context_parts.append(f"Hiring Profile: {p.job_title} at {p.company}\nID: {p.id}\nSkills: {', '.join(p.required_skills if p.required_skills else [])}\nSummary: {p.job_summary}")
            
            # Always supplement with semantic search for hiring profiles
            query_embedding = EmbeddingService.generate_embeddings([query])[0]
            vector_results = HiringProfileVectorService.search(query_embedding, top_k=5)
            
            profile_ids = set()
            if vector_results and "metadatas" in vector_results and vector_results["metadatas"]:
                for metas in vector_results["metadatas"]:
                    for meta in metas:
                        if "profile_id" in meta:
                            profile_ids.add(meta["profile_id"])
            
            if profile_ids:
                profiles = db.query(HiringProfile).filter(HiringProfile.id.in_(profile_ids)).all()
                for p in profiles:
                    # Avoid duplicates if already added via exact match
                    if not any(p.id in part for part in context_parts):
                        context_parts.append(f"Hiring Profile: {p.job_title} at {p.company}\nID: {p.id}\nSkills: {', '.join(p.required_skills if p.required_skills else [])}\nSummary: {p.job_summary}")

        if not context_parts:
            context_parts.append("No specific context found.")

        final_context = "\n\n---\n\n".join(context_parts)
        logger.info(f"[RETRIEVAL METRICS] Final context sent to LLM:\n{final_context}")
        
        return final_context

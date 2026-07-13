from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database.connection import get_db
from app.database.models import CandidateProfile
from app.services.resume.vector_service import VectorService
from app.services.resume.embedding_service import EmbeddingService

router = APIRouter(
    prefix="/search",
    tags=["Search"]
)

class SearchQuery(BaseModel):
    query: str
    top_k: int = 10

@router.post("/")
def search_resumes(search_req: SearchQuery, db: Session = Depends(get_db)):
    query = search_req.query
    if not query.strip():
        return []

    try:
        # Generate semantic embedding
        query_embedding = EmbeddingService.generate_embeddings([query])[0]
        
        # Search ChromaDB
        vector_results = VectorService.search(query_embedding, top_k=search_req.top_k)
        
        # Extract unique resume_ids from results
        resume_ids = set()
        if vector_results and "metadatas" in vector_results and vector_results["metadatas"]:
            for metas in vector_results["metadatas"]:
                for meta in metas:
                    resume_ids.add(meta["resume_id"])

        if not resume_ids:
            return []

        # Fetch matched candidates from DB
        candidates = db.query(CandidateProfile).filter(CandidateProfile.resume_id.in_(resume_ids)).all()
        
        # Format like /resume/library return type
        results = []
        for c in candidates:
            # We need original_filename and resume_path which we can pull from vector metadata 
            # Or we can do a simpler return format since frontend expects { resume_id, full_name, original_filename, resume_path }
            # Let's extract them from the metadata to match the frontend expectations
            original_filename = "resume.pdf"
            resume_path = ""
            for metas in vector_results["metadatas"]:
                for meta in metas:
                    if meta["resume_id"] == c.resume_id:
                        original_filename = meta.get("original_filename", original_filename)
                        resume_path = meta.get("resume_path", resume_path)
                        break

            results.append({
                "resume_id": c.resume_id,
                "full_name": c.full_name,
                "original_filename": original_filename,
                "resume_path": resume_path
            })
            
        return results

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

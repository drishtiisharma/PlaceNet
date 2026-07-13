from pathlib import Path

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Depends,
)
from fastapi.responses import FileResponse, HTMLResponse

from typing import List

from app.services.resume.resume_pipeline import ResumePipeline
from app.services.resume.vector_service import VectorService

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)

import logging

logger = logging.getLogger(__name__)

@router.post("/process")
async def process_resumes(
    files: List[UploadFile] = File(...)
):
    try:
        logger.info(f"Received request to process {len(files)} resumes.")
        result = await ResumePipeline.process_resumes(files)
        logger.info(f"Resume processing successful: {result}")
        return result

    except Exception as e:
        logger.error(f"Error processing resumes: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Backend Error: {str(e)}"
        )

from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi import Depends
from app.database.connection import get_db
from app.database.models import CandidateProfile
from sqlalchemy import or_, desc, asc

class BulkDeleteRequest(BaseModel):
    resume_ids: List[str]

@router.get("/library/list")
def list_resumes(
    page: int = 1,
    limit: int = 10,
    search: str = "",
    branch: str = "",
    year: str = "",
    cgpa: str = "",
    skill: str = "",
    sort_by: str = "created_at",
    sort_order: str = "desc",
    db: Session = Depends(get_db)
):
    query = db.query(CandidateProfile)
    
    if search:
        query = query.filter(or_(
            CandidateProfile.full_name.ilike(f"%{search}%"),
            CandidateProfile.original_filename.ilike(f"%{search}%")
        ))
    if branch and branch != "all":
        query = query.filter(CandidateProfile.department.ilike(f"%{branch}%"))
    if cgpa and cgpa != "all":
        # Rough cgpa filtering based on string match for simplicity
        query = query.filter(CandidateProfile.cgpa.ilike(f"%{cgpa}%"))
        
    if sort_order == "desc":
        query = query.order_by(desc(getattr(CandidateProfile, sort_by, CandidateProfile.created_at)))
    else:
        query = query.order_by(asc(getattr(CandidateProfile, sort_by, CandidateProfile.created_at)))
        
    total = query.count()
    items = query.offset((page - 1) * limit).limit(limit).all()
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit
    }

@router.post("/bulk-delete")
def bulk_delete_resumes(request: BulkDeleteRequest, db: Session = Depends(get_db)):
    deleted_count = 0
    for resume_id in request.resume_ids:
        candidate = db.query(CandidateProfile).filter(CandidateProfile.resume_id == resume_id).first()
        if candidate:
            pdf = Path(candidate.resume_path)
            if pdf.exists():
                pdf.unlink()
            db.delete(candidate)
            VectorService.delete_resume(resume_id)
            deleted_count += 1
    db.commit()
    return {"message": f"Deleted {deleted_count} resumes successfully."}

@router.get("/stats")
def get_resume_stats(db: Session = Depends(get_db)):
    total = db.query(CandidateProfile).count()
    last_indexed = db.query(CandidateProfile).order_by(desc(CandidateProfile.created_at)).first()
    return {
        "total": total,
        "indexed": total,
        "failed": 0,
        "last_indexed": last_indexed.created_at if last_indexed else None
    }

@router.get("/view/{resume_id}")
def view_resume(resume_id: str, db: Session = Depends(get_db)):
    candidate = db.query(CandidateProfile).filter(CandidateProfile.resume_id == resume_id).first()
    
    error_html = """
    <html><body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f9fafb; margin: 0;">
        <div style="text-align: center; padding: 2.5rem; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #f3f4f6; max-width: 400px;">
            <svg style="width: 48px; height: 48px; color: #ef4444; margin: 0 auto 1rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 style="color: #111827; margin-bottom: 0.5rem; font-size: 1.25rem;">Resume Unavailable</h2>
            <p style="color: #6b7280; font-size: 0.875rem; line-height: 1.5; margin-bottom: 1.5rem;">The requested PDF could not be found on the server. It may have been deleted or moved.</p>
            <button onclick="window.close()" style="background: #f97316; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; font-weight: 500; cursor: pointer;">Close Tab</button>
        </div>
    </body></html>
    """

    if not candidate or not Path(candidate.resume_path).exists():
        return HTMLResponse(content=error_html, status_code=404)
        
    return FileResponse(path=candidate.resume_path, media_type="application/pdf", filename=candidate.original_filename, content_disposition_type="inline")

@router.get("/download/{resume_id}")
def download_resume(resume_id: str, db: Session = Depends(get_db)):
    candidate = db.query(CandidateProfile).filter(CandidateProfile.resume_id == resume_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Resume not found.")
    return FileResponse(path=candidate.resume_path, filename=candidate.original_filename)

@router.delete("/{resume_id}")
def delete_resume(resume_id: str, db: Session = Depends(get_db)):
    candidate = db.query(CandidateProfile).filter(CandidateProfile.resume_id == resume_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Resume not found.")
    pdf = Path(candidate.resume_path)
    if pdf.exists():
        pdf.unlink()
    db.delete(candidate)
    db.commit()
    VectorService.delete_resume(resume_id)
    return {"message": "Resume deleted successfully."}
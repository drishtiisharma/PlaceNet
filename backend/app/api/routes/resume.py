from typing import List

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.resume.resume_pipeline import ResumePipeline

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)

@router.post("/process")
async def process_resumes(
    files: List[UploadFile] = File(...)
):
    """
    Upload and process one or more resumes.
    """
    try:
        result = await ResumePipeline.process_resumes(files)
        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
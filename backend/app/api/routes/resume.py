from pathlib import Path

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
)
from fastapi.responses import FileResponse

from typing import List

from app.services.resume.resume_pipeline import ResumePipeline
from app.services.resume.vector_service import VectorService

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)


@router.post("/process")
async def process_resumes(
    files: List[UploadFile] = File(...)
):
    try:
        return await ResumePipeline.process_resumes(files)

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Backend Error: {str(e)}"
        )


@router.get("/library")
def get_resume_library():
    """
    Returns one record per uploaded resume.
    """

    return VectorService.get_all_resumes()


@router.get("/view/{resume_id}")
def view_resume(resume_id: str):

    resume = VectorService.get_resume(resume_id)

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found."
        )

    return FileResponse(
        path=resume["resume_path"],
        media_type="application/pdf",
        filename=resume["original_filename"]
    )


@router.get("/download/{resume_id}")
def download_resume(resume_id: str):

    resume = VectorService.get_resume(resume_id)

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found."
        )

    return FileResponse(
        path=resume["resume_path"],
        filename=resume["original_filename"]
    )


@router.delete("/{resume_id}")
def delete_resume(resume_id: str):

    resume = VectorService.get_resume(resume_id)

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found."
        )

    pdf = Path(resume["resume_path"])

    if pdf.exists():
        pdf.unlink()

    VectorService.delete_resume(resume_id)

    return {
        "message": "Resume deleted successfully."
    }
import os
import logging
from fastapi import APIRouter, HTTPException, Request
from supabase import create_client, Client

router = APIRouter(tags=["auth"])
logger = logging.getLogger(__name__)

def get_supabase_admin_client() -> Client:
    url: str = os.environ.get("SUPABASE_URL", "")
    key: str = os.environ.get("SUPABASE_SECRET_KEY", "")
    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_SECRET_KEY must be set.")
    return create_client(url, key)

from app.database.connection import get_db
from sqlalchemy.orm import Session
from fastapi import Depends
from app.database.models import CandidateProfile, HiringProfile, ChatSession, ChatMessage, RankingExplanationCache, RankedCandidate
from app.services.resume.storage_service import StorageService
from app.services.resume.vector_service import VectorService
from pathlib import Path

@router.delete("/auth/account/{user_id}")
async def delete_account(user_id: str, request: Request, db: Session = Depends(get_db)):
    """
    Secure endpoint to comprehensively delete a user and all their data.
    """
    try:
        supabase_admin = get_supabase_admin_client()
        
        # Verify auth token matches user_id for security
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
            
        token = auth_header.split(" ")[1]
        user_res = supabase_admin.auth.get_user(token)
        if not user_res or not user_res.user or user_res.user.id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this account")

        # 1. Handle File & Vector Cleanup for Candidates
        candidates = db.query(CandidateProfile).filter(CandidateProfile.user_id == user_id).all()
        for candidate in candidates:
            # Delete local file if exists
            if candidate.resume_path:
                pdf = Path(candidate.resume_path)
                if pdf.exists():
                    pdf.unlink()
            
            # Delete Vector Embeddings
            if candidate.resume_id:
                try:
                    VectorService.delete_resume(candidate.resume_id)
                except Exception as e:
                    logger.error(f"Failed to delete vector embeddings for resume {candidate.resume_id}: {e}")

        # Delete from Supabase Storage bucket
        try:
            StorageService.delete_all_resumes(user_id)
        except Exception as e:
            logger.error(f"Failed to delete files from Supabase Storage for user {user_id}: {e}")

        # 2. Database Record Cleanup
        try:
            db.query(CandidateProfile).filter(CandidateProfile.user_id == user_id).delete()
            db.query(HiringProfile).filter(HiringProfile.user_id == user_id).delete()
            db.query(ChatSession).filter(ChatSession.user_id == user_id).delete()
            db.query(ChatMessage).filter(ChatMessage.user_id == user_id).delete()
            db.query(RankingExplanationCache).filter(RankingExplanationCache.user_id == user_id).delete()
            db.query(RankedCandidate).filter(RankedCandidate.user_id == user_id).delete()
            db.commit()
        except Exception as e:
            db.rollback()
            logger.error(f"Database cleanup failed for user {user_id}: {e}")
            raise HTTPException(status_code=500, detail="Failed to cleanup database records")

        # 3. Delete user using Admin API
        supabase_admin.auth.admin.delete_user(user_id)
        
        return {"message": "Account and all associated data deleted successfully"}
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Failed to delete account {user_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

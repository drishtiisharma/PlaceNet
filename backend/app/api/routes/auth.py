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

@router.delete("/auth/account/{user_id}")
async def delete_account(user_id: str, request: Request):
    """
    Secure endpoint to delete a user from Supabase Authentication.
    Uses the Service Role Key. 
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

        # Delete user using Admin API
        supabase_admin.auth.admin.delete_user(user_id)
        
        return {"message": "Account deleted successfully"}
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Failed to delete account {user_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

import os
from fastapi import Request, HTTPException
from supabase import create_client

def get_current_user_id(request: Request) -> str:
    """
    Extracts the user_id from the Authorization header using Supabase.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    
    token = auth_header.split(" ")[1]
    
    url = os.environ.get("SUPABASE_URL", "")
    key = os.environ.get("SUPABASE_SECRET_KEY", "")
    
    if not url or not key:
        raise HTTPException(status_code=500, detail="Supabase configuration missing on server")
        
    supabase_admin = create_client(url, key)
    
    user_res = supabase_admin.auth.get_user(token)
    if not user_res or not user_res.user:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    return user_res.user.id

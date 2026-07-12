from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.schemas.hiring_profile import HiringProfileCreate, HiringProfileResponse
from app.services.hiring_profile.hiring_profile_service import HiringProfileService

router = APIRouter(
    prefix="/hiring-profile",
    tags=["Hiring Profile"]
)

@router.post("/parse", response_model=HiringProfileCreate)
async def parse_jd(file: UploadFile = File(...)):
    file_bytes = await file.read()
    return HiringProfileService.parse_jd(file_bytes, file.filename)

@router.post("/", response_model=HiringProfileResponse)
def create_profile(profile: HiringProfileCreate, db: Session = Depends(get_db)):
    return HiringProfileService.create_profile(db, profile)

@router.get("/", response_model=List[HiringProfileResponse])
def get_profiles(db: Session = Depends(get_db)):
    return HiringProfileService.get_profiles(db)

@router.get("/{profile_id}", response_model=HiringProfileResponse)
def get_profile(profile_id: str, db: Session = Depends(get_db)):
    profile = HiringProfileService.get_profile(db, profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/{profile_id}", response_model=HiringProfileResponse)
def update_profile(profile_id: str, profile_update: HiringProfileCreate, db: Session = Depends(get_db)):
    updated_profile = HiringProfileService.update_profile(db, profile_id, profile_update)
    if not updated_profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return updated_profile

@router.delete("/{profile_id}")
def delete_profile(profile_id: str, db: Session = Depends(get_db)):
    profile = HiringProfileService.delete_profile(db, profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {"message": "Profile deleted successfully"}

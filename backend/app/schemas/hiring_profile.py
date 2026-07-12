from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class HiringProfileBase(BaseModel):
    job_title: str
    company: Optional[str] = None
    required_skills: List[str] = Field(default_factory=list)
    preferred_skills: List[str] = Field(default_factory=list)
    experience: Optional[str] = None
    education: Optional[str] = None
    eligible_departments: List[str] = Field(default_factory=list)
    cgpa_requirement: Optional[str] = None
    certifications: List[str] = Field(default_factory=list)
    responsibilities: List[str] = Field(default_factory=list)
    keywords: List[str] = Field(default_factory=list)
    job_summary: Optional[str] = None

class HiringProfileCreate(HiringProfileBase):
    pass

class HiringProfileResponse(HiringProfileBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

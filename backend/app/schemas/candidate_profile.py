from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class CandidateProfileBase(BaseModel):
    candidate_name: str
    skills: List[str] = Field(default_factory=list)
    education: List[str] = Field(default_factory=list)
    projects: List[str] = Field(default_factory=list)
    experience: List[str] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    department: Optional[str] = None
    cgpa: Optional[str] = None

class CandidateProfileCreate(CandidateProfileBase):
    resume_id: str

class CandidateProfileResponse(CandidateProfileBase):
    id: str
    resume_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class RankingResult(BaseModel):
    resume_id: str
    candidate_name: str
    match_score: int
    ranking_position: int
    matched_skills: List[str]
    missing_skills: List[str]
    explanation: str

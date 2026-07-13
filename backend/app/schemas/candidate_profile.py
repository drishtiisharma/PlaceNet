from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import datetime

class CandidateProfileBase(BaseModel):
    full_name: str
    skills: List[str] = Field(default_factory=list)
    education: List[str] = Field(default_factory=list)
    projects: List[str] = Field(default_factory=list)
    experience: List[str] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    department: Optional[str] = None
    cgpa: Optional[str] = None

    @field_validator('skills', 'education', 'projects', 'experience', 'certifications', mode='before')
    def parse_lists(cls, v):
        if v is None:
            return []
        return v

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
    full_name: str
    match_score: int
    ranking_position: int
    matched_skills: List[str]
    missing_skills: List[str]
    preferred_skills_present: List[str]
    missing_requirements: List[str]
    additional_relevant_skills: List[str]
    ai_summary: str
    strengths: List[str]
    weaknesses: List[str]
    recommendations: str
    why_this_score: str
    
    # Combined structured candidate data
    skills: List[str] = Field(default_factory=list)
    education: List[str] = Field(default_factory=list)
    projects: List[str] = Field(default_factory=list)
    experience: List[str] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    department: Optional[str] = None
    cgpa: Optional[str] = None

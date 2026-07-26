from sqlalchemy import Column, String, Text, JSON, DateTime, Integer
from datetime import datetime, timezone
from app.database.connection import Base

class HiringProfile(Base):
    __tablename__ = "hiring_profiles"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)
    job_title = Column(String, index=True)
    company = Column(String, nullable=True)
    required_skills = Column(JSON, default=[])
    preferred_skills = Column(JSON, default=[])
    experience = Column(String, nullable=True)
    education = Column(String, nullable=True)
    eligible_departments = Column(JSON, default=[])
    cgpa_requirement = Column(String, nullable=True)
    certifications = Column(JSON, default=[])
    responsibilities = Column(JSON, default=[])
    keywords = Column(JSON, default=[])
    job_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)
    resume_id = Column(String, index=True)
    full_name = Column(String, index=True)
    skills = Column(JSON, default=[])
    education = Column(JSON, default=[])
    projects = Column(JSON, default=[])
    experience = Column(JSON, default=[])
    certifications = Column(JSON, default=[])
    department = Column(String, nullable=True)
    cgpa = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    resume_path = Column(String, nullable=True)
    resume_storage_path = Column(String, nullable=True)
    resume_path = Column(String, nullable=True)
    original_filename = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)
    title = Column(String, default="New Chat")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)
    session_id = Column(String, index=True)
    role = Column(String) # 'user' or 'assistant'
    content = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class RankingExplanationCache(Base):
    __tablename__ = "ranking_explanations"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)
    resume_id = Column(String, index=True)
    hiring_profile_id = Column(String, index=True)
    explanation_data = Column(JSON)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class RankedCandidate(Base):
    __tablename__ = "ranked_candidates"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)
    hiring_profile_id = Column(String, index=True)
    resume_id = Column(String, index=True)
    match_score = Column(Integer)
    ranking_data = Column(JSON)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

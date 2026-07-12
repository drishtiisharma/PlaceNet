from sqlalchemy.orm import Session
from uuid import uuid4
import json

from app.database.models import HiringProfile
from app.schemas.hiring_profile import HiringProfileCreate
from app.services.hiring_profile.hiring_profile_vector_service import HiringProfileVectorService
from app.ai.parsing.jd_extractor import JDExtractor
from app.services.resume.parser_service import ParserService

class HiringProfileService:
    @staticmethod
    def parse_jd(file_bytes: bytes, filename: str) -> HiringProfileCreate:
        # Parse document to text
        parsed = ParserService.parse(file_bytes, filename)
        text = parsed.resume_text
        
        # Extract structured JSON via LLM
        hiring_profile_data = JDExtractor.extract(text)
        return hiring_profile_data

    @staticmethod
    def create_profile(db: Session, profile: HiringProfileCreate) -> HiringProfile:
        profile_id = str(uuid4())
        
        db_profile = HiringProfile(
            id=profile_id,
            job_title=profile.job_title,
            company=profile.company,
            required_skills=profile.required_skills,
            preferred_skills=profile.preferred_skills,
            experience=profile.experience,
            education=profile.education,
            eligible_departments=profile.eligible_departments,
            cgpa_requirement=profile.cgpa_requirement,
            certifications=profile.certifications,
            responsibilities=profile.responsibilities,
            keywords=profile.keywords,
            job_summary=profile.job_summary
        )
        db.add(db_profile)
        db.commit()
        db.refresh(db_profile)

        # Prepare text for vector chunking
        text_for_vector = f"Job Title: {profile.job_title}\nCompany: {profile.company}\nSummary: {profile.job_summary}\nRequired Skills: {', '.join(profile.required_skills)}\nResponsibilities: {', '.join(profile.responsibilities)}"
        
        HiringProfileVectorService.chunk_and_store(
            profile_id=profile_id,
            job_title=profile.job_title,
            text=text_for_vector
        )

        return db_profile

    @staticmethod
    def update_profile(db: Session, profile_id: str, profile_update: HiringProfileCreate) -> HiringProfile:
        db_profile = db.query(HiringProfile).filter(HiringProfile.id == profile_id).first()
        if not db_profile:
            return None
        
        db_profile.job_title = profile_update.job_title
        db_profile.company = profile_update.company
        db_profile.required_skills = profile_update.required_skills
        db_profile.preferred_skills = profile_update.preferred_skills
        db_profile.experience = profile_update.experience
        db_profile.education = profile_update.education
        db_profile.eligible_departments = profile_update.eligible_departments
        db_profile.cgpa_requirement = profile_update.cgpa_requirement
        db_profile.certifications = profile_update.certifications
        db_profile.responsibilities = profile_update.responsibilities
        db_profile.keywords = profile_update.keywords
        db_profile.job_summary = profile_update.job_summary

        db.commit()
        db.refresh(db_profile)

        # Re-embed vector chunks
        HiringProfileVectorService.delete_profile(profile_id)
        text_for_vector = f"Job Title: {db_profile.job_title}\nCompany: {db_profile.company}\nSummary: {db_profile.job_summary}\nRequired Skills: {', '.join(db_profile.required_skills)}\nResponsibilities: {', '.join(db_profile.responsibilities)}"
        
        HiringProfileVectorService.chunk_and_store(
            profile_id=profile_id,
            job_title=db_profile.job_title,
            text=text_for_vector
        )

        return db_profile

    @staticmethod
    def get_profiles(db: Session):
        return db.query(HiringProfile).all()

    @staticmethod
    def get_profile(db: Session, profile_id: str):
        return db.query(HiringProfile).filter(HiringProfile.id == profile_id).first()

    @staticmethod
    def delete_profile(db: Session, profile_id: str):
        profile = db.query(HiringProfile).filter(HiringProfile.id == profile_id).first()
        if profile:
            db.delete(profile)
            db.commit()
            HiringProfileVectorService.delete_profile(profile_id)
        return profile

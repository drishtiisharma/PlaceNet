import re
import spacy
from typing import List, Optional
from app.schemas.hiring_profile import HiringProfileCreate

# Load spaCy model (lightweight)
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    # Fallback if not downloaded (won't happen if properly installed)
    pass

class DeterministicJDParser:
    TECH_SKILLS = [
        "python", "java", "javascript", "react", "node", "aws", "sql", "c++", 
        "docker", "kubernetes", "typescript", "c#", "ruby", "go", "php", "angular", 
        "vue", "django", "flask", "fastapi", "spring", "html", "css", "machine learning",
        "data science", "nlp", "pandas", "numpy", "pytorch", "tensorflow", "scikit-learn"
    ]
    
    SOFT_SKILLS = [
        "communication", "leadership", "teamwork", "problem solving", "analytical", 
        "agile", "scrum", "time management", "critical thinking"
    ]
    
    DEGREES = ["bachelor", "master", "phd", "b.tech", "m.tech", "b.sc", "m.sc", "b.e", "m.e", "bca", "mca"]
    
    DEPARTMENTS = [
        "computer science", "information technology", "electrical", "electronics", 
        "mechanical", "civil", "data science", "artificial intelligence"
    ]

    @staticmethod
    def _extract_skills(text: str, skill_list: List[str]) -> List[str]:
        found = set()
        text_lower = text.lower()
        for skill in skill_list:
            if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
                found.add(skill.title())
        return list(found)

    @staticmethod
    def _extract_regex(text: str, pattern: str) -> Optional[str]:
        match = re.search(pattern, text, re.IGNORECASE)
        return match.group(1).strip() if match else None

    @classmethod
    def parse(cls, text: str) -> HiringProfileCreate:
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        # 1. Job Title & Company (Heuristic: Top lines)
        job_title = "Software Engineer" # Fallback
        company = None
        
        for i, line in enumerate(lines[:10]):
            if re.search(r'(role|title|position)[\s:]+(.*)', line, re.IGNORECASE):
                job_title = re.search(r'(role|title|position)[\s:]+(.*)', line, re.IGNORECASE).group(2).strip()
                break
            elif i == 0 and len(line) < 50:
                job_title = line
                
        for line in lines[:15]:
            if re.search(r'(company|organization)[\s:]+(.*)', line, re.IGNORECASE):
                company = re.search(r'(company|organization)[\s:]+(.*)', line, re.IGNORECASE).group(2).strip()
                break

        # 2. Experience
        experience = cls._extract_regex(text, r'(\d+[\s\-to]*\d+\+?\s*(?:years?|yrs?)(?:\s*of\s*experience)?)')
        
        # 3. CGPA Requirement
        cgpa_requirement = cls._extract_regex(text, r'(?:cgpa|gpa)[\s:>=-]*((?:\d\.\d+|\d(?!\d)))')
        if cgpa_requirement:
            cgpa_requirement = f"{cgpa_requirement} CGPA"

        # 4. Education
        education_found = []
        for degree in cls.DEGREES:
            if re.search(r'\b' + re.escape(degree) + r'\b', text.lower()):
                education_found.append(degree.upper() if len(degree) <= 4 else degree.title())
        education = ", ".join(education_found) if education_found else None

        # 5. Skills
        all_tech = cls._extract_skills(text, cls.TECH_SKILLS)
        all_soft = cls._extract_skills(text, cls.SOFT_SKILLS)
        
        required_skills = all_tech[:min(5, len(all_tech))]
        preferred_skills = all_tech[min(5, len(all_tech)):] + all_soft
        
        # 6. Eligible Departments
        eligible_departments = cls._extract_skills(text, cls.DEPARTMENTS)
        
        # 7. Responsibilities (Heuristic: bullet points after 'responsibilities' keyword)
        responsibilities = []
        in_resp_section = False
        for line in lines:
            if re.search(r'(responsibilities|what you will do|role description)', line, re.IGNORECASE):
                in_resp_section = True
                continue
            if in_resp_section:
                if re.match(r'^[\-\*\u2022]\s+', line) or re.match(r'^\d+\.\s+', line):
                    clean_line = re.sub(r'^[\-\*\u2022\d\.]+\s+', '', line)
                    if len(clean_line) > 10:
                        responsibilities.append(clean_line)
                elif len(line) > 0 and not re.match(r'^[\-\*\u2022\d\.]', line) and len(responsibilities) > 0:
                    # Stop if we hit a new section (not a bullet point)
                    break
        
        if not responsibilities:
            # Fallback if no explicit section
            for line in lines:
                if re.match(r'^[\-\*\u2022]\s+(develop|build|create|manage|lead|collaborate|design|implement|write)', line, re.IGNORECASE):
                    responsibilities.append(re.sub(r'^[\-\*\u2022\d\.]+\s+', '', line))
                    
        # 8. Keywords
        keywords = all_tech + all_soft
        
        # 9. Job Summary
        job_summary = " ".join(lines[:5])
        if len(job_summary) > 200:
            job_summary = job_summary[:197] + "..."

        return HiringProfileCreate(
            job_title=job_title,
            company=company,
            required_skills=required_skills,
            preferred_skills=preferred_skills,
            experience=experience,
            education=education,
            eligible_departments=eligible_departments,
            cgpa_requirement=cgpa_requirement,
            certifications=[],
            responsibilities=responsibilities[:5], # Limit to 5
            keywords=keywords[:10],
            job_summary=job_summary
        )

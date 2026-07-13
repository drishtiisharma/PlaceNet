from dataclasses import dataclass, field
from typing import List, Optional

@dataclass
class ParsedResume:
    full_name: str
    resume_text: str
    extracted_email: Optional[str] = None
    extracted_phone: Optional[str] = None
    extracted_skills: List[str] = field(default_factory=list)
    extracted_cgpa: Optional[str] = None
    extracted_education: List[str] = field(default_factory=list)
    extracted_experience: List[str] = field(default_factory=list)
    extracted_projects: List[str] = field(default_factory=list)
    extracted_certifications: List[str] = field(default_factory=list)
    extracted_department: Optional[str] = None
    extracted_degree: Optional[str] = None

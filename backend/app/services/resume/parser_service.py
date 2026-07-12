import re
from pathlib import Path
from io import BytesIO
import fitz
from docx import Document
import spacy

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    nlp = None

from app.models.parsed_resume import ParsedResume

COMMON_SKILLS = {
    "python", "java", "c++", "c#", "javascript", "typescript", "react", "angular", "vue", 
    "node.js", "express", "django", "flask", "fastapi", "spring boot", "sql", "mysql", 
    "postgresql", "mongodb", "aws", "azure", "gcp", "docker", "kubernetes", "git", 
    "machine learning", "deep learning", "nlp", "data analysis", "html", "css", "tailwind",
    "scikit-learn", "tensorflow", "pytorch", "pandas", "numpy", "powerbi", "tableau",
    "ruby", "php", "go", "rust", "kotlin", "swift", "dart", "flutter", "react native",
    "graphql", "rest", "linux", "bash", "agile", "scrum", "devops", "ci/cd", "jenkins"
}
DEGREES = {"b.tech", "btech", "m.tech", "mtech", "b.e.", "b.e", "b.sc", "bsc", "bca", "mca", "b.com", "bba", "mba", "phd", "bachelor", "master"}
BRANCHES = {"computer science", "information technology", "electronics", "electrical", "mechanical", "civil", "chemical", "aerospace", "data science", "artificial intelligence", "ai", "ml"}

class ParserService:
    @staticmethod
    def parse(file_bytes: bytes, filename: str) -> ParsedResume:
        extension = Path(filename).suffix.lower()

        if extension == ".pdf":
            text = ParserService._parse_pdf(file_bytes)
        elif extension == ".docx":
            text = ParserService._parse_docx(file_bytes)
        elif extension in [".txt", ".md"]:
            text = file_bytes.decode("utf-8")
        else:
            raise ValueError(f"Unsupported file type: {extension}")

        text = text.strip()
        if not text:
            raise ValueError("No readable text found in resume.")

        name = ParserService._extract_name(text, filename)
        email = ParserService._extract_email(text)
        phone = ParserService._extract_phone(text)
        skills = ParserService._extract_skills(text)
        cgpa = ParserService._extract_cgpa(text)
        education_lines = ParserService._extract_section(text, ["education", "academic background"])
        experience_lines = ParserService._extract_section(text, ["experience", "work history", "employment"])
        projects_lines = ParserService._extract_section(text, ["projects", "personal projects"])
        certifications_lines = ParserService._extract_section(text, ["certifications", "courses"])

        degree, branch = ParserService._extract_degree_branch(text)

        parsed = ParsedResume(
            candidate_name=name,
            resume_text=text
        )
        
        parsed.extracted_email = email
        parsed.extracted_phone = phone
        parsed.extracted_skills = skills
        parsed.extracted_cgpa = cgpa
        parsed.extracted_education = education_lines
        parsed.extracted_experience = experience_lines
        parsed.extracted_projects = projects_lines
        parsed.extracted_certifications = certifications_lines
        parsed.extracted_department = branch
        parsed.extracted_degree = degree

        return parsed

    @staticmethod
    def _parse_pdf(file_bytes: bytes) -> str:
        pdf = fitz.open(stream=file_bytes, filetype="pdf")
        pages = [page.get_text() for page in pdf]
        pdf.close()
        return "\n".join(pages)

    @staticmethod
    def _parse_docx(file_bytes: bytes) -> str:
        document = Document(BytesIO(file_bytes))
        text = [p.text.strip() for p in document.paragraphs if p.text.strip()]
        for table in document.tables:
            for row in table.rows:
                for cell in row.cells:
                    if cell.text.strip():
                        text.append(cell.text.strip())
        return "\n".join(text)

    @staticmethod
    def _is_valid_name(name: str) -> bool:
        if not name:
            return False
        words = name.split()
        if not (2 <= len(words) <= 4):
            return False
            
        blacklist = set(COMMON_SKILLS).union(DEGREES).union(BRANCHES)
        blacklist.update([
            "developer", "engineer", "manager", "university", "college", "school", 
            "institute", "technology", "governance", "which", "the", "and", "resume", 
            "cv", "profile", "summary", "email", "phone", "contact", "address"
        ])
        
        for w in words:
            if w.lower() in blacklist or not w.isalpha():
                return False
        return True

    @staticmethod
    def _extract_name(text: str, filename: str) -> str:
        if nlp:
            doc = nlp(text[:1000])
            for ent in doc.ents:
                if ent.label_ == "PERSON":
                    clean_ent = ent.text.strip().title()
                    if ParserService._is_valid_name(clean_ent):
                        return clean_ent

        lines = text.splitlines()
        for line in lines[:10]:
            line = line.strip()
            if line and re.match(r"^[A-Z][a-z]+(\s[A-Z][a-z]+){1,3}$", line.title()):
                clean_line = line.title()
                if ParserService._is_valid_name(clean_line):
                    return clean_line

        base = Path(filename).stem
        cleaned = re.sub(r"[_]", " ", base)
        cleaned = re.sub(r"-", " ", cleaned)
        cleaned = re.sub(r"(?i)\b(resume|cv|final|copy|version|v\d+)\b", "", cleaned)
        cleaned = re.sub(r"[()\[\]0-9]", "", cleaned)
        cleaned = " ".join(cleaned.split()).strip()
        if cleaned and len(cleaned) > 2:
            clean_title = cleaned.title()
            if ParserService._is_valid_name(clean_title):
                return clean_title

        return "Unknown Candidate"

    @staticmethod
    def _extract_email(text: str) -> str:
        match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
        return match.group(0) if match else None

    @staticmethod
    def _extract_phone(text: str) -> str:
        match = re.search(r"(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}", text)
        return match.group(0) if match else None

    @staticmethod
    def _extract_cgpa(text: str) -> str:
        match = re.search(r"(?i)(?:cgpa|gpa)[\s:]*([0-9]\.[0-9]+)", text)
        if match:
            return match.group(1)
        match2 = re.search(r"([0-9]\.[0-9]+)\s*/\s*10", text)
        if match2:
            return match2.group(1)
        return None

    @staticmethod
    def _extract_degree_branch(text: str):
        text_lower = text.lower()
        degree = next((d for d in DEGREES if re.search(r"\b" + re.escape(d) + r"\b", text_lower)), None)
        branch = next((b for b in BRANCHES if re.search(r"\b" + re.escape(b) + r"\b", text_lower)), None)
        return degree, branch

    @staticmethod
    def _extract_skills(text: str) -> list[str]:
        text_lower = text.lower()
        found = []
        for skill in COMMON_SKILLS:
            if re.search(r"\b" + re.escape(skill) + r"\b", text_lower):
                found.append(skill.title())
        return list(set(found))

    @staticmethod
    def _extract_section(text: str, keywords: list[str]) -> list[str]:
        lines = text.splitlines()
        in_section = False
        section_lines = []
        for line in lines:
            line_lower = line.strip().lower()
            if any(k == line_lower for k in keywords):
                in_section = True
                continue
            if in_section:
                if line.isupper() and len(line) < 30 and " " not in line:
                    break
                if len(line.strip()) > 0:
                    section_lines.append(line.strip())
        res = []
        chunk = ""
        for l in section_lines[:15]:
            if len(chunk) < 200:
                chunk += " " + l
            else:
                res.append(chunk.strip())
                chunk = l
        if chunk:
            res.append(chunk.strip())
        return res
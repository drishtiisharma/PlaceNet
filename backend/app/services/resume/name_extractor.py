import re
from pathlib import Path
import spacy

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    nlp = None

class NameExtractor:
    EXCLUSION_WORDS = {
        "java", "python", "html", "css", "c++", "sql", "react", "node.js", "node", "ai", 
        "machine", "learning", "ml", "javascript", "typescript", "c#", "ruby", "php", "go",
        "resume", "cv", "objective", "education", "skills", "experience", "projects",
        "india", "madhya", "pradesh", "rewa", "bhopal", "indore", "delhi", "mumbai", "bangalore",
        "pune", "hyderabad", "chennai", "kolkata", "location", "address", "phone", "email",
        "linkedin", "github", "contact", "summary", "profile", "professional", "personal",
        "details", "date", "birth", "nationality", "languages", "english", "hindi", "marital",
        "status", "single", "married", "male", "female", "gender", "declaration", "hobbies",
        "interests", "activities", "achievements", "certifications", "courses", "work",
        "employment", "history", "academic", "background", "qualifications", "degree",
        "bachelor", "master", "phd", "b.tech", "m.tech", "b.e", "b.sc", "bca", "mca",
        "university", "college", "school", "institute", "technology", "engineering", "science",
        "management", "business", "administration", "computer", "information", "software",
        "developer", "engineer", "manager", "analyst", "consultant", "lead", "senior", "junior",
        "intern", "fresher", "student", "candidate", "applicant", "page", "of", "curriculum", "vitae",
        "unknown"
    }

    FILENAME_STOPWORDS = {
        "resume", "cv", "final", "latest", "ats", "updated", "version", "draft", 
        "copy", "new", "profile", "compressed", "doc", "docx", "pdf", "unknown", "file"
    }

    @staticmethod
    def _clean_filename(filename: str) -> str:
        base = Path(filename).stem
        
        # Split camelCase
        base = re.sub(r'([a-z])([A-Z])', r'\1 \2', base)
        
        # Replace separators with spaces
        base = re.sub(r'[-_.]', ' ', base)
        
        # Remove versions like v2, v3
        base = re.sub(r'(?i)\bv\d+\b', '', base)
        
        # Remove digits and brackets
        base = re.sub(r'[0-9()\[\]{}]', '', base)
        
        words = base.split()
        cleaned_words = [w for w in words if w.lower() not in NameExtractor.FILENAME_STOPWORDS]
        
        cleaned_name = " ".join(cleaned_words).strip().title()
        
        if 1 <= len(cleaned_name.split()) <= 4:
            return cleaned_name
        return None

    @staticmethod
    def _is_valid_name(name: str) -> bool:
        if not name:
            return False
        
        words = name.split()
        if not (1 <= len(words) <= 4):
            return False
            
        if not re.match(r"^[A-Za-z\s\-]+$", name):
            return False
            
        for word in words:
            if word.lower() in NameExtractor.EXCLUSION_WORDS:
                return False
            if len(word) < 2:
                return False
                
        return True

    @staticmethod
    def _score_candidate(candidate: str, line_idx: int, filename_name: str) -> int:
        score = 100
        
        score -= (line_idx * 5)
        
        if filename_name:
            fn_parts = set(filename_name.lower().split())
            cand_parts = set(candidate.lower().split())
            if fn_parts.intersection(cand_parts):
                score += 50
                
        if re.match(r"^[A-Z][a-z]+(\s[A-Z][a-z]+){1,3}$", candidate):
            score += 20
            
        return score

    @classmethod
    def extract(cls, text: str, filename: str) -> str:
        candidates = []
        
        fn_name = cls._clean_filename(filename)
        if fn_name and cls._is_valid_name(fn_name):
            # Give filename a base score of 120 so strong text extractions can beat it if needed
            candidates.append({"name": fn_name, "score": 120}) 
            
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        top_lines = lines[:30]
        
        if nlp:
            joined_top = "\n".join(top_lines[:15])
            doc = nlp(joined_top)
            for ent in doc.ents:
                if ent.label_ == "PERSON":
                    clean_ent = ent.text.strip().title()
                    clean_ent = re.sub(r'[^A-Za-z\s]', '', clean_ent)
                    clean_ent = " ".join(clean_ent.split())
                    
                    if cls._is_valid_name(clean_ent):
                        idx = next((i for i, l in enumerate(top_lines) if clean_ent.lower() in l.lower()), 0)
                        score = cls._score_candidate(clean_ent, idx, fn_name)
                        candidates.append({"name": clean_ent, "score": score + 30})

        for i, line in enumerate(top_lines):
            if re.match(r"^[A-Z][a-z]+(\s[A-Z][a-z]+){1,3}$", line.title()):
                clean_line = line.title()
                if cls._is_valid_name(clean_line):
                    score = cls._score_candidate(clean_line, i, fn_name)
                    candidates.append({"name": clean_line, "score": score})
                    
            match = re.search(r"(?i)\bname\s*[:\-]\s*([A-Za-z\s]{4,30})", line)
            if match:
                clean_match = match.group(1).strip().title()
                if cls._is_valid_name(clean_match):
                    score = cls._score_candidate(clean_match, i, fn_name)
                    candidates.append({"name": clean_match, "score": score + 60}) # Higher bonus for explicit 'Name:'
        
        if not candidates:
            if fn_name: 
                return fn_name
            return "Unknown Candidate"
            
        candidates.sort(key=lambda x: x["score"], reverse=True)
        return candidates[0]["name"]

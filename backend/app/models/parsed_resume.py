from dataclasses import dataclass

@dataclass
class ParsedResume:
    candidate_name : str
    resume_text : str
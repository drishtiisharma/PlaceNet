from dataclasses import dataclass

@dataclass
class ResumeChunk:
    candidate_name : str
    section : str
    text : str

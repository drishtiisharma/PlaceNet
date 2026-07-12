import json
from app.ai.client import client
from app.schemas.candidate_profile import CandidateProfileCreate

PROMPT = """
You are an expert HR assistant. Extract the following information from the provided Resume text.
You MUST respond with a valid JSON object matching the exact schema below. Do not include any markdown formatting, code blocks, or extra text. ONLY raw JSON.

{{
    "candidate_name": "string",
    "skills": ["string"],
    "education": ["string"],
    "projects": ["string"],
    "experience": ["string"],
    "certifications": ["string"],
    "department": "string or null",
    "cgpa": "string or null"
}}

Resume Text:
{text}
"""

class ResumeExtractor:
    @staticmethod
    def extract(text: str, resume_id: str) -> CandidateProfileCreate:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": PROMPT.format(text=text)
                }
            ],
            response_format={"type": "json_object"}
        )
        
        content = response.choices[0].message.content
        data = json.loads(content)
        data["resume_id"] = resume_id
        return CandidateProfileCreate(**data)

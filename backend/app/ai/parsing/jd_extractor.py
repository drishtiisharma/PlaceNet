import json
from app.ai.client import client
from app.schemas.hiring_profile import HiringProfileCreate

PROMPT = """
You are an expert HR assistant. Extract the following information from the provided Job Description text.
You MUST respond with a valid JSON object matching the exact schema below. Do not include any markdown formatting, code blocks, or extra text. ONLY raw JSON.

{{
    "job_title": "string",
    "company": "string or null",
    "required_skills": ["string"],
    "preferred_skills": ["string"],
    "experience": "string or null",
    "education": "string or null",
    "eligible_departments": ["string"],
    "cgpa_requirement": "string or null",
    "certifications": ["string"],
    "responsibilities": ["string"],
    "keywords": ["string"],
    "job_summary": "string or null"
}}

Job Description Text:
{text}
"""

class JDExtractor:
    @staticmethod
    def extract(text: str) -> HiringProfileCreate:
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
        return HiringProfileCreate(**data)

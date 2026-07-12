import json
from app.ai.client import llm_service
from app.schemas.hiring_profile import HiringProfileCreate
from pathlib import Path

class JDExtractor:
    @staticmethod
    def extract(text: str) -> HiringProfileCreate:
        prompt_path = Path(__file__).resolve().parent.parent / "prompts" / "jd_extractor.md"
        prompt_template = prompt_path.read_text(encoding="utf-8")
        
        response = llm_service.chat_completion(
            messages=[
                {
                    "role": "user",
                    "content": prompt_template.format(text=text)
                }
            ],
            response_format={"type": "json_object"}
        )
        
        content = response.choices[0].message.content
        data = json.loads(content)
        
        # Sanitize data to ensure list fields are never None
        list_fields = ["required_skills", "preferred_skills", "eligible_departments", "certifications", "responsibilities", "keywords"]
        for field in list_fields:
            if data.get(field) is None:
                data[field] = []
                
        return HiringProfileCreate(**data)

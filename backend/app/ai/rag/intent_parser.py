import json
from app.ai.client import llm_service

class IntentParser:
    @staticmethod
    def parse(query: str, history: list = None) -> dict:
        from app.prompts.loader import load_prompt
        
        prompt_content = load_prompt("intent.md")
        
        messages = [{"role": "system", "content": prompt_content}]
        if history:
            for msg in history[-5:]: # Include last 5 messages for context
                messages.append({"role": msg.role, "content": msg.content})
        messages.append({"role": "user", "content": query})

        try:
            response = llm_service.chat_completion(
                messages=messages,
                response_format={"type": "json_object"}
            )
            content = response.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            print("Intent parser error:", e)
            return {"intent": "general", "skills": [], "names": [], "job_titles": [], "companies": [], "other_keywords": []}

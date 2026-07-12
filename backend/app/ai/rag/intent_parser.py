import json
from app.ai.client import client

INTENT_PROMPT = """
You are an intent router for an HR assistant. Based on the user's query and the provided chat history (if any), determine their intent and extract any relevant keywords (names, skills, job titles, companies).

Valid Intents:
- "search_candidates": e.g., "Find candidates with FastAPI", "Who are the top three candidates for..."
- "compare_candidates": e.g., "Compare Candidate A and Candidate B"
- "summarize_candidate": e.g., "Summarize John Doe", "Why was Jane Smith ranked first?"
- "search_hiring_profiles": e.g., "What skills are required for the Flutter Intern role?"
- "summarize_hiring_profile": e.g., "Summarize the Talking Crooks profile", "What is the second profile about?"
- "compare_hiring_profiles": e.g., "Compare the Software Engineer profiles"
- "general": any other conversational query or request.

Respond ONLY with a valid JSON object matching this schema:
{
    "intent": "intent_string",
    "skills": ["skill1", "skill2"],
    "names": ["name1", "name2"],
    "job_titles": ["title1", "title2"],
    "companies": ["company1"],
    "other_keywords": ["keyword1"]
}
"""

class IntentParser:
    @staticmethod
    def parse(query: str, history: list = None) -> dict:
        messages = [{"role": "system", "content": INTENT_PROMPT}]
        if history:
            for msg in history[-5:]: # Include last 5 messages for context
                messages.append({"role": msg.role, "content": msg.content})
        messages.append({"role": "user", "content": query})

        try:
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
                response_format={"type": "json_object"}
            )
            content = response.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            print("Intent parser error:", e)
            return {"intent": "general", "skills": [], "names": [], "job_titles": [], "companies": [], "other_keywords": []}

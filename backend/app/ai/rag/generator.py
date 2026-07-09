import os
from groq import Groq
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()
client = Groq(
    api_key = os.getenv("GROQ_API_KEY")
)

BASE_DIR = Path(__file__).resolve().parent.parent
SYSTEM_PROMPT = (BASE_DIR / "prompts" / "system.md").read_text(encoding="utf-8")

def chat(user_message: str):
    response = client.chat.completions.create(
        model= "llama-3.3-70b-versatile",

        messages = [
            {
                "role" : "system",
                "content" : SYSTEM_PROMPT
            },
            {
                "role" : "user",
                "content" : user_message
            }
        ]
    )
    return response.choices[0].message.content
import os
from pathlib import Path
from sqlalchemy.orm import Session
from typing import List

from app.ai.client import llm_service
from app.ai.rag.intent_parser import IntentParser
from app.ai.rag.retriever import RAGRetriever
from app.database.models import ChatMessage

BASE_DIR = Path(__file__).resolve().parent.parent
SYSTEM_PROMPT = (BASE_DIR / "prompts" / "system.md").read_text(encoding="utf-8")

def chat(db: Session, user_message: str, session_id: str) -> str:
    # 1. Fetch History
    history = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at.asc()).all()
    
    # 2. Parse Intent
    intent_data = IntentParser.parse(user_message, history=history)
    
    # 3. Retrieve Context
    context = RAGRetriever.retrieve(db, intent_data, user_message)
    
    # 4. Build System Prompt with Context
    final_system_prompt = SYSTEM_PROMPT + f"\n\nContext Retrieved from Database:\n{context}\n\nIMPORTANT: When mentioning candidates, you MUST include a markdown link to their resume using this exact format: [Candidate Name](http://127.0.0.1:8000/resume/view/RESUME_ID).\n\nIf the user asks about a hiring profile and multiple matching profiles are found in the retrieved context, do NOT guess. Instead, politely prompt the user to choose the correct one (e.g., 'I found two profiles for Software Engineer. Did you mean the one at Google or Meta?')."
    
    # 5. Build Messages
    messages = [{"role": "system", "content": final_system_prompt}]
    
    # Only include the last 10 messages for context window reasons
    for msg in history[-10:]:
        messages.append({"role": msg.role, "content": msg.content})
        
    messages.append({"role": "user", "content": user_message})
    
    response = llm_service.chat_completion(
        messages=messages
    )
    
    return response.choices[0].message.content
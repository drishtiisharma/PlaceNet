
from sqlalchemy.orm import Session

from app.ai.client import llm_service
from app.ai.rag.intent_parser import IntentParser
from app.ai.rag.retriever import RAGRetriever
from app.database.models import ChatMessage

from app.prompts.loader import load_prompt

def chat(db: Session, user_message: str, session_id: str) -> str:
    # 1. Fetch History
    history = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at.asc()).all()
    
    # 2. Parse Intent
    intent_data = IntentParser.parse(user_message, history=history)
    
    # 3. Retrieve Context
    context = RAGRetriever.retrieve(db, intent_data, user_message)
    
    # 4. Build System Prompt with Context
    final_system_prompt = load_prompt("chatbot.md", context=context)
    
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
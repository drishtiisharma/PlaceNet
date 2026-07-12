from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.database.connection import get_db
from app.database.models import ChatSession, ChatMessage
from app.schemas.chat import ChatRequest, ChatResponse, ChatMessageResponse, ChatSessionResponse, SessionUpdate
from app.ai.rag.generator import chat
from app.ai.client import llm_service

router = APIRouter()

def generate_chat_title(message: str) -> str:
    try:
        response = llm_service.chat_completion(
            messages=[
                {"role": "system", "content": "Generate a concise 3-5 word title for a chat session based on the user's first message. Respond ONLY with the title string, no quotes."},
                {"role": "user", "content": message}
            ]
        )
        title = response.choices[0].message.content.strip().strip('"').strip("'")
        return title if title else "New Chat"
    except Exception as e:
        print(f"Error generating chat title: {e}")
        return "New Chat"

@router.post("/chat", response_model=ChatResponse)
def chatbot(request: ChatRequest, db: Session = Depends(get_db)):
    session_id = request.session_id
    
    # Create session if it doesn't exist
    if not session_id:
        session_id = str(uuid.uuid4())
        # Generate title from first message
        title = generate_chat_title(request.message)
        new_session = ChatSession(id=session_id, title=title)
        db.add(new_session)
        db.commit()
    else:
        # Verify session
        session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
        if not session:
            session_id = str(uuid.uuid4())
            title = generate_chat_title(request.message)
            new_session = ChatSession(id=session_id, title=title)
            db.add(new_session)
            db.commit()

    # Save user message
    user_msg = ChatMessage(id=str(uuid.uuid4()), session_id=session_id, role="user", content=request.message)
    db.add(user_msg)
    db.commit()

    # Generate reply
    try:
        reply_content = chat(db, request.message, session_id)
    except Exception as e:
        reply_content = "Sorry, I encountered an error while processing your request."
        print(f"Chat error: {e}")

    # Save assistant message
    ai_msg = ChatMessage(id=str(uuid.uuid4()), session_id=session_id, role="assistant", content=reply_content)
    db.add(ai_msg)
    
    # Update session updated_at
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if session:
        # Just update the object to trigger onupdate
        session.title = session.title 
    db.commit()

    return {
        "reply": reply_content,
        "session_id": session_id
    }

@router.get("/chat/sessions", response_model=List[ChatSessionResponse])
def get_chat_sessions(db: Session = Depends(get_db)):
    sessions = db.query(ChatSession).order_by(ChatSession.updated_at.desc()).all()
    return sessions

@router.get("/chat/sessions/{session_id}/messages")
def get_chat_history(session_id: str, db: Session = Depends(get_db)):
    messages = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at.asc()).all()
    return [{"role": m.role, "content": m.content} for m in messages]

@router.delete("/chat/sessions/{session_id}")
def delete_chat_session(session_id: str, db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Delete associated messages
    db.query(ChatMessage).filter(ChatMessage.session_id == session_id).delete()
    db.delete(session)
    db.commit()
    return {"status": "success"}

@router.put("/chat/sessions/{session_id}")
def rename_chat_session(session_id: str, update: SessionUpdate, db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session.title = update.title
    db.commit()
    db.refresh(session)
    return session
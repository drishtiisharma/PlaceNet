from fastapi import APIRouter
from pydantic import BaseModel
from app.ai.rag.generator import chat

router = APIRouter()

class ChatRequest(BaseModel):
    message:str

@router.post("/chat")
def chatbot(request: ChatRequest):
    answer = chat(request.message)
    
    return{
        "reply" : answer
    }
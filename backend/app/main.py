from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.api.routes.chat import router as chat_router
from app.database.connection import engine
from app.database.models import Base

app = FastAPI(title="PlaceNet AI")

Base.metadata.create_all(bind=engine)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
app.include_router(chat_router)

@app.get("/")
async def root():
    return {"message": "PlaceNet AI Backend Running"}
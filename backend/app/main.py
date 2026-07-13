from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.api.routes.chat import router as chat_router
from app.database.connection import engine
from app.database.models import Base

from contextlib import asynccontextmanager
import logging

logger = logging.getLogger("PlaceNet")

@asynccontextmanager
async def lifespan(app: FastAPI):
    from app.ai.client import llm_service
    logger.info("-" * 50)
    logger.info("Configured LLM Providers:\n")
    chain = llm_service.get_provider_chain()
    if not chain:
        logger.error("No LLM Providers Configured.")
    else:
        for idx, p in enumerate(chain):
            is_primary = " [Primary]" if idx == 0 else ""
            logger.info(f"{idx + 1}. {p.name.capitalize()} ({p.model_name}){is_primary}")
    logger.info("-" * 50)
    yield

app = FastAPI(title="PlaceNet AI", lifespan=lifespan)

from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    import traceback
    logger.error(f"Unhandled exception: {exc}\n{traceback.format_exc()}")
    
    msg = "The AI service is temporarily unavailable. Please try again later."
    error_code = "INTERNAL_SERVER_ERROR"
    
    # Map specific known errors to friendly messages
    if "No text could be extracted" in str(exc) or "PDF" in str(exc) or "parse" in str(exc).lower():
        msg = "The uploaded document could not be parsed. Please verify the file and try again."
        error_code = "PARSE_ERROR"

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": msg,
            "error_code": error_code,
            "details": None
        }
    )

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code >= 500:
        logger.error(f"HTTP Exception: {exc.detail}")
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": str(exc.detail) if exc.status_code < 500 else "The service is temporarily unavailable. Please try again later.",
            "error_code": "HTTP_ERROR",
            "details": None
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Invalid request data. Please check your inputs.",
            "error_code": "VALIDATION_ERROR",
            "details": None
        }
    )

Base.metadata.create_all(bind=engine)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
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
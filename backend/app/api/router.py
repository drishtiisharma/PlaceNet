from fastapi import APIRouter
from app.api.routes.resume import router as resume_router
from app.api.routes.hiring_profile import router as hiring_profile_router
from app.api.routes.ranking import router as ranking_router
from app.api.routes.analytics import router as analytics_router
from app.api.routes.search import router as search_router
from app.api.routes.auth import router as auth_router

api_router = APIRouter()
api_router.include_router(resume_router)
api_router.include_router(hiring_profile_router)
api_router.include_router(ranking_router)
api_router.include_router(analytics_router)
api_router.include_router(search_router)
api_router.include_router(auth_router)
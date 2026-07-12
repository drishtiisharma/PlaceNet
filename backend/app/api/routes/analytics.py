from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.services.analytics.analytics_service import AnalyticsService

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)

@router.get("/dashboard")
def get_dashboard_data(db: Session = Depends(get_db)):
    try:
        data = AnalyticsService.get_dashboard_analytics(db)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

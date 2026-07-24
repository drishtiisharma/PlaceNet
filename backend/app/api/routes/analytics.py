from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.services.analytics.analytics_service import AnalyticsService
from app.services.analytics.export_service import ExportService

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

@router.get("/export/{hiring_profile_id}")
def export_hiring_profile_report(hiring_profile_id: str, db: Session = Depends(get_db)):
    try:
        excel_data = ExportService.generate_hiring_profile_report(db, hiring_profile_id)
        return Response(
            content=excel_data.read(),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename=hiring_profile_{hiring_profile_id}_report.xlsx"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

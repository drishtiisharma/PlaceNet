from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
import json

from app.database.connection import get_db
from app.services.ranking.ranking_service import RankingService
from app.schemas.candidate_profile import RankingResult

router = APIRouter(
    prefix="/ranking",
    tags=["Ranking"]
)

class RankRequest(BaseModel):
    page: int = 1
    limit: int = 20

@router.post("/{hiring_profile_id}/process")
async def process_candidates(
    hiring_profile_id: str,
    db: Session = Depends(get_db)
):
    async def event_stream():
        try:
            async for update in RankingService.process_all_candidates_stream(db, hiring_profile_id):
                yield f"data: {json.dumps(update)}\n\n"
        except Exception as e:
            import traceback
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Ranking process failed: {e}\n{traceback.format_exc()}")
            yield f"data: {json.dumps({'type': 'error', 'detail': str(e)})}\n\n"
            
    return StreamingResponse(event_stream(), media_type="text/event-stream")

@router.post("/{hiring_profile_id}/results")
def get_ranked_results(
    hiring_profile_id: str, 
    request: RankRequest,
    db: Session = Depends(get_db)
):
    try:
        return RankingService.get_paginated_results(db, hiring_profile_id, request.page, request.limit)
    except Exception as e:
        import traceback
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Fetching ranked results failed: {e}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch results: {str(e)}")

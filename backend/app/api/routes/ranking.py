from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from app.database.connection import get_db
from app.services.ranking.ranking_service import RankingService
from app.schemas.candidate_profile import RankingResult

router = APIRouter(
    prefix="/ranking",
    tags=["Ranking"]
)

class RankRequest(BaseModel):
    top_k: int = 10

@router.post("/{hiring_profile_id}", response_model=List[RankingResult])
def rank_candidates(
    hiring_profile_id: str, 
    request: RankRequest,
    db: Session = Depends(get_db)
):
    try:
        return RankingService.rank_candidates(db, hiring_profile_id, request.top_k)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

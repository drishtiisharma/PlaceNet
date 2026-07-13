import asyncio
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
from app.database.models import HiringProfile
from app.services.ranking.ranking_service import RankingService

def main():
    db = SessionLocal()
    try:
        hp = db.query(HiringProfile).first()
        if not hp:
            print("No hiring profile found. Creating a dummy one.")
            hp = HiringProfile(id="dummy_hp", job_title="Software Engineer", required_skills=["python", "fastapi"])
            db.add(hp)
            db.commit()
        
        print(f"Using hiring profile: {hp.job_title} (ID: {hp.id})")
        
        results = RankingService.rank_candidates(db, hp.id, 10)
        print("Ranking results:")
        for r in results:
            print(f"- {r.full_name} (Score: {r.match_score})")
            
    finally:
        db.close()

if __name__ == "__main__":
    main()

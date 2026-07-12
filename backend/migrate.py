import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.connection import engine
from app.database.models import CandidateProfile

def migrate():
    print("Dropping CandidateProfile table...")
    CandidateProfile.__table__.drop(engine, checkfirst=True)
    print("Creating CandidateProfile table...")
    CandidateProfile.__table__.create(engine)
    print("Migration complete!")

if __name__ == "__main__":
    migrate()

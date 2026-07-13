import asyncio
from app.database.connection import SessionLocal
from app.ai.rag.retriever import RAGRetriever

import logging
logging.basicConfig(level=logging.INFO)

def main():
    db = SessionLocal()
    try:
        intent_data = {"intent": "search_candidates"}
        query = "Show me the top candidates for python developer"
        
        # Trigger RAG retrieval
        result = RAGRetriever.retrieve(db, intent_data, query)
        print("\n\n--- RETRIEVAL RESULT ---")
        print(result[:1000] + ("..." if len(result) > 1000 else ""))
        
    finally:
        db.close()

if __name__ == "__main__":
    main()

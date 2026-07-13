from app.models.resume_chunk import ResumeChunk
import chromadb
from chromadb.config import Settings


class VectorService:

    client = chromadb.PersistentClient(
        path="backend/chroma_db",
        settings=Settings(
            anonymized_telemetry=False
        )
    )

    collection = client.get_or_create_collection(
        name="candidate_resumes"
    )

    @staticmethod
    def store(
        resume_id: str,
        chunks: list[ResumeChunk],
        embeddings,
        resume_path: str,
        original_filename: str
    ):
        """
        Store resume chunks, embeddings and metadata in ChromaDB.
        """

        ids = []
        documents = []
        metadatas = []

        total_chunks = len(chunks)

        for index, chunk in enumerate(chunks):

            ids.append(f"{resume_id}_{index}")

            documents.append(chunk.text)

            metadatas.append({

                "resume_id": resume_id,

                "full_name": chunk.candidate_name,

                "section": chunk.section,

                "chunk_index": index,

                "total_chunks": total_chunks,

                "resume_path": resume_path,

                "original_filename": original_filename

            })

        VectorService.collection.add(
            ids=ids,
            documents=documents,
            embeddings=(
    embeddings.tolist()
    if hasattr(embeddings, "tolist")
    else embeddings
),
            metadatas=metadatas
        )

    # -----FOR RESUME LIBRARY-----

    @staticmethod
    def get_all_resumes():
        """
        Returns one entry per resume.
        """
        results = VectorService.collection.get(
            include=["metadatas"]
        )
        resumes = {}
        for metadata in results["metadatas"]:
            resume_id = metadata["resume_id"]
            if resume_id not in resumes:
                resumes[resume_id] = {
                    "resume_id": resume_id,
                    "full_name": metadata["full_name"],
                    "resume_path": metadata["resume_path"],
                    "original_filename": metadata["original_filename"]
                }
        return list(resumes.values())

    @staticmethod
    def get_resume(resume_id: str):
        """
        Returns metadata for a single resume.
        """
        results = VectorService.collection.get(
            where={
                "resume_id": resume_id
            },
            include=["metadatas"]
        )
        if not results["metadatas"]:
            return None
        metadata = results["metadatas"][0]
        return {
            "resume_id": metadata["resume_id"],
            "full_name": metadata["full_name"],
            "resume_path": metadata["resume_path"],
            "original_filename": metadata["original_filename"]
        }

    @staticmethod
    def delete_resume(resume_id: str):
        """
        Deletes every chunk belonging to one resume.
        """
        VectorService.collection.delete(
            where={
                "resume_id": resume_id
            }
        )

    @staticmethod
    def search(query_embedding, top_k=10):
        """
        Semantic search.
        """
        return VectorService.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )

    @staticmethod
    def get_unique_resume_count() -> int:
        """
        Returns the number of unique resumes currently stored in ChromaDB.
        """
        return len(VectorService.get_all_resumes())

    @staticmethod
    def rebuild_index_from_db(db):
        """
        Rebuilds missing resumes in ChromaDB by parsing from original files.
        """
        import logging
        from app.database.models import CandidateProfile
        from app.services.resume.parser_service import ParserService
        from app.services.resume.chunk_service import ChunkService
        from app.services.resume.embedding_service import EmbeddingService
        
        logger = logging.getLogger(__name__)
        logger.info("Starting automatic vector store sync...")
        
        # Get DB candidates
        db_candidates = db.query(CandidateProfile).all()
        db_map = {c.resume_id: c for c in db_candidates}
        
        # Get Chroma resumes
        chroma_resumes = VectorService.get_all_resumes()
        chroma_ids = {r["resume_id"] for r in chroma_resumes}
        
        missing_ids = set(db_map.keys()) - chroma_ids
        
        if not missing_ids:
            logger.info("Vector store is perfectly synced with Database.")
            return
            
        logger.warning(f"Found {len(missing_ids)} missing resumes in vector store. Rebuilding...")
        
        for r_id in missing_ids:
            c = db_map[r_id]
            try:
                # Read file
                with open(c.resume_path, "rb") as f:
                    file_bytes = f.read()
                
                # Parse
                parsed_resume = ParserService.parse(
                    file_bytes=file_bytes,
                    filename=c.original_filename
                )
                
                # Crucial to use the exact candidate_name/full_name from the DB profile
                # so it maps correctly!
                parsed_resume.full_name = c.full_name
                
                # Chunk
                chunks = ChunkService.create_chunks(parsed_resume)
                
                # Embed
                embeddings = EmbeddingService.generate_embeddings(chunks)
                
                # Store
                VectorService.store(
                    resume_id=r_id,
                    chunks=chunks,
                    embeddings=embeddings,
                    resume_path=c.resume_path,
                    original_filename=c.original_filename
                )
                logger.info(f"Successfully rebuilt vector index for resume {r_id} ({c.full_name})")
            except Exception as e:
                import traceback
                logger.error(f"Failed to rebuild index for {r_id}: {e}\n{traceback.format_exc()}")


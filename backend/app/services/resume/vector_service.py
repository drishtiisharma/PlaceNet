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

                "candidate_name": chunk.candidate_name,

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
                    "candidate_name": metadata["candidate_name"],
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
            "candidate_name": metadata["candidate_name"],
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
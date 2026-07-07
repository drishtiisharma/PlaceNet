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

            embeddings=embeddings.tolist(),

            metadatas=metadatas

        )
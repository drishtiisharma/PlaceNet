import chromadb
from chromadb.config import Settings
from app.services.resume.embedding_service import EmbeddingService
from langchain_text_splitters import RecursiveCharacterTextSplitter

class HiringProfileVectorService:
    client = chromadb.PersistentClient(
        path="backend/chroma_db",
        settings=Settings(
            anonymized_telemetry=False
        )
    )

    collection = client.get_or_create_collection(
        name="hiring_profiles_v2"
    )

    @staticmethod
    def chunk_and_store(
        profile_id: str,
        job_title: str,
        text: str
    ):
        # Create chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        chunks = text_splitter.split_text(text)

        if not chunks:
            return

        # Prepare for DB
        ids = []
        documents = []
        metadatas = []

        total_chunks = len(chunks)

        # Assuming EmbeddingService expects an object with text property or list of objects
        # We'll just generate embeddings. EmbeddingService.generate_embeddings might expect list of chunks.
        # Let's import the ChunkService to see if we can reuse or just use SentenceTransformer here.
        embeddings = EmbeddingService.generate_embeddings(chunks)

        for index, chunk in enumerate(chunks):
            ids.append(f"{profile_id}_{index}")
            documents.append(chunk)
            metadatas.append({
                "profile_id": profile_id,
                "job_title": job_title,
                "chunk_index": index,
                "total_chunks": total_chunks
            })

        HiringProfileVectorService.collection.add(
            ids=ids,
            documents=documents,
            embeddings=embeddings.tolist() if hasattr(embeddings, "tolist") else embeddings,
            metadatas=metadatas
        )

    @staticmethod
    def delete_profile(profile_id: str):
        HiringProfileVectorService.collection.delete(
            where={
                "profile_id": profile_id
            }
        )

    @staticmethod
    def search(query_embedding: list, top_k: int = 5):
        try:
            results = HiringProfileVectorService.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k
            )
            return results
        except Exception as e:
            print("Chroma search error in Hiring Profiles:", e)
            return None

from sentence_transformers import SentenceTransformer
from app.models.resume_chunk import ResumeChunk


class EmbeddingService:

    # Load model only once
    model = SentenceTransformer("BAAI/bge-base-en-v1.5")

    @staticmethod
    def generate_embeddings(chunks: list[ResumeChunk]):
        """
        Generate embeddings for resume chunks.
        """

        if not chunks:
            return []

        texts = [
            chunk.text if hasattr(chunk, 'text') else chunk
            for chunk in chunks
        ]

        embeddings = EmbeddingService.model.encode(
            texts,
            convert_to_numpy=True,
            normalize_embeddings=True
        )

        return embeddings
from fastapi import UploadFile
from typing import List
from uuid import uuid4

from .file_service import FileService
from .parser_service import ParserService
from .chunk_service import ChunkService
from .embedding_service import EmbeddingService
from .vector_service import VectorService


class ResumePipeline:

    @staticmethod
    async def process_resumes(files: List[UploadFile]) -> dict:
        """
        Complete Resume Processing Pipeline

        Upload
            ↓
        Read File
            ↓
        Parse Resume
            ↓
        Save Original Resume
            ↓
        Create Semantic Chunks
            ↓
        Generate Embeddings
            ↓
        Store in ChromaDB
        """

        processed = 0

        for file in files:

            # Read file only once
            file_bytes = await file.read()

            # Generate unique Resume ID
            resume_id = str(uuid4())

            # Parse resume
            parsed_resume = ParserService.parse(
                file_bytes=file_bytes,
                filename=file.filename
            )

            # Save original resume
            saved_path = FileService.save_file(
                file_bytes=file_bytes,
                original_filename=file.filename,
                candidate_name=parsed_resume.candidate_name
            )

            # Create semantic chunks
            chunks = ChunkService.create_chunks(parsed_resume)

            # Generate embeddings
            embeddings = EmbeddingService.generate_embeddings(chunks)

            # Store everything in ChromaDB
            VectorService.store(
                resume_id=resume_id,
                chunks=chunks,
                embeddings=embeddings,
                resume_path=str(saved_path),
                original_filename=file.filename
            )

            processed += 1

        return {
            "status": "success",
            "processed_resumes": processed,
            "total_uploaded": len(files)
        }
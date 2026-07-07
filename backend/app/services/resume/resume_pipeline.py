from fastapi import UploadFile
from typing import List
from .file_service import FileService
from .parser_service import ParserService
from .chunk_service import ChunkService
from .embedding_service import EmbeddingService 
from .vector_service import VectorService


class ResumePipeline:
    @staticmethod
    async def process_resumes(files: List[UploadFile]) -> dict:
        """
        Complete resume processing pipeline:

        Upload-> Parse-> Save-> Chunks-> Embedding-> Storing in ChromaDB

        """

        processed = 0
        for file in files:

            #1. Parsing Resumes
            parsed_Resume = ParserService.parse(file)

            #2. Renaming & Saving Original File
            filename = parsed_resume.candidate_name.replace(" "," _")+"_Resume"

            saved_path = FileService.save_file(file=file,
            filename=filename)

            #3. Creating Semantic Chunks
            chunks = ChunkService.crate_chunks(parsed_resume)

            #4. Generate embeddings
            embeddings = EmbeddingService.generate_embeddings(chunks)

            #5. Storing Inside ChromaDB
            VectorService.store(
                chunks=chunks,
                embeddings=embeddings,
                resume_path=str(saved_path)
            )

            processed+=1
        
        return{
            "status": "success",
            "processed_resumes": processed
        }
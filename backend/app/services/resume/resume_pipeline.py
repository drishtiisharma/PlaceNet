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

            # If DOCX, convert to PDF
            if saved_path.suffix.lower() == ".docx":
                from docx2pdf import convert
                import pathlib
                pdf_path = saved_path.with_suffix(".pdf")
                try:
                    convert(str(saved_path), str(pdf_path))
                    # Optionally, you can delete the DOCX or keep it
                    # We update saved_path to point to the PDF for ChromaDB metadata
                    saved_path = pdf_path
                except Exception as e:
                    print(f"DOCX to PDF conversion failed: {e}")

            # Create semantic chunks
            chunks = ChunkService.create_chunks(parsed_resume)

            if not chunks:
                raise ValueError(
                    f"No text could be extracted from {file.filename}"
                )
                
            # Extract structured data
            from app.ai.parsing.resume_extractor import ResumeExtractor
            from app.database.connection import SessionLocal
            from app.database.models import CandidateProfile
            from uuid import uuid4 as db_uuid
            
            extracted_profile = ResumeExtractor.extract(parsed_resume.resume_text, resume_id)
            db = SessionLocal()
            try:
                db_candidate = CandidateProfile(
                    id=str(db_uuid()),
                    resume_id=extracted_profile.resume_id,
                    candidate_name=extracted_profile.candidate_name,
                    skills=extracted_profile.skills,
                    education=extracted_profile.education,
                    projects=extracted_profile.projects,
                    experience=extracted_profile.experience,
                    certifications=extracted_profile.certifications,
                    department=extracted_profile.department,
                    cgpa=extracted_profile.cgpa
                )
                db.add(db_candidate)
                db.commit()
            except Exception as e:
                db.rollback()
                print(f"Error saving candidate profile: {e}")
            finally:
                db.close()

            # Generate embeddings
            embeddings = EmbeddingService.generate_embeddings(chunks)

            if len(embeddings) == 0:
                raise ValueError(
                    f"Failed to generate embeddings for {file.filename}"
                )

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
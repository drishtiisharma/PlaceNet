from fastapi import UploadFile
from typing import List
from uuid import uuid4

from .file_service import FileService
from .parser_service import ParserService
from .chunk_service import ChunkService
from .embedding_service import EmbeddingService
from .vector_service import VectorService
from .storage_service import StorageService


class ResumePipeline:

    @staticmethod
    async def process_resumes(files: List[UploadFile], user_id: str):
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
        failed_count = 0
        failures = []

        import logging
        import concurrent.futures
        import hashlib
        import re
        
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.INFO)
        if not logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
            handler.setFormatter(formatter)
            logger.addHandler(handler)

        for file in files:
            logger.info(f"Starting processing for file: {file.filename}")
            
            yield {
                "type": "progress",
                "processed": processed,
                "failed": failed_count,
                "total": len(files),
                "current_file": file.filename
            }

            try:
                # Read file only once
                logger.info(f"[{file.filename}] Reading file bytes...")
                file_bytes = await file.read()
                logger.info(f"[{file.filename}] File read successful. Size: {len(file_bytes)} bytes")

                # Generate unique Resume ID
                resume_id = str(uuid4())

                # Parse resume
                logger.info(f"[{file.filename}] Parsing resume text...")
                parsed_resume = ParserService.parse(
                    file_bytes=file_bytes,
                    filename=file.filename
                )
                logger.info(f"[{file.filename}] Resume parsed. Candidate: {parsed_resume.full_name}")

                # Check for semantic duplicate
                normalized_text = re.sub(r'\W+', '', parsed_resume.resume_text.lower())
                content_hash = hashlib.sha256(normalized_text.encode('utf-8')).hexdigest()

                from app.database.connection import SessionLocal
                from app.database.models import CandidateProfile
                
                db = SessionLocal()
                try:
                    existing_resume = db.query(CandidateProfile).filter(
                        CandidateProfile.user_id == user_id, 
                        CandidateProfile.content_hash == content_hash
                    ).first()
                    
                    if existing_resume:
                        logger.info(f"[{file.filename}] Skipped duplicate resume based on content hash.")
                        raise ValueError(f"Skipped duplicate: {file.filename} — this resume already exists in your library.")
                finally:
                    db.close()

                # Save original resume locally (optional fallback or for immediate processing)
                logger.info(f"[{file.filename}] Saving original resume...")
                saved_path = FileService.save_file(
                    file_bytes=file_bytes,
                    original_filename=file.filename,
                    full_name=parsed_resume.full_name
                )
                logger.info(f"[{file.filename}] Saved to {saved_path}")

                # Upload to Supabase Storage
                logger.info(f"[{file.filename}] Uploading to Supabase Storage...")
                try:
                    resume_storage_path = StorageService.upload_resume(file_bytes, file.filename, user_id)
                except Exception as e:
                    logger.error(f"[{file.filename}] Storage upload failed: {e}")
                    raise RuntimeError(f"Storage upload failed: {e}")

                # If DOCX, convert to PDF
                if saved_path.suffix.lower() == ".docx":
                    logger.info(f"[{file.filename}] Converting DOCX to PDF...")
                    from docx2pdf import convert
                    pdf_path = saved_path.with_suffix(".pdf")
                    
                    def _convert_docx():
                        convert(str(saved_path), str(pdf_path))
                    
                    try:
                        with concurrent.futures.ThreadPoolExecutor() as executor:
                            future = executor.submit(_convert_docx)
                            future.result(timeout=15.0)  # 15 seconds timeout
                        logger.info(f"[{file.filename}] DOCX to PDF conversion successful")
                        saved_path = pdf_path
                    except concurrent.futures.TimeoutError:
                        logger.warning(f"[{file.filename}] DOCX to PDF conversion timed out after 15s. Skipping PDF conversion.")
                    except Exception as e:
                        logger.warning(f"[{file.filename}] DOCX to PDF conversion failed: {e}")

                # Create semantic chunks
                logger.info(f"[{file.filename}] Creating semantic chunks...")
                chunks = ChunkService.create_chunks(parsed_resume)
                logger.info(f"[{file.filename}] Created {len(chunks)} chunks")

                if not chunks:
                    logger.error(f"[{file.filename}] No text could be extracted")
                    raise ValueError(f"This resume appears to be blank or contains no readable text. Please upload a valid resume.")
                    
                # Use deterministic extracted profile
                logger.info(f"[{file.filename}] Using deterministic profile data...")
                
                ext_name = parsed_resume.full_name
                ext_skills = parsed_resume.extracted_skills
                ext_education = parsed_resume.extracted_education
                ext_projects = parsed_resume.extracted_projects
                ext_experience = parsed_resume.extracted_experience
                ext_certifications = parsed_resume.extracted_certifications
                ext_department = parsed_resume.extracted_department or "General"
                ext_cgpa = parsed_resume.extracted_cgpa
                
                logger.info(f"[{file.filename}] Storing profile to DB for {ext_name}...")
                from app.database.connection import SessionLocal
                from app.database.models import CandidateProfile
                from uuid import uuid4 as db_uuid
                
                db = SessionLocal()
                try:
                    db_candidate = CandidateProfile(
                        id=str(db_uuid()),
                        user_id=user_id,
                        resume_id=resume_id,
                        full_name=ext_name,
                        email=parsed_resume.extracted_email,
                        phone=parsed_resume.extracted_phone,
                        skills=ext_skills,
                        education=ext_education,
                        projects=ext_projects,
                        experience=ext_experience,
                        certifications=ext_certifications,
                        department=ext_department,
                        cgpa=ext_cgpa,
                        resume_path=str(saved_path),
                        resume_storage_path=resume_storage_path,
                        original_filename=file.filename,
                        content_hash=content_hash
                    )
                    db.add(db_candidate)
                    db.commit()
                    logger.info(f"[{file.filename}] DB storage successful")
                except Exception as e:
                    db.rollback()
                    logger.error(f"[{file.filename}] Error saving candidate profile to DB: {e}")
                    raise Exception(f"Database error occurred.")
                finally:
                    db.close()

                # Generate embeddings
                logger.info(f"[{file.filename}] Generating embeddings...")
                embeddings = EmbeddingService.generate_embeddings(chunks)
                logger.info(f"[{file.filename}] Generated embeddings for {len(embeddings)} chunks")

                if len(embeddings) == 0:
                    logger.error(f"[{file.filename}] Failed to generate embeddings")
                    raise ValueError(
                        f"Failed to generate embeddings for {file.filename}"
                    )

                # Store everything in ChromaDB
                logger.info(f"[{file.filename}] Storing in ChromaDB...")
                VectorService.store(
                    resume_id=resume_id,
                    chunks=chunks,
                    embeddings=embeddings,
                    resume_path=str(saved_path),
                    original_filename=file.filename
                )
                logger.info(f"[{file.filename}] Successfully stored in ChromaDB")

                processed += 1
                logger.info(f"[{file.filename}] Finished processing file successfully")
                
                yield {
                    "type": "progress",
                    "processed": processed,
                    "failed": failed_count,
                    "total": len(files),
                    "current_file": file.filename
                }

            except Exception as e:
                import traceback
                logger.error(f"[{file.filename}] Failed processing: {e}\n{traceback.format_exc()}")
                failed_count += 1
                
                failures.append({
                    "filename": file.filename,
                    "reason": str(e)
                })
                
                yield {
                    "type": "progress",
                    "processed": processed,
                    "failed": failed_count,
                    "total": len(files),
                    "current_file": file.filename
                }

        logger.info(f"Pipeline complete. Processed {processed}/{len(files)} files. Failed: {failed_count}")
        status = "success"
        if failed_count > 0 and processed > 0:
            status = "partial_success"
        elif failed_count > 0 and processed == 0:
            status = "failed"

        yield {
            "type": "complete",
            "result": {
                "status": status,
                "processed_resumes": processed,
                "failed_count": failed_count,
                "total_uploaded": len(files),
                "failures": failures
            }
        }

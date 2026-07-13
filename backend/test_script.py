import asyncio
from fastapi import UploadFile
from io import BytesIO
from app.services.resume.resume_pipeline import ResumePipeline

async def main():
    with open("test_resume.pdf", "rb") as f:
        file_bytes = f.read()
    
    upload_file = UploadFile(filename="test_resume.pdf", file=BytesIO(file_bytes))
    
    result = await ResumePipeline.process_resumes([upload_file])
    print(result)

if __name__ == "__main__":
    asyncio.run(main())

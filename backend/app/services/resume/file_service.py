from pathlib import Path
from uuid import uuid4
from fastapi import UploadFile
import shutil
from typing import List

UPLOAD_DIR = Path("backend/uploads/resumes")

class FileService():
    @staticmethod
    def ensure_upload_directory()-> None:
        """
        Create the upload directory if it doesn't exist
        """
        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    @staticmethod
    def save_files(files: List[UploadFile])-> List[Path]:
        """
        Save uploaded PDF files and return their saved paths
        """
        FileService.ensure_upload_directory()
        extension = Path(file.filename).suffix
        file_path = UPLOAD_DIR / unique_name

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file,buffer)

            saved_paths.append(file_path)

        return saved_paths

            
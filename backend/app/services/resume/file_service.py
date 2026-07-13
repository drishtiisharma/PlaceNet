from pathlib import Path


UPLOAD_DIR = Path("backend/uploads/resumes")


class FileService:

    @staticmethod
    def ensure_upload_directory() -> None:
        """
        Creating uploads/resumes folder if it doesn't exist.
        """
        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    @staticmethod
    def _sanitize_filename(name: str) -> str:
        """
        Removing invalid filename characters.
        """

        invalid_chars = '<>:"/\\|?*'

        for char in invalid_chars:
            name = name.replace(char, "")

        return "_".join(name.split())

    @staticmethod
    def _generate_unique_filename(filename: str) -> str:
        """
        Preventing overwriting if a file with the same name already exists.
        """

        path = UPLOAD_DIR / filename

        if not path.exists():
            return filename

        stem = path.stem
        suffix = path.suffix

        counter = 1

        while True:

            new_name = f"{stem}_{counter}{suffix}"

            if not (UPLOAD_DIR / new_name).exists():
                return new_name

            counter += 1

    @staticmethod
    def save_file(
        file_bytes: bytes,
        original_filename: str,
        full_name: str
    ) -> Path:
        """
        Saving the uploaded resume using:
        full_name_Resume.pdf/docx
        """

        FileService.ensure_upload_directory()
        extension = Path(original_filename).suffix.lower()
        safe_name = FileService._sanitize_filename(full_name)
        filename = f"{safe_name}_Resume{extension}"
        filename = FileService._generate_unique_filename(filename)

        file_path = UPLOAD_DIR / filename
        with open(file_path, "wb") as file:
            file.write(file_bytes)

        return file_path

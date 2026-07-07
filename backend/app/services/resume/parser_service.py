from pathlib import Path
from io import BytesIO
import fitz
from docx import Document
from app.models.parsed_resume import ParsedResume


class ParserService:

    @staticmethod
    def parse(file_bytes: bytes, filename: str) -> ParsedResume:
        """
        Parsing a PDF or DOCX resume and returning a ParsedResume object.
        """
        extension = Path(filename).suffix.lower()

        if extension == ".pdf":
            text = ParserService._parse_pdf(file_bytes)

        elif extension == ".docx":
            text = ParserService._parse_docx(file_bytes)

        else:
            raise ValueError(
                f"Unsupported file type: {extension}"
            )

        candidate_name = ParserService._extract_candidate_name(text)

        return ParsedResume(
            candidate_name=candidate_name,
            resume_text=text
        )

    @staticmethod
    def _parse_pdf(file_bytes: bytes) -> str:
        """
        Extracting text from a PDF.
        """

        pdf = fitz.open(
            stream=file_bytes,
            filetype="pdf"
        )

        text = ""

        for page in pdf:
            text += page.get_text()

        pdf.close()

        return text

    @staticmethod
    def _parse_docx(file_bytes: bytes) -> str:
        """
        Extracting text from a DOCX.
        """

        document = Document(BytesIO(file_bytes))

        text = "\n".join(
            paragraph.text
            for paragraph in document.paragraphs
        )

        return text

    @staticmethod
    def _extract_candidate_name(text: str) -> str:
        """
        [Temporary implementation]
        Assumes the first non-empty line is the candidate's name.
        """

        for line in text.splitlines():

            line = line.strip()

            if line:
                return line.replace("/", "_")

        return "Unknown_Candidate"
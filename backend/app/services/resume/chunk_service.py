from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.models.parsed_resume import ParsedResume
from app.models.resume_chunk import ResumeChunk


class ChunkService:

    SECTION_HEADERS = [
        "education",
        "skills",
        "technical skills",
        "projects",
        "experience",
        "work experience",
        "internship",
        "internships",
        "certifications",
        "achievements",
        "leadership",
        "positions of responsibility",
        "summary",
        "objective"
    ]

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100
    )

    @staticmethod
    def create_chunks(parsed_resume: ParsedResume) -> list[ResumeChunk]:

        sections = ChunkService._split_into_sections(
            parsed_resume.resume_text
        )

        chunks = []

        for section_name, section_text in sections:

            split_chunks = ChunkService.splitter.split_text(section_text)

            for chunk_text in split_chunks:

                chunks.append(
                    ResumeChunk(
                        candidate_name=parsed_resume.candidate_name,
                        section=section_name,
                        text=chunk_text
                    )
                )

        return chunks

    @staticmethod
    def _split_into_sections(text: str):

        lines = text.splitlines()

        sections = []

        current_section = "General"

        current_text = []

        for line in lines:

            clean = line.strip()

            if clean.lower() in ChunkService.SECTION_HEADERS:

                if current_text:

                    sections.append(
                        (
                            current_section,
                            "\n".join(current_text)
                        )
                    )

                current_section = clean
                current_text = []

            else:
                current_text.append(clean)

        if current_text:

            sections.append(
                (
                    current_section,
                    "\n".join(current_text)
                )
            )

        return sections
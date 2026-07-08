from app.services.resume.vector_service import VectorService


class MetadataService:

    @staticmethod
    def get_all_resumes():

        data = VectorService.collection.get(
            include=["metadatas"]
        )

        resumes = {}

        for metadata in data["metadatas"]:

            resume_id = metadata["resume_id"]

            if resume_id not in resumes:

                resumes[resume_id] = {
                    "resume_id": resume_id,
                    "candidate_name": metadata["candidate_name"],
                    "resume_path": metadata["resume_path"],
                    "original_filename": metadata["original_filename"]
                }

        return list(resumes.values())
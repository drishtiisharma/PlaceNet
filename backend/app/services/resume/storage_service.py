import os
import uuid
import logging
from supabase import create_client, Client

logger = logging.getLogger(__name__)

class StorageService:
    @classmethod
    def get_client(cls) -> Client:
        url: str = os.environ.get("SUPABASE_URL", "")
        key: str = os.environ.get("SUPABASE_SECRET_KEY", "")
        if not url or not key:
            raise ValueError("SUPABASE_URL and SUPABASE_SECRET_KEY must be set.")
        return create_client(url, key)

    @classmethod
    def get_bucket_name(cls) -> str:
        bucket = os.environ.get("SUPABASE_BUCKET", "Resumes")
        return bucket

    @classmethod
    def upload_resume(cls, file_bytes: bytes, original_filename: str, user_id: str) -> str:
        """Uploads a resume to Supabase Storage and returns the storage path."""
        try:
            client = cls.get_client()
            bucket = cls.get_bucket_name()
            
            # Generate UUID for the filename while preserving extension
            ext = os.path.splitext(original_filename)[1]
            unique_filename = f"{user_id}/{uuid.uuid4()}{ext}"
            
            response = client.storage.from_(bucket).upload(
                path=unique_filename,
                file=file_bytes,
                file_options={"content-type": "application/pdf" if ext.lower() == ".pdf" else "application/octet-stream"}
            )
            
            # response format depends on supabase-py, generally it's a dict or similar on success, raises error otherwise
            logger.info(f"Successfully uploaded {unique_filename} to Supabase bucket {bucket}")
            return unique_filename
        except Exception as e:
            logger.error(f"Failed to upload resume to Supabase: {e}")
            raise

    @classmethod
    def delete_resume(cls, storage_path: str):
        """Deletes a single resume from Supabase Storage."""
        if not storage_path:
            return
            
        try:
            client = cls.get_client()
            bucket = cls.get_bucket_name()
            client.storage.from_(bucket).remove([storage_path])
            logger.info(f"Successfully deleted {storage_path} from Supabase")
        except Exception as e:
            logger.error(f"Failed to delete resume {storage_path} from Supabase: {e}")
            raise

    @classmethod
    def delete_all_resumes(cls, user_id: str):
        """Deletes all resumes for the given user from the Supabase bucket."""
        try:
            client = cls.get_client()
            bucket = cls.get_bucket_name()
            
            files = client.storage.from_(bucket).list(user_id)
            if files:
                file_paths = [f"{user_id}/{f['name']}" for f in files if f['name'] != '.emptyFolderPlaceholder']
                if file_paths:
                    client.storage.from_(bucket).remove(file_paths)
            logger.info(f"Successfully deleted all resumes for user {user_id} from Supabase bucket {bucket}")
        except Exception as e:
            logger.error(f"Failed to delete all resumes from Supabase: {e}")
            raise

    @classmethod
    def get_signed_url(cls, storage_path: str, expires_in: int = 3600) -> str:
        """Generates a signed URL for temporary access to a resume."""
        if not storage_path:
            return ""
            
        try:
            client = cls.get_client()
            bucket = cls.get_bucket_name()
            
            response = client.storage.from_(bucket).create_signed_url(storage_path, expires_in)
            # Response is typically a dict with a 'signedURL' key
            if isinstance(response, dict) and 'signedURL' in response:
                return response['signedURL']
            elif hasattr(response, 'signed_url'):
                return response.signed_url
            else:
                return response
        except Exception as e:
            logger.error(f"Failed to generate signed URL for {storage_path}: {e}")
            return ""

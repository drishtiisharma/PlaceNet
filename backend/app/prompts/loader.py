import logging
from pathlib import Path
from fastapi import HTTPException

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent

class PromptLoadError(Exception):
    pass

def load_prompt(filename: str, **kwargs) -> str:
    """
    Loads a prompt from the prompts directory and replaces placeholders 
    defined in kwargs. Use <<KEY>> for placeholders in the markdown files.
    """
    try:
        prompt_path = BASE_DIR / filename
        if not prompt_path.exists():
            raise PromptLoadError(f"Prompt file not found: {filename}")
            
        content = prompt_path.read_text(encoding="utf-8")
        
        # Replace safe placeholders
        for key, value in kwargs.items():
            placeholder = f"<<{key.upper()}>>"
            content = content.replace(placeholder, str(value))
            
        return content
    except Exception as e:
        logger.error(f"Error loading or formatting prompt '{filename}': {e}")
        # Return a clear error instead of raising an unhandled exception that causes a generic 500
        raise HTTPException(
            status_code=422,
            detail=f"Prompt formatting error in {filename}: {str(e)}"
        )

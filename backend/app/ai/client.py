import os
import time
import logging
from typing import List, Tuple, Dict, Any, Optional
from abc import ABC, abstractmethod
from openai import OpenAI, APIError, APIConnectionError, APITimeoutError, RateLimitError
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

# --- Strategy Pattern: Base Provider ---
PROVIDER_MAP = {}

class BaseProvider(ABC):
    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        if hasattr(cls, 'provider_name'):
            PROVIDER_MAP[cls.provider_name.lower()] = cls

    def __init__(self, name: str, model_name: str, api_key: str = None, base_url: str = None):
        self.name = name
        self.model_name = model_name
        self.api_key = api_key
        self.base_url = base_url
        self._client: Optional[OpenAI] = None

    def get_client(self) -> OpenAI:
        if not self._client:
            self._client = OpenAI(
                api_key=self.api_key or "empty", 
                base_url=self.base_url,
                max_retries=0, # CRITICAL: Disable internal retries to prevent blocking fallback
                timeout=15.0   # Prevent hanging forever
            )
        return self._client

    def is_configured(self) -> bool:
        # Default expects an API key unless overridden
        return bool(self.api_key)

    def execute(self, **kwargs) -> Any:
        client = self.get_client()
        kwargs.pop("model", None) # Force use the provider's configured model
        return client.chat.completions.create(model=self.model_name, **kwargs)

# --- Concrete Providers ---
class GeminiProvider(BaseProvider):
    provider_name = "gemini"
    def __init__(self, model_name: str):
        super().__init__(
            name="gemini", 
            model_name=model_name, 
            api_key=os.getenv("GEMINI_API_KEY"), 
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        )

class GroqProvider(BaseProvider):
    provider_name = "groq"
    def __init__(self, model_name: str):
        super().__init__(
            name="groq", 
            model_name=model_name, 
            api_key=os.getenv("GROQ_API_KEY"), 
            base_url="https://api.groq.com/openai/v1"
        )

class CerebrasProvider(BaseProvider):
    provider_name = "cerebras"
    def __init__(self, model_name: str):
        super().__init__(
            name="cerebras", 
            model_name=model_name, 
            api_key=os.getenv("CEREBRAS_API_KEY"), 
            base_url="https://api.cerebras.ai/v1"
        )

class OpenRouterProvider(BaseProvider):
    provider_name = "openrouter"
    def __init__(self, model_name: str):
        super().__init__(
            name="openrouter", 
            model_name=model_name, 
            api_key=os.getenv("OPENROUTER_API_KEY"), 
            base_url="https://openrouter.ai/api/v1"
        )

class HuggingFaceProvider(BaseProvider):
    provider_name = "huggingface"
    def __init__(self, model_name: str):
        super().__init__(
            name="huggingface", 
            model_name=model_name, 
            api_key=os.getenv("HUGGINGFACE_API_KEY"), 
            base_url="https://api-inference.huggingface.co/v1/"
        )

class SambaNovaProvider(BaseProvider):
    provider_name = "sambanova"
    def __init__(self, model_name: str):
        super().__init__(
            name="sambanova", 
            model_name=model_name, 
            api_key=os.getenv("SAMBANOVA_API_KEY"), 
            base_url="https://api.sambanova.ai/v1"
        )

class OllamaProvider(BaseProvider):
    provider_name = "ollama"
    def __init__(self, model_name: str):
        super().__init__(
            name="ollama", 
            model_name=model_name, 
            api_key="ollama", # Dummy key required by OpenAI client
            base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1")
        )
        
    def is_configured(self) -> bool:
        return True # Ollama always considered configured if added to chain

# --- Provider Factory ---
def create_provider(provider_name: str, model_name: str) -> Optional[BaseProvider]:
    provider_class = PROVIDER_MAP.get(provider_name.lower())
    if provider_class:
        provider = provider_class(model_name)
        if provider.is_configured():
            return provider
    return None

# --- Main Service ---
class LLMService:
    def __init__(self):
        self.providers: List[BaseProvider] = []
        self._build_provider_chain()

    def _build_provider_chain(self):
        # 1. Load Primary Provider
        primary_name = os.getenv("LLM_PROVIDER", "gemini").lower()
        primary_model = os.getenv("LLM_MODEL", "gemini-2.5-flash")
        primary_provider = create_provider(primary_name, primary_model)
        
        if primary_provider:
            self.providers.append(primary_provider)
        else:
            logger.warning(f"Primary provider '{primary_name}' is missing API key. Skipping.")

        # 2. Load Fallback Providers dynamically by scanning os.environ
        fallback_indices = []
        for key in os.environ.keys():
            if key.startswith("FALLBACK_PROVIDER_"):
                try:
                    idx = int(key.split("_")[-1])
                    fallback_indices.append(idx)
                except ValueError:
                    pass
                    
        fallback_indices.sort()
        
        for idx in fallback_indices:
            fb_name = os.getenv(f"FALLBACK_PROVIDER_{idx}")
            fb_model = os.getenv(f"FALLBACK_MODEL_{idx}")
            
            if not fb_name or not fb_model:
                continue
                
            fb_name = fb_name.lower()
            provider = create_provider(fb_name, fb_model)
            if provider:
                self.providers.append(provider)
            else:
                logger.warning(f"Fallback provider '{fb_name}' (Index {idx}) is missing API key or unsupported. Skipping.")
            
        if not self.providers:
            logger.error("CRITICAL: No valid LLM providers configured!")

    def get_primary_provider(self) -> Optional[BaseProvider]:
        return self.providers[0] if self.providers else None

    def get_provider_chain(self) -> List[BaseProvider]:
        return self.providers

    def get_current_provider(self) -> Optional[BaseProvider]:
        return self.get_primary_provider()

    def chat_completion(self, **kwargs):
        """
        Executes a chat completion by iterating through the provider chain on failure.
        """
        if not self.providers:
            raise Exception("No AI providers configured.")

        start_time = time.time()
        errors = []
        backoff_time = 1.0

        for idx, provider in enumerate(self.providers):
            try:
                # Add logging prefix for primary vs fallback
                prefix = "Primary" if idx == 0 else f"Fallback {idx}"
                logger.info(f"[{prefix}] Trying {provider.name.capitalize()}... ({provider.model_name})")
                
                response = provider.execute(**kwargs)
                
                # Success
                latency = round(time.time() - start_time, 2)
                tokens = response.usage.total_tokens if response and hasattr(response, 'usage') and response.usage else 0
                logger.info(f"[SUCCESS] Response generated by {provider.name.capitalize()} | Tokens: {tokens} | Latency: {latency}s")
                
                return response
                
            except Exception as e:
                error_msg = str(e)
                errors.append(f"{provider.name.capitalize()}: {e.__class__.__name__} - {error_msg}")
                is_last = (idx == len(self.providers) - 1)
                
                if not is_last:
                    next_provider = self.providers[idx + 1]
                    logger.warning(
                        f"[FAILURE] {provider.name.capitalize()} failed: {error_msg}. "
                        f"Switching to {next_provider.name.capitalize()}..."
                    )
                    
                    # Apply exponential backoff only for transient errors before jumping to next provider
                    if isinstance(e, (RateLimitError, APIConnectionError, APITimeoutError)):
                        logger.warning(f"Transient error detected. Backing off for {backoff_time}s...")
                        time.sleep(backoff_time)
                        backoff_time *= 2
                else:
                    logger.error(f"[FAILURE] {provider.name.capitalize()} failed: {error_msg}. All fallback providers exhausted.")

        # If we exhausted the loop
        logger.error("All providers failed.")
        error_summary = " | ".join(errors)
        raise Exception(f"The AI service is temporarily unavailable. All LLM providers failed. Details: {error_summary}")

# Instantiate singleton
llm_service = LLMService()
if llm_service.providers:
    primary = llm_service.providers[0]
    logger.info(f"Using Primary LLM Provider: {primary.name.capitalize()} | Model: {primary.model_name}")
    fallback_names = [p.name.capitalize() for p in llm_service.providers[1:]]
    if fallback_names:
        logger.info(f"Configured Fallback Chain: {' -> '.join(fallback_names)}")
else:
    logger.error("No LLM Providers loaded!")

"""Provider-neutral construction of configured LangChain chat models."""

from __future__ import annotations

import logging
from functools import lru_cache

from django.conf import settings
from langchain_groq import ChatGroq

from apps.project_lab.constants import LLM_MAX_RETRIES
from apps.project_lab.exceptions import LLMConfigurationException

logger = logging.getLogger(__name__)


class LLMProvider:
    """Builds reusable LangChain models behind a provider-neutral boundary.

    Add OpenAI, Anthropic, or Gemini branches here without changing chains or
    application services. Model instances are safe to reuse across requests.
    """

    @classmethod
    @lru_cache(maxsize=1)
    def get_llm(cls) -> ChatGroq:
        """Return one validated chat-model client per application process.

        Returns:
            A configured Groq chat model.

        Raises:
            LLMConfigurationException: If settings are absent, invalid, or unsupported.
        """
        provider = str(getattr(settings, "LLM_PROVIDER", "")).strip().lower()
        if provider == "groq":
            return cls._groq()
        raise LLMConfigurationException(
            "Unsupported LLM provider.", details={"provider": provider or "unset"}
        )

    @staticmethod
    def _groq() -> ChatGroq:
        """Create a validated Groq client without exposing credentials in logs."""
        api_key = str(getattr(settings, "GROQ_API_KEY", "")).strip()
        model = str(getattr(settings, "LLM_MODEL", "")).strip()
        if not api_key or not model:
            raise LLMConfigurationException(
                "LLM provider is not configured.",
                details={
                    "provider": "groq",
                    "missing": "GROQ_API_KEY" if not api_key else "LLM_MODEL",
                },
            )
        try:
            temperature = float(getattr(settings, "LLM_TEMPERATURE", 0.2))
            max_tokens = int(getattr(settings, "LLM_MAX_TOKENS", 4096))
            timeout = float(getattr(settings, "LLM_TIMEOUT", 60))
        except (TypeError, ValueError) as exc:
            raise LLMConfigurationException("LLM numeric settings are invalid.") from exc
        if not 0 <= temperature <= 2 or max_tokens < 1 or timeout <= 0:
            raise LLMConfigurationException("LLM settings are outside supported ranges.")

        logger.info("Configured LLM provider | provider=groq | model=%s", model)
        return ChatGroq(
            api_key=api_key,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens,
            timeout=timeout,
            max_retries=LLM_MAX_RETRIES,
        )
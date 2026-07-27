"""
AI provider service wrapping the Groq LLM client.

Provides retry logic with exponential backoff, request timeouts,
structured logging of AI latency, and safe error handling.
"""

from __future__ import annotations

import logging
import time
from typing import Optional

from django.conf import settings
from groq import APIConnectionError, APIStatusError, APITimeoutError, Groq

from apps.resume_ai.exceptions import AIProviderException, ValidationException

logger = logging.getLogger(__name__)

# ------------------------------------------------------------
# Constants
# ------------------------------------------------------------
DEFAULT_TEMPERATURE: float = 0.3
DEFAULT_MAX_TOKENS: int = 3000
DEFAULT_TIMEOUT_SECONDS: int = 60
MAX_RETRIES: int = 3
RETRY_BASE_DELAY_SECONDS: float = 1.5

VALID_TEMPERATURE_MIN: float = 0.0
VALID_TEMPERATURE_MAX: float = 2.0


class AIService:
    """Thin wrapper around the configured LLM provider (Groq).

    Responsibilities:
        - Send prompt to the LLM.
        - Return raw text response.
        - Handle retries with exponential backoff.
        - Apply request timeouts.
        - Log latency and retry attempts.

    NOT responsible for:
        - Resume analysis logic.
        - Prompt generation.
        - JSON parsing or schema validation.
        - ATS scoring.
    """

    def __init__(self) -> None:
        """Initialises the Groq client using application settings.

        Raises:
            ValidationException: If the API key or model name is missing from settings.
        """
        api_key: Optional[str] = getattr(settings, "GROQ_API_KEY", None)
        model: Optional[str] = getattr(settings, "LLM_MODEL", None)

        if not api_key:
            raise ValidationException(
                "GROQ_API_KEY is not configured in Django settings."
            )

        if not model:
            raise ValidationException(
                "LLM_MODEL is not configured in Django settings."
            )

        self.model: str = model
        self.client: Groq = Groq(
            api_key=api_key,
            timeout=DEFAULT_TIMEOUT_SECONDS,
        )

    def generate(
        self,
        prompt: str,
        *,
        temperature: float = DEFAULT_TEMPERATURE,
        max_tokens: int = DEFAULT_MAX_TOKENS,
    ) -> str:
        """Sends a prompt to the LLM and returns the text completion.

        Implements retry logic with exponential backoff for transient provider
        errors. Never retries validation errors.

        Args:
            prompt: The fully formatted prompt string to send.
            temperature: Sampling temperature (0.0 = deterministic, 2.0 = random).
            max_tokens: Maximum number of tokens in the completion.

        Returns:
            The raw text response from the LLM.

        Raises:
            ValidationException: If temperature or max_tokens are out of bounds.
            AIProviderException: If the LLM fails after all retry attempts.
        """
        self._validate_generation_params(prompt, temperature, max_tokens)

        last_exception: Optional[Exception] = None

        for attempt in range(1, MAX_RETRIES + 1):
            try:
                logger.info(
                    "Sending request to LLM | model=%s | prompt_chars=%d | attempt=%d/%d",
                    self.model,
                    len(prompt),
                    attempt,
                    MAX_RETRIES,
                )

                start_time = time.monotonic()

                response = self.client.chat.completions.create(
                    model=self.model,
                    temperature=temperature,
                    max_tokens=max_tokens,
                    messages=[
                        {
                            "role": "system",
                            "content": (
                                "You are an expert ATS Resume Reviewer and Career Coach. "
                                "Return ONLY valid JSON when asked. No markdown. No commentary."
                            ),
                        },
                        {
                            "role": "user",
                            "content": prompt,
                        },
                    ],
                )

                latency_ms = (time.monotonic() - start_time) * 1000
                raw_text: str = response.choices[0].message.content.strip()

                logger.info(
                    "LLM response received | latency_ms=%.1f | response_chars=%d | attempt=%d",
                    latency_ms,
                    len(raw_text),
                    attempt,
                )

                return raw_text

            except (APIConnectionError, APITimeoutError) as exc:
                last_exception = exc
                delay = RETRY_BASE_DELAY_SECONDS * (2 ** (attempt - 1))
                logger.warning(
                    "Transient LLM error on attempt %d/%d: %s. Retrying in %.1fs.",
                    attempt,
                    MAX_RETRIES,
                    type(exc).__name__,
                    delay,
                )
                if attempt < MAX_RETRIES:
                    time.sleep(delay)

            except APIStatusError as exc:
                # Non-retriable HTTP errors (e.g. 401 Unauthorized, 400 Bad Request)
                logger.error(
                    "Non-retriable LLM provider error: status=%s | message=%s",
                    exc.status_code,
                    exc.message,
                )
                raise AIProviderException(
                    f"LLM provider returned an unrecoverable error (HTTP {exc.status_code})."
                ) from exc

        logger.error(
            "LLM request failed after %d attempts. Last error: %s",
            MAX_RETRIES,
            str(last_exception),
        )
        raise AIProviderException(
            f"LLM provider is unavailable after {MAX_RETRIES} attempts. Please try again later."
        ) from last_exception

    @staticmethod
    def _validate_generation_params(
        prompt: str,
        temperature: float,
        max_tokens: int,
    ) -> None:
        """Validates generation parameters before sending to the LLM.

        Args:
            prompt: Prompt string.
            temperature: Sampling temperature.
            max_tokens: Maximum token budget for the response.

        Raises:
            ValidationException: If any parameter is invalid.
        """
        if not prompt or not prompt.strip():
            raise ValidationException("Prompt cannot be empty.")

        if not (VALID_TEMPERATURE_MIN <= temperature <= VALID_TEMPERATURE_MAX):
            raise ValidationException(
                f"Temperature must be between {VALID_TEMPERATURE_MIN} and {VALID_TEMPERATURE_MAX}. "
                f"Got: {temperature}"
            )

        if max_tokens <= 0 or max_tokens > 32768:
            raise ValidationException(
                f"max_tokens must be between 1 and 32768. Got: {max_tokens}"
            )
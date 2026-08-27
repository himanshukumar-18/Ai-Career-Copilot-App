"""
Custom exception hierarchy for the Resume AI module.

Provides explicit, domain-specific exception types for error handling,
logging, and API response mapping across all AI operations.
"""

from typing import Any, Mapping


class ResumeAIException(Exception):
    """Base exception for all Resume AI errors."""

    def __init__(
        self,
        message: str = "An error occurred in the Resume AI module.",
        details: Mapping[str, Any] | None = None,
    ) -> None:
        super().__init__(message)
        self.message = message
        self.details: dict[str, Any] = dict(details or {})


class PromptBuildException(ResumeAIException):
    """Raised when prompt construction or formatting fails."""


class ParserException(ResumeAIException):
    """Raised when resume database model parsing fails or data is incomplete."""


class FormatterException(ResumeAIException):
    """Raised when converting parsed resume data into Markdown fails."""


class AnalysisException(ResumeAIException):
    """Raised when orchestration of resume analysis fails."""


class LLMConfigurationException(ResumeAIException):
    """Raised when required LLM provider configuration is invalid or missing."""


class ProviderException(ResumeAIException):
    """Raised when communication with the LLM provider (Groq/LangChain) fails."""


class ChainExecutionException(ResumeAIException):
    """Raised when an AI chain cannot produce a valid structured result."""


class ValidationException(ResumeAIException):
    """Raised when input parameters or AI JSON responses fail schema validation."""


# Backwards-compatible name for callers that imported the original exception.
AIProviderException = ProviderException

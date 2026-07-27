"""
Custom exception hierarchy for the Resume AI module.

Provides explicit, domain-specific exception types for error handling,
logging, and API response mapping across all AI operations.
"""

from typing import Any, Dict, Optional


class ResumeAIException(Exception):
    """Base exception for all Resume AI errors."""

    def __init__(
        self,
        message: str = "An error occurred in the Resume AI module.",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message)
        self.message = message
        self.details = details or {}


class PromptBuildException(ResumeAIException):
    """Raised when prompt construction or formatting fails."""

    pass


class ParserException(ResumeAIException):
    """Raised when resume database model parsing fails or data is incomplete."""

    pass


class FormatterException(ResumeAIException):
    """Raised when converting parsed resume data into Markdown fails."""

    pass


class AnalysisException(ResumeAIException):
    """Raised when orchestration of resume analysis fails."""

    pass


class AIProviderException(ResumeAIException):
    """Raised when communication with the LLM provider (Groq/LangChain) fails."""

    pass


class ValidationException(ResumeAIException):
    """Raised when input parameters or AI JSON responses fail schema validation."""

    pass

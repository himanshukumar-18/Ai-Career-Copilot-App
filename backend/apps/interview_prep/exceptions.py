"""Custom domain exceptions for the interview_prep app."""

from typing import Any, Dict, Optional


class InterviewPrepException(Exception):
    """Base exception for all interview prep domain errors."""

    def __init__(
        self,
        message: str = "An error occurred in the interview prep module.",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message)
        self.message = message
        self.details = details or {}


class PrepPlanNotFoundError(InterviewPrepException):
    """Raised when a requested interview preparation plan cannot be found."""

    def __init__(
        self,
        message: str = "The requested interview preparation plan was not found.",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message=message, details=details)


class QuestionNotFoundError(InterviewPrepException):
    """Raised when a specific interview question cannot be found."""

    def __init__(
        self,
        message: str = "The requested interview question was not found.",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message=message, details=details)


class MockSessionNotFoundError(InterviewPrepException):
    """Raised when a requested mock interview session cannot be found."""

    def __init__(
        self,
        message: str = "The requested mock interview session was not found.",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message=message, details=details)


class InvalidSessionStateError(InterviewPrepException):
    """Raised when an operation is performed on an inactive or completed mock session."""

    def __init__(
        self,
        message: str = "Invalid mock interview session state.",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message=message, details=details)


class LLMConfigurationException(InterviewPrepException):
    """Raised when LLM provider environment configuration is missing or invalid."""

    def __init__(
        self,
        message: str = "LLM provider configuration error.",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message=message, details=details)


class LLMRequestFailedError(InterviewPrepException):
    """Raised when an outbound LLM request fails due to connection/timeout error."""

    def __init__(
        self,
        message: str = "AI generation request failed or timed out.",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message=message, details=details)


class PrepGenerationParseError(InterviewPrepException):
    """Raised when LLM output parsing into Pydantic schema fails."""

    def __init__(
        self,
        message: str = "Failed to parse AI output into valid interview prep format.",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message=message, details=details)


class AIGenerationError(InterviewPrepException):
    """General exception for AI generation failure."""

    def __init__(
        self,
        message: str = "An error occurred during AI generation.",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message=message, details=details)

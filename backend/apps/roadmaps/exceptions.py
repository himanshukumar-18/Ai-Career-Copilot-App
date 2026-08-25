"""Custom domain exceptions for the roadmaps app."""

from typing import Any, Dict, Optional


class RoadmapException(Exception):
    """Base exception for all roadmap domain errors."""

    def __init__(
        self,
        message: str = "An error occurred in the roadmap module.",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message)
        self.message = message
        self.details = details or {}


class CareerRoleNotFoundError(RoadmapException):
    """Raised when a requested career role cannot be found."""

    def __init__(
        self,
        message: str = "The requested career role was not found.",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message=message, details=details)


class RoadmapNotFoundError(RoadmapException):
    """Raised when a requested roadmap template cannot be found."""

    def __init__(
        self,
        message: str = "The requested career roadmap was not found.",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message=message, details=details)


class StepNotFoundError(RoadmapException):
    """Raised when a specific roadmap step cannot be found."""

    def __init__(
        self,
        message: str = "The requested roadmap step was not found.",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message=message, details=details)


class AlreadyEnrolledError(RoadmapException):
    """Raised when a user attempts to enroll in a roadmap they are already enrolled in."""

    def __init__(
        self,
        message: str = "You are already enrolled in this career roadmap.",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message=message, details=details)


class NotEnrolledError(RoadmapException):
    """Raised when an operation requires an active roadmap enrollment."""

    def __init__(
        self,
        message: str = "You are not enrolled in this career roadmap.",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message=message, details=details)


class PrerequisiteNotMetError(RoadmapException):
    """Raised when trying to complete a step whose prerequisites have not been completed."""

    def __init__(
        self,
        message: str = "Prerequisite steps must be completed before starting this step.",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message=message, details=details)


class InvalidStatusTransitionError(RoadmapException):
    """Raised when an invalid status transition is requested."""

    def __init__(
        self,
        message: str = "Invalid roadmap or step status transition.",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message=message, details=details)


class LLMConfigurationException(RoadmapException):
    """Raised when LLM provider environment configuration is missing or invalid."""

    def __init__(
        self,
        message: str = "LLM provider configuration error.",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message=message, details=details)


class LLMRequestFailedError(RoadmapException):
    """Raised when an outbound LLM request fails due to connection/timeout error."""

    def __init__(
        self,
        message: str = "AI generation request failed or timed out.",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message=message, details=details)


class RoadmapGenerationParseError(RoadmapException):
    """Raised when the LLM response fails Pydantic schema validation."""

    def __init__(
        self,
        message: str = "Failed to parse AI output into valid roadmap schema.",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message=message, details=details)


class AIGenerationError(RoadmapException):
    """General exception for AI roadmap generation failure."""

    def __init__(
        self,
        message: str = "An error occurred during AI roadmap generation.",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message=message, details=details)


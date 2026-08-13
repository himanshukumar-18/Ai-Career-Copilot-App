"""Custom exceptions for the project_lab app."""


# Base exception all project_lab errors inherit from, carries optional details dict
class ProjectLabException(Exception):
    def __init__(self, message, details=None):
        super().__init__(message)
        self.message = message
        self.details = details or {}


# Raised when LLM provider settings are missing, invalid, or unsupported
class LLMConfigurationException(ProjectLabException):
    pass


# Raised for any failure during AI project generation not covered by a more specific error
class AIGenerationError(ProjectLabException):
    pass


# Raised when the LLM response cannot be parsed into the expected schema
class ProjectGenerationParseError(AIGenerationError):
    pass


# Raised when the LLM call times out or the provider is unreachable
class LLMRequestFailedError(AIGenerationError):
    pass


# Raised when the incoming generation request fails validation before hitting the LLM
class InvalidGenerationRequest(ProjectLabException):
    pass


# Raised when a requested UserProject or GeneratedProject cannot be found for the user
class ProjectNotFoundError(ProjectLabException):
    pass


# Raised when an invalid status transition is attempted on a UserProject
class InvalidProjectStatusTransition(ProjectLabException):
    pass
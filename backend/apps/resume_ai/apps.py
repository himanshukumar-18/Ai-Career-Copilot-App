"""
App configuration for the Resume AI app.
"""

from django.apps import AppConfig


class ResumeAiConfig(AppConfig):
    """Configuration class for the Resume AI app."""

    default_auto_field: str = "django.db.models.BigAutoField"
    name: str = "apps.resume_ai"
    verbose_name: str = "Resume AI"

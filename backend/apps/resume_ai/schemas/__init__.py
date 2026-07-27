"""
Schemas package exports for Resume AI models.
"""

from apps.resume_ai.schemas.analysis_schema import (
    ResumeAnalysis,
    ResumeScores,
)
from apps.resume_ai.schemas.score_schema import (
    ResumeScore,
    Score,
    SectionScore,
)
from apps.resume_ai.schemas.section_schema import (
    SectionAnalysis,
    Suggestion,
)

__all__ = [
    "ResumeAnalysis",
    "ResumeScores",
    "SectionAnalysis",
    "Suggestion",
    "Score",
    "ResumeScore",
    "SectionScore",
]
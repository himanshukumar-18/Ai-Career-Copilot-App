"""
Pydantic schemas for granular score representations.
"""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class Score(BaseModel):
    """Generic score model with grade, level, and UI color metadata."""

    model_config = ConfigDict(extra="ignore")

    value: int = Field(
        ...,
        ge=0,
        le=100,
        description="Numeric score between 0 and 100."
    )
    grade: str = Field(
        ...,
        description="Letter grade (A+, A, B, C, D, F)."
    )
    level: str = Field(
        ...,
        description="Performance level narrative."
    )
    color: str = Field(
        ...,
        description="UI color identifier."
    )
    feedback: Optional[str] = Field(
        default=None,
        description="Short feedback statement."
    )


class ResumeScore(BaseModel):
    """Complete resume scoring summary."""

    model_config = ConfigDict(extra="ignore")

    overall: Score
    ats: Score
    grammar: Score
    readability: Score
    impact: Score


class SectionScore(BaseModel):
    """Section level scoring breakdown."""

    model_config = ConfigDict(extra="ignore")

    summary: Score
    experience: Score
    education: Score
    projects: Score
    skills: Score
    certifications: Score
    languages: Score
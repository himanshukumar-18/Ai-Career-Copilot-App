"""
Pydantic schemas for granular score representations.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class Score(BaseModel):
    """Generic score model with grade, level, and UI color metadata."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    value: int = Field(
        ...,
        ge=0,
        le=100,
        description="Numeric score between 0 and 100."
    )
    grade: Literal["A+", "A", "B", "C", "D", "F"] = Field(
        ...,
        description="Letter grade (A+, A, B, C, D, F)."
    )
    level: str = Field(
        ...,
        min_length=1,
        description="Performance level narrative."
    )
    color: Literal["emerald", "green", "yellow", "orange", "red"] = Field(
        ...,
        description="UI color identifier."
    )
    feedback: str | None = Field(
        default=None,
        description="Short feedback statement."
    )


class ResumeScore(BaseModel):
    """Complete resume scoring summary."""

    model_config = ConfigDict(extra="forbid")

    overall: Score
    ats: Score
    grammar: Score
    readability: Score
    impact: Score


class SectionScore(BaseModel):
    """Section level scoring breakdown."""

    model_config = ConfigDict(extra="forbid")

    summary: Score
    experience: Score
    education: Score
    projects: Score
    skills: Score
    certifications: Score
    languages: Score

"""
Pydantic schemas for individual resume sections and AI suggestions.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class Suggestion(BaseModel):
    """AI improvement suggestion for a resume section."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    title: str = Field(
        min_length=1,
        max_length=160,
        description="Short title of the suggestion."
    )
    description: str = Field(
        min_length=1,
        max_length=1_000,
        description="Detailed explanation of the improvement."
    )
    priority: Literal["low", "medium", "high"] = Field(
        description="Priority level: low | medium | high."
    )


class SectionAnalysis(BaseModel):
    """Generic analysis schema for any resume section."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    score: int = Field(
        ...,
        ge=0,
        le=100,
        description="Section score between 0 and 100."
    )
    feedback: str = Field(
        ...,
        min_length=1,
        max_length=2_000,
        description="Overall section feedback."
    )
    strengths: list[str] = Field(
        ...,
        description="Key strengths identified in this section."
    )
    weaknesses: list[str] = Field(
        ...,
        description="Weaknesses or areas needing improvement."
    )
    missing_keywords: list[str] = Field(
        ...,
        description="Industry or job keywords missing from this section."
    )
    suggestions: list[Suggestion] = Field(
        ...,
        description="Actionable improvement suggestions."
    )
    improved_content: str | None = Field(
        default=None,
        description="AI rewritten version of the section."
    )

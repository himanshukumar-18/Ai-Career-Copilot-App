"""
Pydantic schemas for individual resume sections and AI suggestions.
"""

from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class Suggestion(BaseModel):
    """AI improvement suggestion for a resume section."""

    model_config = ConfigDict(extra="ignore")

    title: str = Field(
        ...,
        description="Short title of the suggestion."
    )
    description: str = Field(
        ...,
        description="Detailed explanation of the improvement."
    )
    priority: str = Field(
        default="medium",
        description="Priority level: low | medium | high."
    )


class SectionAnalysis(BaseModel):
    """Generic analysis schema for any resume section."""

    model_config = ConfigDict(extra="ignore")

    score: int = Field(
        default=70,
        ge=0,
        le=100,
        description="Section score between 0 and 100."
    )
    feedback: str = Field(
        default="",
        description="Overall section feedback."
    )
    strengths: List[str] = Field(
        default_factory=list,
        description="Key strengths identified in this section."
    )
    weaknesses: List[str] = Field(
        default_factory=list,
        description="Weaknesses or areas needing improvement."
    )
    missing_keywords: List[str] = Field(
        default_factory=list,
        description="Industry or job keywords missing from this section."
    )
    suggestions: List[Suggestion] = Field(
        default_factory=list,
        description="Actionable improvement suggestions."
    )
    improved_content: Optional[str] = Field(
        default=None,
        description="AI rewritten version of the section."
    )
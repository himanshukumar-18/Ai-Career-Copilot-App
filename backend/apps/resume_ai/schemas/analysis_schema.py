"""
Pydantic schemas for full resume analysis and scores.
"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

from apps.resume_ai.schemas.section_schema import SectionAnalysis


class ResumeScores(BaseModel):
    """Overall resume scoring breakdown."""

    model_config = ConfigDict(extra="forbid")

    overall_score: int = Field(..., ge=0, le=100, description="Overall weighted score.")
    ats_score: int = Field(..., ge=0, le=100, description="ATS readability and structure score.")
    grammar_score: int = Field(..., ge=0, le=100, description="Grammar and language score.")
    readability_score: int = Field(..., ge=0, le=100, description="Recruiter readability score.")
    impact_score: int = Field(..., ge=0, le=100, description="Action verb and achievement impact score.")


class ResumeAnalysis(BaseModel):
    """Complete AI resume analysis result."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    scores: ResumeScores = Field(
        ...,
        description="Comprehensive resume score metrics."
    )
    strengths: list[str] = Field(
        ...,
        description="Overall resume strengths."
    )
    weaknesses: list[str] = Field(
        ...,
        description="Overall resume weaknesses."
    )
    recommendations: list[str] = Field(
        ...,
        description="High priority recommendations."
    )
    missing_keywords: list[str] = Field(
        ...,
        description="Critical missing industry keywords."
    )
    missing_sections: list[str] = Field(
        ...,
        description="Missing resume sections."
    )
    profile: SectionAnalysis = Field(
        ...,
        description="Personal profile section analysis."
    )
    summary: SectionAnalysis = Field(
        ...,
        description="Professional summary section analysis."
    )
    experience: SectionAnalysis = Field(
        ...,
        description="Work experience section analysis."
    )
    education: SectionAnalysis = Field(
        ...,
        description="Education section analysis."
    )
    projects: SectionAnalysis = Field(
        ...,
        description="Projects section analysis."
    )
    skills: SectionAnalysis = Field(
        ...,
        description="Skills section analysis."
    )
    certifications: SectionAnalysis = Field(
        ...,
        description="Certifications section analysis."
    )
    languages: SectionAnalysis = Field(
        ...,
        description="Languages section analysis."
    )
    final_feedback: str = Field(
        ...,
        min_length=1,
        max_length=3_000,
        description="Overall executive summary feedback."
    )

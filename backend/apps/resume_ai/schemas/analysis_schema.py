"""
Pydantic schemas for full resume analysis and scores.
"""

from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field

from apps.resume_ai.schemas.section_schema import SectionAnalysis, Suggestion


class ResumeScores(BaseModel):
    """Overall resume scoring breakdown."""

    model_config = ConfigDict(extra="ignore")

    overall_score: int = Field(default=70, ge=0, le=100, description="Overall weighted score.")
    ats_score: int = Field(default=70, ge=0, le=100, description="ATS readability and structure score.")
    grammar_score: int = Field(default=75, ge=0, le=100, description="Grammar and language score.")
    readability_score: int = Field(default=75, ge=0, le=100, description="Recruiter readability score.")
    impact_score: int = Field(default=70, ge=0, le=100, description="Action verb and achievement impact score.")


class ResumeAnalysis(BaseModel):
    """Complete AI resume analysis result."""

    model_config = ConfigDict(extra="ignore")

    scores: ResumeScores = Field(
        default_factory=ResumeScores,
        description="Comprehensive resume score metrics."
    )
    strengths: List[str] = Field(
        default_factory=list,
        description="Overall resume strengths."
    )
    weaknesses: List[str] = Field(
        default_factory=list,
        description="Overall resume weaknesses."
    )
    recommendations: List[str] = Field(
        default_factory=list,
        description="High priority recommendations."
    )
    missing_keywords: List[str] = Field(
        default_factory=list,
        description="Critical missing industry keywords."
    )
    missing_sections: List[str] = Field(
        default_factory=list,
        description="Missing resume sections."
    )
    profile: SectionAnalysis = Field(
        default_factory=SectionAnalysis,
        description="Personal profile section analysis."
    )
    summary: SectionAnalysis = Field(
        default_factory=SectionAnalysis,
        description="Professional summary section analysis."
    )
    experience: SectionAnalysis = Field(
        default_factory=SectionAnalysis,
        description="Work experience section analysis."
    )
    education: SectionAnalysis = Field(
        default_factory=SectionAnalysis,
        description="Education section analysis."
    )
    projects: SectionAnalysis = Field(
        default_factory=SectionAnalysis,
        description="Projects section analysis."
    )
    skills: SectionAnalysis = Field(
        default_factory=SectionAnalysis,
        description="Skills section analysis."
    )
    certifications: SectionAnalysis = Field(
        default_factory=SectionAnalysis,
        description="Certifications section analysis."
    )
    languages: SectionAnalysis = Field(
        default_factory=SectionAnalysis,
        description="Languages section analysis."
    )
    final_feedback: str = Field(
        default="Resume analysis complete.",
        description="Overall executive summary feedback."
    )
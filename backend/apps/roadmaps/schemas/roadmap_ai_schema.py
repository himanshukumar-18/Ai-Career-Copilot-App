"""Pydantic validation schemas for AI-generated career roadmaps."""

from typing import List
from pydantic import BaseModel, Field, field_validator


class AIRoadmapResourceSchema(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    url: str = Field(..., min_length=5)
    resource_type: str = Field(..., description="documentation, article, video, course, book, practice")
    provider: str = Field(default="Web Resource")
    is_free: bool = Field(default=True)

    @field_validator("resource_type")
    @classmethod
    def normalize_resource_type(cls, v):
        val = str(v).lower().strip()
        allowed = {"documentation", "article", "video", "course", "book", "practice"}
        return val if val in allowed else "documentation"


class AIRoadmapStepSchema(BaseModel):
    order: int = Field(..., ge=1)
    title: str = Field(..., min_length=2, max_length=200)
    description: str = Field(default="Detailed learning step for this concept.")
    learning_objective: str = Field(default="Master core concepts and application.")
    what_to_learn: List[str] = Field(default_factory=lambda: ["Core Syntax", "Best Practices"])
    what_to_practice: List[str] = Field(default_factory=lambda: ["Hands-on exercises", "Code refactoring"])
    what_to_build: List[str] = Field(default_factory=lambda: ["Mini-project implementation"])
    completion_criteria: str = Field(default="Pass automated tests and code review.")
    estimated_hours: int = Field(default=8, ge=1, le=200)
    difficulty: str = Field(default="intermediate", description="beginner, intermediate, advanced")
    resources: List[AIRoadmapResourceSchema] = Field(default_factory=list)

    @field_validator("difficulty")
    @classmethod
    def normalize_difficulty(cls, v):
        val = str(v).lower().strip()
        allowed = {"beginner", "intermediate", "advanced"}
        return val if val in allowed else "intermediate"


class AIRoadmapPhaseSchema(BaseModel):
    order: int = Field(..., ge=1)
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10)
    estimated_hours: int = Field(..., ge=1, le=500)
    learning_objective: str = Field(..., min_length=5)
    prerequisites_summary: str = Field(default="")
    steps: List[AIRoadmapStepSchema] = Field(..., min_length=1)


class AIRoadmapSkillGapSchema(BaseModel):
    strong_skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    weak_skills: List[str] = Field(default_factory=list)
    priority_skills: List[str] = Field(default_factory=list)


class AIRoadmapResponseSchema(BaseModel):
    career_role: str = Field(..., min_length=2)
    summary: str = Field(..., min_length=20)
    estimated_duration_weeks: int = Field(..., ge=1, le=52)
    skill_gap_analysis: AIRoadmapSkillGapSchema = Field(...)
    phases: List[AIRoadmapPhaseSchema] = Field(..., min_length=1)

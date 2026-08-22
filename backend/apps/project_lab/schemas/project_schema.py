from typing import List

from pydantic import BaseModel, Field, field_validator

from apps.project_lab.constants import (
    Difficulty,
    MAX_ESTIMATED_HOURS,
    MIN_ESTIMATED_HOURS,
)


# Schema for a single AI-generated project idea, enforced on every LLM response
class GeneratedProjectSchema(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    short_description: str = Field(..., min_length=10, max_length=300)
    description: str = Field(..., min_length=30)
    difficulty: str = Field(...)
    tech_stack: List[str] = Field(..., min_length=1)
    estimated_hours: int = Field(...)
    features: List[str] = Field(..., min_length=1)
    learning_outcomes: List[str] = Field(..., min_length=1)

    # difficulty must match one of the values defined in constants.py
    @field_validator("difficulty")
    @classmethod
    def validate_difficulty(cls, value):
        normalized = str(value).lower().strip()
        if normalized not in Difficulty.VALID_VALUES:
            raise ValueError(f"difficulty must be one of {Difficulty.VALID_VALUES}")
        return normalized

    # estimated_hours must stay within a realistic, sane range
    @field_validator("estimated_hours")
    @classmethod
    def validate_estimated_hours(cls, value):
        if value < MIN_ESTIMATED_HOURS or value > MAX_ESTIMATED_HOURS:
            raise ValueError(
                f"estimated_hours must be between {MIN_ESTIMATED_HOURS} and {MAX_ESTIMATED_HOURS}"
            )
        return value

    # tech_stack entries must be non-empty, trimmed strings
    @field_validator("tech_stack", "features", "learning_outcomes")
    @classmethod
    def validate_non_empty_strings(cls, value):
        cleaned = [item.strip() for item in value if item and item.strip()]
        if not cleaned:
            raise ValueError("list fields must contain at least one non-empty item")
        return cleaned


# Wrapper schema for the full LLM response containing multiple generated projects
class GeneratedProjectListSchema(BaseModel):
    projects: List[GeneratedProjectSchema] = Field(..., min_length=1)
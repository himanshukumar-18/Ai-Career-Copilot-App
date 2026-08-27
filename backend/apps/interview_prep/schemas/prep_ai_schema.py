"""Pydantic schemas for LLM structured output validation in interview_prep."""

from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel, Field


class AIResourceSchema(BaseModel):
    """Pydantic DTO for AI generated study resource."""

    title: str = Field(description="Title of the resource or tutorial.")
    url: str = Field(default="", description="URL link to official documentation or verified resource.")
    provider: str = Field(default="Official Documentation", description="Provider/Source name (e.g. Django Docs, MDN, LeetCode).")
    resource_type: str = Field(default="documentation", description="Resource type: documentation, course, tutorial, article, video, practice_platform, book.")
    is_free: bool = Field(default=True, description="Whether the resource is freely accessible.")
    difficulty: str = Field(default="intermediate", description="Difficulty level: beginner, intermediate, advanced.")


class AITopicSchema(BaseModel):
    """Pydantic DTO for an interview preparation topic."""

    title: str = Field(description="Topic title (e.g., 'SQL Query Optimization', 'REST API Authentication').")
    category: str = Field(default="technical", description="Interview category: technical, behavioral, hr, system_design, coding, domain_knowledge, case_study, communication, role_specific, managerial.")
    difficulty: str = Field(default="intermediate", description="Difficulty level: beginner, intermediate, advanced.")
    priority: int = Field(default=1, description="Priority rank (1 = Highest Priority).")
    proficiency_status: str = Field(default="priority", description="Proficiency status: strong, weak, missing, priority.")
    what_to_study: List[str] = Field(default_factory=list, description="Bullet points of concepts to study.")
    what_to_practice: List[str] = Field(default_factory=list, description="Bullet points of practice tasks.")
    resources: List[AIResourceSchema] = Field(default_factory=list, description="Recommended learning resources.")


class AIInterviewPrepPlanSchema(BaseModel):
    """Pydantic DTO for full AI interview preparation plan."""

    target_role: str = Field(description="Target career role.")
    experience_level: str = Field(default="intermediate", description="Target experience level.")
    summary: str = Field(description="Comprehensive executive summary of student's interview readiness and strategy.")
    overall_readiness_score: int = Field(default=50, description="Estimated baseline readiness score (0-100).")
    topics: List[AITopicSchema] = Field(default_factory=list, description="Structured interview preparation topics.")


class AIQuestionSchema(BaseModel):
    """Pydantic DTO for an individual interview question."""

    question_text: str = Field(description="The full text of the interview question.")
    category: str = Field(default="technical", description="Interview category: technical, behavioral, hr, system_design, coding, etc.")
    difficulty: str = Field(default="intermediate", description="Difficulty level: beginner, intermediate, advanced.")
    source_type: str = Field(default="technical", description="Source type: conceptual, technical, resume_based, project_based, jd_specific, behavioral, scenario.")
    ideal_answer_outline: str = Field(default="", description="Detailed outline of an ideal response.")
    key_points: List[str] = Field(default_factory=list, description="Key concepts or keywords the candidate must mention.")


class AIQuestionGenerationSchema(BaseModel):
    """Pydantic DTO for generated question set."""

    questions: List[AIQuestionSchema] = Field(default_factory=list, description="Generated list of interview questions.")


class AIAnswerEvaluationSchema(BaseModel):
    """Pydantic DTO for evaluating a student's answer submission."""

    score: int = Field(description="Score from 0 to 100.")
    is_correct: bool = Field(default=True, description="Whether the answer demonstrates sufficient competence.")
    strengths: List[str] = Field(default_factory=list, description="Strengths demonstrated in the candidate's answer.")
    weaknesses: List[str] = Field(default_factory=list, description="Weaknesses or inaccuracies in the candidate's answer.")
    missing_points: List[str] = Field(default_factory=list, description="Important missing concepts or keywords.")
    ideal_answer: str = Field(description="Model ideal answer to guide the student.")
    improvement_tips: List[str] = Field(default_factory=list, description="Actionable tips to improve performance.")


class AIMockInterviewTurnSchema(BaseModel):
    """Pydantic DTO for a mock interview turn evaluation & adaptive follow-up."""

    score: int = Field(description="Score for the turn (0 to 100).")
    evaluation: str = Field(description="Constructive feedback on the candidate's answer.")
    follow_up_question: str = Field(description="Adaptive next question based on performance.")
    category: str = Field(default="technical", description="Category for the follow-up question.")
    difficulty: str = Field(default="intermediate", description="Difficulty level for follow-up.")
    follow_up_hint: str = Field(default="", description="Hint or key focus for the follow-up question.")


class AIInterviewReadinessSchema(BaseModel):
    """Pydantic DTO for multi-dimensional interview readiness assessment."""

    technical_score: int = Field(default=50, description="Technical readiness score (0-100).")
    behavioral_score: int = Field(default=50, description="Behavioral readiness score (0-100).")
    project_score: int = Field(default=50, description="Project confidence & architectural depth score (0-100).")
    overall_score: int = Field(default=50, description="Weighted overall readiness score (0-100).")
    weak_areas: List[str] = Field(default_factory=list, description="Identified weak topic areas.")
    recommendation: str = Field(description="Executive recommendation & next study steps.")

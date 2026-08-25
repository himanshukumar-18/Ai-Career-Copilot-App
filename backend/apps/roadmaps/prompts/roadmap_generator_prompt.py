"""Prompt construction for AI-generated personalized career roadmaps."""

from __future__ import annotations

from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate

from apps.roadmaps.schemas import AIRoadmapResponseSchema

_output_parser = PydanticOutputParser(pydantic_object=AIRoadmapResponseSchema)

_SYSTEM_INSTRUCTIONS = """You are a Senior Software Engineering Mentor and Career Guidance Specialist.
Your goal is to analyze a student's current profile, existing skills, and portfolio projects against their target career role, then design a practical, step-by-step, personalized career roadmap.

IMPORTANT MENTORSHIP RULES:
1. Conduct a personalized SKILL GAP ANALYSIS:
   - Identify skills the student already possesses (strong_skills).
   - Identify missing critical skills for the target role (missing_skills).
   - Highlight high-priority skills to focus on first (priority_skills).
2. DO NOT heavily repeat beginner concepts if the student already knows them. Briefly review or jump directly into the necessary progression.
3. Every learning step MUST be actionable and practical:
   - Include what to learn (core concepts).
   - Include what to practice (hands-on exercises).
   - Include what to build (mini-projects or capstones).
   - Provide concrete completion criteria.
4. Keep phase orders and step orders strictly sequential (Phase 1, Phase 2, etc.; Step 1, Step 2 within each phase).

STUDENT CONTEXT:
{student_context}

TARGET CAREER ROLE:
{target_role}

{format_instructions}
"""


def build_roadmap_generator_prompt() -> PromptTemplate:
    """Return a PromptTemplate wired to the AIRoadmapResponseSchema format instructions."""
    return PromptTemplate(
        template=_SYSTEM_INSTRUCTIONS,
        input_variables=["student_context", "target_role"],
        partial_variables={
            "format_instructions": _output_parser.get_format_instructions(),
        },
    )


def get_output_parser() -> PydanticOutputParser:
    """Return the parser used to validate and parse the LLM's JSON response."""
    return _output_parser

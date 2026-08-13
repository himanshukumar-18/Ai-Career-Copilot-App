"""Prompt construction for AI-generated project suggestions."""

from __future__ import annotations

from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate

from apps.project_lab.schemas import GeneratedProjectListSchema

# parser drives the format instructions injected into the prompt below
_output_parser = PydanticOutputParser(pydantic_object=GeneratedProjectListSchema)

_SYSTEM_INSTRUCTIONS = """You are a senior software mentor who designs practical,
resume-worthy coding projects for students preparing for internships and
software engineering interviews.

Generate exactly {count} distinct project ideas using the given tech stack
and difficulty level. Each project must be realistic to build, scoped to the
requested difficulty, and genuinely useful for a student's portfolio.

Requirements for every project:
- Use only the requested tech stack, unless a minor supporting tool is essential
- Keep scope achievable within the estimated hours
- Avoid generic tutorial clones (no basic to-do apps, no calculator apps)
- Features must be concrete and buildable, not vague buzzwords
- Learning outcomes must be specific skills gained, not generic statements

Tech stack: {tech_stack}
Difficulty: {difficulty}

{format_instructions}
"""


def build_project_generator_prompt() -> PromptTemplate:
    """Return a PromptTemplate wired to the GeneratedProjectListSchema format.

    Returns:
        A PromptTemplate expecting tech_stack, difficulty, and count inputs.
    """
    return PromptTemplate(
        template=_SYSTEM_INSTRUCTIONS,
        input_variables=["tech_stack", "difficulty", "count"],
        partial_variables={
            "format_instructions": _output_parser.get_format_instructions(),
        },
    )


def get_output_parser() -> PydanticOutputParser:
    """Return the parser used to validate and parse the LLM's JSON response."""
    return _output_parser
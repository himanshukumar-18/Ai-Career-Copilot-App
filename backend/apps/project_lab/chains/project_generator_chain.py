"""Chain for generating software project recommendations using an LLM."""

from __future__ import annotations

import logging
from typing import List

from langchain_core.exceptions import OutputParserException
from pydantic import ValidationError

from apps.project_lab.exceptions import (
    AIGenerationError,
    LLMConfigurationException,
    LLMRequestFailedError,
    ProjectGenerationParseError,
)
from apps.project_lab.llm.client import LLMProvider
from apps.project_lab.prompts.project_generator_prompt import (
    build_project_generator_prompt,
    get_output_parser,
)
from apps.project_lab.schemas import (
    GeneratedProjectListSchema,
    GeneratedProjectSchema,
)

logger = logging.getLogger(__name__)


def generate_projects(
    tech_stack: List[str],
    difficulty: str,
    count: int,
) -> List[GeneratedProjectSchema]:
    """Invoke LLM chain to generate project recommendations.

    Args:
        tech_stack: List of technology names requested by the user.
        difficulty: Desired difficulty level (easy, medium, hard).
        count: Number of project ideas requested.

    Returns:
        List of validated GeneratedProjectSchema objects.

    Raises:
        LLMConfigurationException: If LLM settings are missing/invalid.
        ProjectGenerationParseError: If response cannot be parsed into schema.
        LLMRequestFailedError: If connection or request fails.
        AIGenerationError: For any other generation error.
    """
    try:
        llm = LLMProvider.get_llm()
    except LLMConfigurationException:
        raise
    except Exception as exc:
        logger.exception("Failed to initialize LLM client.")
        raise LLMConfigurationException(
            "Failed to initialize LLM provider.",
            details={"error": str(exc)},
        ) from exc

    prompt = build_project_generator_prompt()
    parser = get_output_parser()
    full_chain = prompt | llm | parser

    tech_stack_str = ", ".join(tech_stack)

    try:
        result: GeneratedProjectListSchema = full_chain.invoke(
            {
                "tech_stack": tech_stack_str,
                "difficulty": difficulty,
                "count": count,
            }
        )
        return result.projects

    except (OutputParserException, ValidationError) as exc:
        logger.exception("Failed to parse LLM response for project generation.")
        raise ProjectGenerationParseError(
            "Failed to parse AI response into the required format.",
            details={"error": str(exc)},
        ) from exc

    except (
        LLMConfigurationException,
        LLMRequestFailedError,
        ProjectGenerationParseError,
        AIGenerationError,
    ):
        raise

    except Exception as exc:
        exc_name = exc.__class__.__name__
        if "Timeout" in exc_name or "Connection" in exc_name or "API" in exc_name:
            logger.exception("LLM API request failed or timed out.")
            raise LLMRequestFailedError(
                "LLM request failed or timed out.",
                details={"error": str(exc)},
            ) from exc

        logger.exception("Unexpected error during project generation.")
        raise AIGenerationError(
            "An error occurred while generating project suggestions.",
            details={"error": str(exc)},
        ) from exc

"""Chain for generating personalized career roadmaps using an LLM."""

from __future__ import annotations

import logging
from langchain_core.exceptions import OutputParserException
from pydantic import ValidationError

from apps.roadmaps.exceptions import (
    AIGenerationError,
    LLMConfigurationException,
    LLMRequestFailedError,
    RoadmapGenerationParseError,
)
from apps.roadmaps.llm import LLMProvider
from apps.roadmaps.prompts import (
    build_roadmap_generator_prompt,
    get_output_parser,
)
from apps.roadmaps.schemas import AIRoadmapResponseSchema

logger = logging.getLogger(__name__)


def generate_ai_roadmap(
    student_context: str,
    target_role: str,
) -> AIRoadmapResponseSchema:
    """Invoke LLM chain to generate a personalized career roadmap.

    Args:
        student_context: Formatted string of student skills, profile, and projects.
        target_role: Target career role title (e.g., "Backend Developer").

    Returns:
        Validated AIRoadmapResponseSchema object.

    Raises:
        LLMConfigurationException: If LLM settings are missing/invalid.
        RoadmapGenerationParseError: If response cannot be parsed into schema.
        LLMRequestFailedError: If connection or request fails.
        AIGenerationError: For any other generation error.
    """
    try:
        llm = LLMProvider.get_llm()
    except LLMConfigurationException:
        raise
    except Exception as exc:
        logger.exception("Failed to initialize LLM client for roadmap generation.")
        raise LLMConfigurationException(
            "Failed to initialize LLM provider.",
            details={"error": str(exc)},
        ) from exc

    prompt = build_roadmap_generator_prompt()
    parser = get_output_parser()
    full_chain = prompt | llm | parser

    try:
        result: AIRoadmapResponseSchema = full_chain.invoke(
            {
                "student_context": student_context,
                "target_role": target_role,
            }
        )
        return result

    except (OutputParserException, ValidationError) as exc:
        logger.exception("Failed to parse LLM response for career roadmap generation.")
        raise RoadmapGenerationParseError(
            "Failed to parse AI response into required roadmap format.",
            details={"error": str(exc)},
        ) from exc

    except (
        LLMConfigurationException,
        LLMRequestFailedError,
        RoadmapGenerationParseError,
        AIGenerationError,
    ):
        raise

    except Exception as exc:
        exc_name = exc.__class__.__name__
        if "Timeout" in exc_name or "Connection" in exc_name or "API" in exc_name:
            logger.exception("LLM API request failed or timed out during roadmap generation.")
            raise LLMRequestFailedError(
                "AI generation request failed or timed out.",
                details={"error": str(exc)},
            ) from exc

        logger.exception("Unexpected error during AI roadmap generation.")
        raise AIGenerationError(
            "An error occurred while generating your personalized career roadmap.",
            details={"error": str(exc)},
        ) from exc

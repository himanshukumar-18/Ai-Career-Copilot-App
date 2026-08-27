"""Validates generation requests and persists AI-generated project ideas."""

from __future__ import annotations

import logging
from typing import List

from django.db import DatabaseError, transaction

from apps.project_lab.chains.project_generator_chain import generate_projects
from apps.project_lab.constants import (
    Difficulty,
    MAX_PROJECT_COUNT,
    MAX_TECH_STACK_ITEMS,
    MIN_PROJECT_COUNT,
    MIN_TECH_STACK_ITEMS,
)
from apps.project_lab.exceptions import (
    AIGenerationError,
    InvalidGenerationRequest,
    ProjectLabException,
)
from apps.project_lab.models import GeneratedProject

logger = logging.getLogger(__name__)


def _validate_request(tech_stack: List[str], difficulty: str, count: int) -> None:
    """Validate generation params before any LLM call is made."""
    if not tech_stack or len(tech_stack) < MIN_TECH_STACK_ITEMS:
        raise InvalidGenerationRequest("tech_stack must include at least one item.")

    if len(tech_stack) > MAX_TECH_STACK_ITEMS:
        raise InvalidGenerationRequest(
            f"tech_stack cannot exceed {MAX_TECH_STACK_ITEMS} items.",
            details={"provided": len(tech_stack)},
        )

    if difficulty not in Difficulty.VALID_VALUES:
        raise InvalidGenerationRequest(
            "Invalid difficulty value.",
            details={"difficulty": difficulty, "allowed": list(Difficulty.VALID_VALUES)},
        )

    if not MIN_PROJECT_COUNT <= count <= MAX_PROJECT_COUNT:
        raise InvalidGenerationRequest(
            f"count must be between {MIN_PROJECT_COUNT} and {MAX_PROJECT_COUNT}.",
            details={"provided": count},
        )


@transaction.atomic
def _persist_generated_projects(
    user,
    tech_stack: List[str],
    difficulty: str,
    count: int,
    generated_items,
) -> List[GeneratedProject]:
    """Save each AI-generated project idea as a GeneratedProject row."""
    rows = [
        GeneratedProject(
            user=user,
            tech_stack=tech_stack,
            difficulty=difficulty,
            requested_count=count,
            title=item.title,
            short_description=item.short_description,
            description=item.description,
            features=item.features,
            learning_outcomes=item.learning_outcomes,
            estimated_hours=item.estimated_hours,
        )
        for item in generated_items
    ]

    try:
        return GeneratedProject.objects.bulk_create(rows)
    except DatabaseError as exc:
        logger.exception("Database error persisting generated projects for user %s", getattr(user, "id", None))
        raise AIGenerationError(
            "Failed to save generated projects to database.",
            details={"error": str(exc)},
        ) from exc


def generate_and_save_projects(
    user,
    tech_stack: List[str],
    difficulty: str,
    count: int,
) -> List[GeneratedProject]:
    """Validate input, call the AI chain, and persist the results.

    Args:
        user: the requesting user.
        tech_stack: technologies the generated projects must use.
        difficulty: one of the values in constants.Difficulty.
        count: number of distinct projects to generate.

    Returns:
        A list of saved GeneratedProject rows.

    Raises:
        InvalidGenerationRequest: if input params fail validation.
        LLMConfigurationException: if the LLM provider is misconfigured.
        AIGenerationError: if the LLM call or response parsing fails.
    """
    _validate_request(tech_stack, difficulty, count)

    try:
        generated_items = generate_projects(
            tech_stack=tech_stack,
            difficulty=difficulty,
            count=count,
        )

        return _persist_generated_projects(
            user=user,
            tech_stack=tech_stack,
            difficulty=difficulty,
            count=count,
            generated_items=generated_items,
        )
    except ProjectLabException:
        raise
    except Exception as exc:
        logger.exception("Unexpected error in generate_and_save_projects for user %s", getattr(user, "id", None))
        raise AIGenerationError(
            "An unexpected error occurred while processing project generation.",
            details={"error": str(exc)},
        ) from exc
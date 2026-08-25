"""Service for generating personalized AI career roadmaps and persisting them into PostgreSQL."""

import logging
from decimal import Decimal
from typing import Any
from django.db import DatabaseError, transaction
from django.utils import timezone

from apps.roadmaps.chains.roadmap_generator_chain import generate_ai_roadmap
from apps.roadmaps.constants import RoadmapStatus, StepStatus
from apps.roadmaps.exceptions import RoadmapException
from apps.roadmaps.models import (
    Roadmap,
    RoadmapPhase,
    RoadmapResource,
    RoadmapStep,
    UserRoadmapProgress,
    UserStepProgress,
)
from apps.roadmaps.services.career_role_service import (
    get_career_role_by_slug,
    get_or_create_career_role,
)
from apps.roadmaps.services.context_service import build_student_context

logger = logging.getLogger(__name__)


@transaction.atomic
def generate_and_save_personalized_roadmap(
    user: Any,
    career_role_input: str,
    force_regenerate: bool = False,
) -> UserRoadmapProgress:
    """Generate an AI-driven, personalized roadmap and persist it for the student.

    Args:
        user: The authenticated User object.
        career_role_input: Slug or title string of the target CareerRole.
        force_regenerate: If True, forces a fresh AI call even if already enrolled.

    Returns:
        UserRoadmapProgress object populated with the personalized AI roadmap.
    """
    role = get_or_create_career_role(career_role_input)

    existing_progress = UserRoadmapProgress.objects.filter(
        user=user, career_role=role
    ).first()

    if existing_progress and not force_regenerate:
        logger.info(
            "Returning existing roadmap enrollment | user=%s | role=%s",
            user.email,
            role.slug,
        )
        return existing_progress

    # Build prompt context
    student_context = build_student_context(user)

    logger.info(
        "Invoking LLM for roadmap generation | user=%s | role=%s",
        user.email,
        role.slug,
    )
    ai_output = generate_ai_roadmap(
        student_context=student_context,
        target_role=role.title,
    )

    try:
        # Create or update master roadmap template for this role
        roadmap, _ = Roadmap.objects.update_or_create(
            career_role=role,
            defaults={
                "title": f"AI Personalized {role.title} Journey",
                "description": ai_output.summary,
                "version": "2.0.0-AI",
                "total_phases": len(ai_output.phases),
                "is_published": True,
            },
        )

        # Clear existing phases and steps if re-generating
        RoadmapPhase.objects.filter(roadmap=roadmap).delete()

        # Batch create phases, steps, and resources
        previous_step = None
        created_steps = []

        for p_schema in ai_output.phases:
            phase = RoadmapPhase.objects.create(
                roadmap=roadmap,
                order=p_schema.order,
                title=p_schema.title,
                description=p_schema.description,
                estimated_hours=p_schema.estimated_hours,
                learning_objective=p_schema.learning_objective,
                prerequisites_summary=p_schema.prerequisites_summary,
            )

            for s_schema in p_schema.steps:
                step = RoadmapStep.objects.create(
                    phase=phase,
                    order=s_schema.order,
                    title=s_schema.title,
                    description=s_schema.description,
                    learning_objective=s_schema.learning_objective,
                    what_to_learn=s_schema.what_to_learn,
                    what_to_practice=s_schema.what_to_practice,
                    what_to_build=s_schema.what_to_build,
                    completion_criteria=s_schema.completion_criteria,
                    estimated_hours=s_schema.estimated_hours,
                    difficulty=s_schema.difficulty,
                    prerequisite_step=previous_step,
                )
                previous_step = step
                created_steps.append(step)

                for r_schema in s_schema.resources:
                    RoadmapResource.objects.create(
                        step=step,
                        title=r_schema.title,
                        url=r_schema.url,
                        resource_type=r_schema.resource_type,
                        provider=r_schema.provider,
                        is_free=r_schema.is_free,
                    )

        first_step = created_steps[0] if created_steps else None
        skill_gap_dict = ai_output.skill_gap_analysis.model_dump()

        # Create or update user progress
        user_progress, created = UserRoadmapProgress.objects.update_or_create(
            user=user,
            career_role=role,
            defaults={
                "roadmap": roadmap,
                "status": RoadmapStatus.IN_PROGRESS,
                "current_step": first_step,
                "completion_percentage": Decimal("0.00"),
                "skill_gap_analysis": skill_gap_dict,
                "started_at": timezone.now(),
            },
        )

        # Re-initialize user step progresses
        UserStepProgress.objects.filter(user_progress=user_progress).delete()
        step_progress_objs = [
            UserStepProgress(
                user_progress=user_progress,
                step=step,
                status=StepStatus.NOT_STARTED,
            )
            for step in created_steps
        ]
        if step_progress_objs:
            UserStepProgress.objects.bulk_create(step_progress_objs)

        logger.info(
            "Persisted AI roadmap | user=%s | role=%s | total_steps=%s",
            user.email,
            role.slug,
            len(created_steps),
        )
        return user_progress

    except DatabaseError as exc:
        logger.exception(
            "Database error persisting AI roadmap | user=%s | role=%s",
            user.email,
            role.slug,
        )
        raise RoadmapException(
            "Failed to save AI-generated roadmap due to a database error."
        ) from exc

"""Core service layer for student roadmap enrollments, progress tracking, and step completion."""

import logging
from decimal import Decimal
from typing import Any, Dict, List, Optional
from django.db import DatabaseError, transaction
from django.utils import timezone

from apps.roadmaps.constants import RoadmapStatus, StepStatus
from apps.roadmaps.exceptions import (
    AlreadyEnrolledError,
    NotEnrolledError,
    PrerequisiteNotMetError,
    RoadmapException,
    StepNotFoundError,
)
from apps.roadmaps.models import (
    RoadmapStep,
    UserRoadmapProgress,
    UserStepProgress,
)
from apps.roadmaps.services.career_role_service import get_career_role_by_slug
from apps.roadmaps.services.roadmap_service import get_roadmap_by_role_slug

logger = logging.getLogger(__name__)


@transaction.atomic
def enroll_user_in_roadmap(user: Any, role_slug: str) -> UserRoadmapProgress:
    """Enroll a student in a career role roadmap and initialize step progress records."""
    role = get_career_role_by_slug(role_slug)
    roadmap = get_roadmap_by_role_slug(role_slug)

    existing = UserRoadmapProgress.objects.filter(user=user, career_role=role).first()
    if existing:
        raise AlreadyEnrolledError(
            message=f"You are already enrolled in the '{role.title}' roadmap.",
            details={"role_slug": role_slug, "enrollment_id": str(existing.id)},
        )

    # Get all steps ordered deterministically
    all_steps = list(
        RoadmapStep.objects.filter(phase__roadmap=roadmap).order_by("phase__order", "order")
    )

    first_step = all_steps[0] if all_steps else None

    try:
        user_progress = UserRoadmapProgress.objects.create(
            user=user,
            career_role=role,
            roadmap=roadmap,
            status=RoadmapStatus.NOT_STARTED,
            current_step=first_step,
            completion_percentage=Decimal("0.00"),
        )

        # Batch initialize step progress records
        step_progress_objs = [
            UserStepProgress(
                user_progress=user_progress,
                step=step,
                status=StepStatus.NOT_STARTED,
            )
            for step in all_steps
        ]
        if step_progress_objs:
            UserStepProgress.objects.bulk_create(step_progress_objs)

        logger.info("User enrolled in roadmap | user=%s | role=%s", user.email, role_slug)
        return user_progress
    except DatabaseError as exc:
        logger.exception("Database error while enrolling user | user=%s | role=%s", user.email, role_slug)
        raise RoadmapException("Failed to enroll in roadmap due to a database error.") from exc


def get_user_progress(user: Any, role_slug: str) -> UserRoadmapProgress:
    """Retrieve detailed roadmap progress for a specific user and career role."""
    role = get_career_role_by_slug(role_slug)
    try:
        return (
            UserRoadmapProgress.objects.select_related("user", "career_role", "roadmap", "roadmap__career_role")
            .prefetch_related(
                "step_progresses",
                "step_progresses__step",
                "step_progresses__step__resources",
                "roadmap__phases",
                "roadmap__phases__steps",
                "roadmap__phases__steps__resources",
            )
            .get(user=user, career_role=role)
        )
    except UserRoadmapProgress.DoesNotExist as exc:
        raise NotEnrolledError(
            message=f"You are not enrolled in the '{role.title}' roadmap.",
            details={"role_slug": role_slug},
        ) from exc


def list_user_roadmaps(user: Any) -> List[UserRoadmapProgress]:
    """List all active roadmap enrollments for a student."""
    return list(
        UserRoadmapProgress.objects.select_related("career_role", "roadmap", "current_step")
        .filter(user=user)
        .order_by("-last_activity_at")
    )


@transaction.atomic
def complete_step(user: Any, step_id: str, notes: Optional[str] = None) -> Dict[str, Any]:
    """Complete a roadmap step, validate prerequisites, update percentage & state, and calculate next step."""
    try:
        step = RoadmapStep.objects.select_related("phase", "phase__roadmap", "phase__roadmap__career_role", "prerequisite_step").get(id=step_id)
    except (RoadmapStep.DoesNotExist, ValueError) as exc:
        raise StepNotFoundError(
            message=f"Roadmap step with ID '{step_id}' was not found.",
            details={"step_id": str(step_id)},
        ) from exc

    role = step.phase.roadmap.career_role

    try:
        user_progress = UserRoadmapProgress.objects.select_related("roadmap").get(
            user=user, career_role=role
        )
    except UserRoadmapProgress.DoesNotExist as exc:
        raise NotEnrolledError(
            message=f"You must be enrolled in the '{role.title}' roadmap to complete steps.",
            details={"role_slug": role.slug},
        ) from exc

    # Check prerequisite step if configured
    if step.prerequisite_step:
        prereq_progress = UserStepProgress.objects.filter(
            user_progress=user_progress, step=step.prerequisite_step
        ).first()
        if not prereq_progress or prereq_progress.status != StepStatus.COMPLETED:
            raise PrerequisiteNotMetError(
                message=f"Prerequisite step '{step.prerequisite_step.title}' must be completed first.",
                details={
                    "step_id": str(step.id),
                    "prerequisite_step_id": str(step.prerequisite_step.id),
                    "prerequisite_title": step.prerequisite_step.title,
                },
            )

    now = timezone.now()

    # Retrieve or create target step progress
    step_prog, _ = UserStepProgress.objects.get_or_create(
        user_progress=user_progress,
        step=step,
        defaults={"status": StepStatus.NOT_STARTED},
    )

    step_prog.status = StepStatus.COMPLETED
    if notes is not None:
        step_prog.notes = notes
    step_prog.completed_at = now
    step_prog.save()

    # Recalculate progress metrics
    all_step_progs = list(
        UserStepProgress.objects.filter(user_progress=user_progress).select_related("step", "step__phase")
    )
    total_steps = len(all_step_progs)
    completed_steps = [sp for sp in all_step_progs if sp.status == StepStatus.COMPLETED]
    completed_count = len(completed_steps)

    percentage = Decimal("0.00")
    if total_steps > 0:
        percentage = Decimal(str(round((completed_count / total_steps) * 100, 2)))

    user_progress.completion_percentage = percentage

    # Update overall roadmap status
    if completed_count == total_steps and total_steps > 0:
        user_progress.status = RoadmapStatus.COMPLETED
        user_progress.completed_at = now
    else:
        user_progress.status = RoadmapStatus.IN_PROGRESS
        if not user_progress.started_at:
            user_progress.started_at = now

    # Compute next uncompleted step
    uncompleted = [
        sp.step
        for sp in sorted(all_step_progs, key=lambda p: (p.step.phase.order, p.step.order))
        if sp.status != StepStatus.COMPLETED
    ]
    next_step = uncompleted[0] if uncompleted else None
    user_progress.current_step = next_step
    user_progress.save()

    logger.info(
        "Step completed | user=%s | step=%s | progress=%s%%",
        user.email,
        step.title,
        percentage,
    )

    return {
        "completed_step": step,
        "user_progress": user_progress,
        "next_step": next_step,
        "completion_percentage": percentage,
    }


def get_next_recommended_step(user: Any, role_slug: str) -> Dict[str, Any]:
    """Calculate the next recommended step and progress metrics for a student."""
    user_progress = get_user_progress(user, role_slug)

    step_progs = list(
        UserStepProgress.objects.filter(user_progress=user_progress)
        .select_related("step", "step__phase")
        .order_by("step__phase__order", "step__order")
    )

    total_count = len(step_progs)
    completed_progs = [sp for sp in step_progs if sp.status == StepStatus.COMPLETED]
    completed_count = len(completed_progs)
    remaining_count = total_count - completed_count

    uncompleted = [sp.step for sp in step_progs if sp.status != StepStatus.COMPLETED]
    next_step = uncompleted[0] if uncompleted else None
    current_step = user_progress.current_step or next_step

    current_phase_title = (
        current_step.phase.title if current_step else "Roadmap Completed"
    )

    return {
        "career_role": user_progress.career_role,
        "current_step": current_step,
        "next_step": next_step,
        "current_phase_title": current_phase_title,
        "completion_percentage": user_progress.completion_percentage,
        "completed_steps_count": completed_count,
        "total_steps_count": total_count,
        "remaining_steps_count": remaining_count,
    }

"""DB-only logic for a user's saved and in-progress projects."""

from __future__ import annotations

import logging
from typing import Optional

from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import DatabaseError
from django.db.models import QuerySet
from django.utils import timezone

from apps.project_lab.constants import ProjectStatus
from apps.project_lab.exceptions import (
    InvalidProjectStatusTransition,
    ProjectLabException,
    ProjectNotFoundError,
)
from apps.project_lab.models import GeneratedProject, UserProject

logger = logging.getLogger(__name__)

# allowed forward transitions per current status
_ALLOWED_TRANSITIONS = {
    ProjectStatus.NOT_STARTED: {ProjectStatus.IN_PROGRESS, ProjectStatus.COMPLETED},
    ProjectStatus.IN_PROGRESS: {ProjectStatus.COMPLETED, ProjectStatus.NOT_STARTED},
    ProjectStatus.COMPLETED: set(),
}


def get_user_projects(user) -> QuerySet[UserProject]:
    """Return all saved projects belonging to the given user."""
    try:
        return UserProject.objects.filter(user=user).select_related("source_generation")
    except DatabaseError as exc:
        logger.exception("Database error fetching user projects for user %s", getattr(user, "id", None))
        raise ProjectLabException("Database error fetching user projects.") from exc


def get_user_project(user, user_project_id) -> UserProject:
    """Return a single UserProject owned by the user, or raise if not found."""
    try:
        return UserProject.objects.select_related("source_generation").get(
            id=user_project_id,
            user=user,
        )
    except (UserProject.DoesNotExist, ValueError, DjangoValidationError) as exc:
        raise ProjectNotFoundError(
            "Project not found.",
            details={"user_project_id": str(user_project_id)},
        ) from exc
    except DatabaseError as exc:
        logger.exception("Database error fetching user project %s", user_project_id)
        raise ProjectLabException("Database error fetching user project.") from exc


def save_generated_project(user, generated_project_id) -> UserProject:
    """Snapshot a chosen GeneratedProject into a new UserProject for the user.

    Args:
        user: the owning user.
        generated_project_id: id of the GeneratedProject the user picked.

    Returns:
        The newly created UserProject.

    Raises:
        ProjectNotFoundError: if the generated project doesn't exist for this user.
    """
    try:
        generated = GeneratedProject.objects.get(id=generated_project_id, user=user)
    except (GeneratedProject.DoesNotExist, ValueError, DjangoValidationError) as exc:
        raise ProjectNotFoundError(
            "Generated project not found.",
            details={"generated_project_id": str(generated_project_id)},
        ) from exc
    except DatabaseError as exc:
        logger.exception("Database error fetching generated project %s", generated_project_id)
        raise ProjectLabException("Database error fetching generated project.") from exc

    try:
        return UserProject.objects.create(
            user=user,
            source_generation=generated,
            title=generated.title,
            description=generated.description,
            difficulty=generated.difficulty,
            tech_stack=generated.tech_stack,
            estimated_hours=generated.estimated_hours,
            status=ProjectStatus.NOT_STARTED,
        )
    except DatabaseError as exc:
        logger.exception("Database error snapshotting project for user %s", getattr(user, "id", None))
        raise ProjectLabException("Database error saving project.") from exc


def update_status(
    user,
    user_project_id,
    new_status: str,
    *,
    repo_link: Optional[str] = None,
    notes: Optional[str] = None,
) -> UserProject:
    """Transition a UserProject's status, stamping timestamps as needed.

    Args:
        user: the owning user.
        user_project_id: id of the UserProject to update.
        new_status: target status, must be a valid ProjectStatus value.
        repo_link: optional repo link to attach.
        notes: optional notes to attach.

    Returns:
        The updated UserProject.

    Raises:
        ProjectNotFoundError: if the project doesn't exist for this user.
        InvalidProjectStatusTransition: if the status change isn't allowed.
    """
    user_project = get_user_project(user, user_project_id)

    if new_status not in ProjectStatus.VALID_VALUES:
        raise InvalidProjectStatusTransition(
            "Invalid status value.",
            details={"status": new_status},
        )

    if new_status != user_project.status:
        allowed = _ALLOWED_TRANSITIONS.get(user_project.status, set())
        if new_status not in allowed:
            raise InvalidProjectStatusTransition(
                "This status change is not allowed.",
                details={"from": user_project.status, "to": new_status},
            )

    user_project.status = new_status

    if repo_link is not None:
        user_project.repo_link = repo_link

    if notes is not None:
        user_project.notes = notes

    if new_status == ProjectStatus.IN_PROGRESS and not user_project.started_at:
        user_project.started_at = timezone.now()

    if new_status == ProjectStatus.COMPLETED:
        user_project.completed_at = timezone.now()

    if new_status == ProjectStatus.NOT_STARTED:
        user_project.started_at = None
        user_project.completed_at = None

    try:
        user_project.save()
        return user_project
    except DatabaseError as exc:
        logger.exception("Database error updating status for project %s", user_project_id)
        raise ProjectLabException("Database error updating project status.") from exc


def delete_user_project(user, user_project_id) -> None:
    """Delete a user's project entry."""
    user_project = get_user_project(user, user_project_id)
    try:
        user_project.delete()
    except DatabaseError as exc:
        logger.exception("Database error deleting project %s", user_project_id)
        raise ProjectLabException("Database error deleting project.") from exc
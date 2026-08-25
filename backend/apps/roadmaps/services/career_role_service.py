"""Service functions for career role lookups and dynamic creation."""

import logging
import uuid
from typing import List
from django.utils.text import slugify

from apps.roadmaps.exceptions import CareerRoleNotFoundError
from apps.roadmaps.models import CareerRole

logger = logging.getLogger(__name__)


def list_active_career_roles() -> List[CareerRole]:
    """Return all active career roles ordered by title."""
    return list(CareerRole.objects.filter(is_active=True).order_by("title"))


def get_career_role_by_slug(slug: str) -> CareerRole:
    """Return a single active career role by slug or raise CareerRoleNotFoundError."""
    try:
        return CareerRole.objects.get(slug=slug, is_active=True)
    except CareerRole.DoesNotExist as exc:
        logger.warning("Career role not found | slug=%s", slug)
        raise CareerRoleNotFoundError(
            message=f"Career role '{slug}' does not exist.",
            details={"slug": slug},
        ) from exc


def get_or_create_career_role(role_input: str) -> CareerRole:
    """Retrieve existing CareerRole by slug/title or dynamically create one for custom input."""
    cleaned = str(role_input).strip()
    if not cleaned:
        raise CareerRoleNotFoundError("Career role title or slug cannot be empty.")

    target_slug = slugify(cleaned)

    # 1. Try slug lookup
    if target_slug:
        role = CareerRole.objects.filter(slug=target_slug).first()
        if role:
            return role

    # 2. Try case-insensitive title lookup
    role = CareerRole.objects.filter(title__iexact=cleaned).first()
    if role:
        return role

    # 3. Create dynamic custom career role
    title = cleaned.title() if len(cleaned) <= 60 else cleaned[:60]
    final_slug = target_slug if target_slug else f"role-{uuid.uuid4().hex[:8]}"

    role = CareerRole.objects.create(
        title=title,
        slug=final_slug,
        description=f"AI personalized learning journey for {title}.",
        category="Custom Engineering Path",
        difficulty="intermediate",
        estimated_duration_weeks=16,
        icon_name="code",
        is_active=True,
    )
    logger.info("Created custom CareerRole | title=%s | slug=%s", title, final_slug)
    return role

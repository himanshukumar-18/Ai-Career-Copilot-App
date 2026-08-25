"""Service functions for retrieving roadmap structures and phase/step trees."""

import logging
from apps.roadmaps.exceptions import RoadmapNotFoundError
from apps.roadmaps.models import Roadmap
from apps.roadmaps.services.career_role_service import get_career_role_by_slug

logger = logging.getLogger(__name__)


def get_roadmap_by_role_slug(role_slug: str) -> Roadmap:
    """Return published roadmap for a career role slug, with prefetch optimizations."""
    role = get_career_role_by_slug(role_slug)
    try:
        return (
            Roadmap.objects.select_related("career_role")
            .prefetch_related(
                "phases",
                "phases__steps",
                "phases__steps__resources",
            )
            .get(career_role=role, is_published=True)
        )
    except Roadmap.DoesNotExist as exc:
        logger.warning("Roadmap template not found | role_slug=%s", role_slug)
        raise RoadmapNotFoundError(
            message=f"No roadmap template available for role '{role_slug}'.",
            details={"role_slug": role_slug},
        ) from exc

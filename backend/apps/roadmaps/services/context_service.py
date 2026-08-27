"""Service for gathering student context (profile, skills, projects, background) for AI prompt input."""

import logging
from typing import Any

from apps.project_lab.models import UserProject

logger = logging.getLogger(__name__)


def build_student_context(user: Any) -> str:
    """Aggregate profile, saved projects, and skill background into a formatted prompt context string."""
    context_lines = []

    # Profile info
    profile = getattr(user, "profile", None)
    if profile:
        if profile.headline:
            context_lines.append(f"Headline/Role Goal: {profile.headline}")
        if profile.bio:
            context_lines.append(f"Bio: {profile.bio}")
        if profile.career_goal:
            context_lines.append(f"Stated Career Goal: {profile.career_goal}")

    # User projects from Project-Lab
    user_projects = list(
        UserProject.objects.filter(user=user).order_by("-updated_at")[:5]
    )
    if user_projects:
        proj_summaries = []
        for p in user_projects:
            techs = ", ".join(p.tech_stack) if p.tech_stack else "Unspecified"
            proj_summaries.append(f"- {p.title} (Status: {p.status}, Tech: {techs})")
        context_lines.append("Portfolio & Lab Projects:")
        context_lines.extend(proj_summaries)
    else:
        context_lines.append("Portfolio Projects: None recorded yet.")

    if not context_lines:
        return "Student Profile: Beginner software engineering student starting fresh."

    return "\n".join(context_lines)

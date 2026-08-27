"""Service for gathering student context (Profile, Resumes, Project-Lab, Roadmaps) for AI prompt input."""

import logging
from typing import Any

from apps.project_lab.models import UserProject
from apps.resumes.model import Resume

logger = logging.getLogger(__name__)


def build_student_context(user: Any) -> str:
    """Aggregate profile, resume claims, portfolio projects, and enrolled roadmaps into a formatted context string."""
    context_lines = []

    # 1. Profile & Goal
    profile = getattr(user, "profile", None)
    if profile:
        if profile.headline:
            context_lines.append(f"Headline/Role Goal: {profile.headline}")
        if profile.bio:
            context_lines.append(f"Bio: {profile.bio}")
        if profile.career_goal:
            context_lines.append(f"Stated Career Goal: {profile.career_goal}")

    # 2. Resume Data (Skills, Experience, Education, Projects)
    active_resume = (
        Resume.objects.filter(user=user).order_by("-updated_at").first()
    )
    if active_resume:
        context_lines.append(f"\n--- Resume Title: {active_resume.title} ---")
        
        # Resume Skills
        skills = list(active_resume.skills.all())
        if skills:
            skill_names = [f"{s.name} ({s.level})" if hasattr(s, "level") else s.name for s in skills]
            context_lines.append("Resume Skills: " + ", ".join(skill_names))
            
        # Resume Experiences
        experiences = list(active_resume.experiences.all())
        if experiences:
            exp_strs = []
            for e in experiences:
                company = getattr(e, "company_name", "") or getattr(e, "company", "")
                position = getattr(e, "job_title", "") or getattr(e, "position", "")
                desc = getattr(e, "description", "")
                exp_strs.append(f"- {position} at {company}: {desc[:150]}")
            context_lines.append("Resume Experiences:\n" + "\n".join(exp_strs))
            
        # Resume Education
        educations = list(active_resume.educations.all())
        if educations:
            edu_strs = [
                f"- {getattr(ed, 'degree', '')} in {getattr(ed, 'field_of_study', '')} at {getattr(ed, 'institution', '')}"
                for ed in educations
            ]
            context_lines.append("Education Background:\n" + "\n".join(edu_strs))

    # 3. User Projects from Project-Lab
    user_projects = list(
        UserProject.objects.filter(user=user).order_by("-updated_at")[:5]
    )
    if user_projects:
        proj_summaries = []
        for p in user_projects:
            techs = ", ".join(p.tech_stack) if p.tech_stack else "Unspecified"
            proj_summaries.append(f"- {p.title} (Status: {p.status}, Tech Stack: {techs})\n  Summary: {p.description[:150]}")
        context_lines.append("\nPortfolio & Project-Lab Projects:\n" + "\n".join(proj_summaries))

    if not context_lines:
        return "Student Candidate Context: Beginner candidate building career portfolio and preparing for target role."

    return "\n".join(context_lines)

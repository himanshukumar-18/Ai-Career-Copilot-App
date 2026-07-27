"""
Parser service for extracting structured resume data from Django ORM models.
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import QuerySet

from apps.resume_ai.exceptions import ParserException, ValidationException
from apps.resumes.model import Resume

logger = logging.getLogger(__name__)


class ParserService:
    """Converts Django Resume ORM models and related entities into clean dictionary structures.

    This service never interacts with LLMs directly. It handles DB retrieval optimization
    and safe field extractions.
    """

    @staticmethod
    def get_optimized_resume(resume_id: int, user: Any) -> Resume:
        """Fetches a single Resume instance with all related fields pre-fetched to avoid N+1 queries.

        Args:
            resume_id: Primary key of the resume to fetch.
            user: Django user requesting the resume.

        Returns:
            Resume instance with select_related and prefetch_related applied.

        Raises:
            ParserException: If the resume ID is invalid or not found for the given user.
        """
        if not isinstance(resume_id, int) or resume_id <= 0:
            raise ValidationException(f"Invalid resume ID provided: {resume_id}")

        try:
            queryset: QuerySet[Resume] = (
                Resume.objects.filter(id=resume_id, user=user)
                .select_related("profile", "summary")
                .prefetch_related(
                    "experiences",
                    "educations",
                    "projects",
                    "skills",
                    "certifications",
                    "languages",
                )
            )
            resume = queryset.get()
            return resume
        except ObjectDoesNotExist as exc:
            logger.warning(
                "Resume not found or access denied for resume_id=%s, user_id=%s",
                resume_id,
                getattr(user, "id", None),
            )
            raise ParserException(
                f"Resume with ID {resume_id} was not found."
            ) from exc

    @classmethod
    def build_resume_data(cls, resume: Resume) -> Dict[str, Any]:
        """Converts a Resume model instance into a structured, sanitized dictionary.

        Args:
            resume: Resume ORM model instance.

        Returns:
            Dict containing normalized data for all resume sections.

        Raises:
            ValidationException: If resume parameter is missing or invalid.
        """
        if not resume:
            raise ValidationException("Resume object cannot be None.")

        logger.debug("Parsing resume data for resume_id=%s", resume.id)

        profile_obj = getattr(resume, "profile", None)
        summary_obj = getattr(resume, "summary", None)

        parsed_data = {
            "resume_id": resume.id,
            "title": getattr(resume, "title", "My Resume"),
            "template": getattr(resume, "template", "classic"),
            "profile": cls._parse_profile(profile_obj, resume.user),
            "summary": cls._parse_summary(summary_obj),
            "experience": cls._parse_experiences(resume),
            "education": cls._parse_educations(resume),
            "projects": cls._parse_projects(resume),
            "skills": cls._parse_skills(resume),
            "certifications": cls._parse_certifications(resume),
            "languages": cls._parse_languages(resume),
        }

        return parsed_data

    @staticmethod
    def _parse_profile(profile_obj: Optional[Any], user: Any) -> Dict[str, str]:
        """Extracts personal profile info from ResumeProfile or falls back to User."""
        if not profile_obj:
            return {
                "full_name": getattr(user, "get_full_name", lambda: "")() or getattr(user, "username", ""),
                "email": getattr(user, "email", ""),
                "phone": "",
                "location": "",
                "linkedin": "",
                "github": "",
            }

        first_name = getattr(profile_obj, "first_name", "") or ""
        last_name = getattr(profile_obj, "last_name", "") or ""
        full_name = f"{first_name} {last_name}".strip()
        if not full_name and user:
            full_name = getattr(user, "get_full_name", lambda: "")() or getattr(user, "username", "")

        email = getattr(profile_obj, "email", "") or getattr(user, "email", "")
        city = getattr(profile_obj, "city", "") or ""
        country = getattr(profile_obj, "country", "") or ""
        location = f"{city}, {country}".strip(", ")

        return {
            "full_name": full_name,
            "email": email,
            "phone": getattr(profile_obj, "phone", "") or "",
            "location": location,
            "headline": getattr(profile_obj, "headline", "") or "",
            "linkedin": getattr(profile_obj, "linkedin", "") or "",
            "github": getattr(profile_obj, "github", "") or "",
            "website": getattr(profile_obj, "website", "") or "",
        }

    @staticmethod
    def _parse_summary(summary_obj: Optional[Any]) -> str:
        """Extracts executive summary text."""
        if not summary_obj:
            return ""
        return getattr(summary_obj, "content", "") or ""

    @staticmethod
    def _parse_experiences(resume: Resume) -> List[Dict[str, Any]]:
        """Extracts work experience list from related experiences manager."""
        experiences = getattr(resume, "experiences", None)
        if not experiences:
            return []

        result = []
        for exp in experiences.all():
            result.append({
                "position": getattr(exp, "position", "") or "",
                "company": getattr(exp, "company", "") or "",
                "employment_type": getattr(exp, "employment_type", "") or "",
                "location": getattr(exp, "location", "") or "",
                "start_date": str(getattr(exp, "start_date", "") or ""),
                "end_date": str(getattr(exp, "end_date", "") or "Present"),
                "description": getattr(exp, "description", "") or "",
            })
        return result

    @staticmethod
    def _parse_educations(resume: Resume) -> List[Dict[str, Any]]:
        """Extracts education entries."""
        educations = getattr(resume, "educations", None)
        if not educations:
            return []

        result = []
        for edu in educations.all():
            result.append({
                "institution": getattr(edu, "institution", "") or "",
                "degree": getattr(edu, "degree", "") or "",
                "field_of_study": getattr(edu, "field_of_study", "") or "",
                "grade": getattr(edu, "grade", "") or "",
                "start_date": str(getattr(edu, "start_date", "") or ""),
                "end_date": str(getattr(edu, "end_date", "") or ""),
            })
        return result

    @staticmethod
    def _parse_projects(resume: Resume) -> List[Dict[str, Any]]:
        """Extracts project entries."""
        projects = getattr(resume, "projects", None)
        if not projects:
            return []

        result = []
        for proj in projects.all():
            result.append({
                "title": getattr(proj, "title", "") or "",
                "technologies": getattr(proj, "technologies", "") or "",
                "description": getattr(proj, "description", "") or "",
                "github_url": getattr(proj, "github_url", "") or "",
                "project_url": getattr(proj, "project_url", "") or "",
            })
        return result

    @staticmethod
    def _parse_skills(resume: Resume) -> List[str]:
        """Extracts skill names as a flat string list."""
        skills = getattr(resume, "skills", None)
        if not skills:
            return []

        result = []
        for skill in skills.all():
            name = getattr(skill, "name", "") or ""
            if name:
                result.append(name)
        return result

    @staticmethod
    def _parse_certifications(resume: Resume) -> List[Dict[str, Any]]:
        """Extracts certification entries."""
        certifications = getattr(resume, "certifications", None)
        if not certifications:
            return []

        result = []
        for cert in certifications.all():
            result.append({
                "title": getattr(cert, "title", "") or "",
                "issuer": getattr(cert, "issuer", "") or "",
                "issue_date": str(getattr(cert, "issue_date", "") or ""),
            })
        return result

    @staticmethod
    def _parse_languages(resume: Resume) -> List[Dict[str, Any]]:
        """Extracts language proficiency entries."""
        languages = getattr(resume, "languages", None)
        if not languages:
            return []

        result = []
        for lang in languages.all():
            result.append({
                "language": getattr(lang, "language", "") or "",
                "proficiency": getattr(lang, "proficiency", "") or "",
            })
        return result
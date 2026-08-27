"""Safe, query-efficient conversion of Resume ORM objects into plain data."""

from __future__ import annotations

import logging
from typing import Any

from django.core.exceptions import ObjectDoesNotExist

from apps.resume_ai.exceptions import ParserException, ValidationException
from apps.resumes.model import Resume

logger = logging.getLogger(__name__)


class ParserService:
    """Extracts only analysis-relevant resume data without invoking an LLM."""

    @staticmethod
    def get_optimized_resume(resume_id: int, user: Any) -> Resume:
        """Load an owned resume with every relation used by the parser prefetched.

        Args:
            resume_id: Positive resume primary key.
            user: Authenticated owner of the resume.

        Returns:
            Optimized Resume instance.

        Raises:
            ValidationException: If the identifier is invalid.
            ParserException: If no owned resume exists.
        """
        if not isinstance(resume_id, int) or isinstance(resume_id, bool) or resume_id < 1:
            raise ValidationException("resume_id must be a positive integer.")
        try:
            return (
                Resume.objects.select_related("profile", "summary", "user")
                .prefetch_related(
                    "experiences", "educations", "projects", "skills", "certifications", "languages"
                )
                .get(id=resume_id, user=user)
            )
        except ObjectDoesNotExist as exc:
            logger.warning("Resume unavailable for analysis | resume_id=%s | user_id=%s", resume_id, getattr(user, "id", None))
            raise ParserException("Resume was not found.") from exc

    @classmethod
    def build_resume_data(cls, resume: Resume) -> dict[str, Any]:
        """Convert a prefetched Resume model into primitive, provider-safe data.

        Args:
            resume: Authorized Resume ORM object.

        Returns:
            Structured resume data without personal contact information.

        Raises:
            ValidationException: If ``resume`` is invalid.
            ParserException: If extraction fails.
        """
        if not isinstance(resume, Resume):
            raise ValidationException("A valid Resume model instance is required.")
        try:
            data = {
                "resume_id": resume.id,
                "title": cls._text(resume.title),
                "profile": cls._profile(getattr(resume, "profile", None)),
                "summary": cls._summary(getattr(resume, "summary", None)),
                "experience": cls._experiences(resume),
                "education": cls._educations(resume),
                "projects": cls._projects(resume),
                "skills": cls._skills(resume),
                "certifications": cls._certifications(resume),
                "languages": cls._languages(resume),
            }
        except Exception as exc:
            logger.exception("Resume parsing failed | resume_id=%s", resume.id)
            raise ParserException("Resume content could not be parsed.") from exc
        logger.info("Resume parsed | resume_id=%s", resume.id)
        return data

    @staticmethod
    def _text(value: Any) -> str:
        """Normalize a model value into stripped text."""
        return str(value or "").strip()

    @classmethod
    def _profile(cls, profile: Any | None) -> dict[str, str]:
        """Return non-sensitive profile data needed for content analysis."""
        if profile is None:
            return {}
        return {
            "headline": cls._text(profile.headline),
        }

    @classmethod
    def _summary(cls, summary: Any | None) -> str:
        """Extract summary content."""
        return cls._text(getattr(summary, "content", ""))

    @classmethod
    def _experiences(cls, resume: Resume) -> list[dict[str, str]]:
        """Extract work history entries."""
        return [{"position": cls._text(item.position), "company": cls._text(item.company), "employment_type": cls._text(item.employment_type), "location": cls._text(item.location), "start_date": cls._text(item.start_date), "end_date": "Present" if item.currently_working else cls._text(item.end_date), "description": cls._text(item.description)} for item in resume.experiences.all()]

    @classmethod
    def _educations(cls, resume: Resume) -> list[dict[str, str]]:
        """Extract education entries."""
        return [{"institution": cls._text(item.institution), "degree": cls._text(item.degree), "field_of_study": cls._text(item.field_of_study), "grade": cls._text(item.grade), "start_date": cls._text(item.start_date), "end_date": "Present" if item.currently_studying else cls._text(item.end_date)} for item in resume.educations.all()]

    @classmethod
    def _projects(cls, resume: Resume) -> list[dict[str, str]]:
        """Extract project entries using the actual model field names."""
        return [{"title": cls._text(item.title), "role": cls._text(item.role), "technologies": cls._text(item.technologies), "description": cls._text(item.description), "github_url": cls._text(item.github_url), "project_url": cls._text(item.live_demo_url)} for item in resume.projects.all()]

    @classmethod
    def _skills(cls, resume: Resume) -> list[str]:
        """Extract visible skill names."""
        return [cls._text(item.name) for item in resume.skills.all() if cls._text(item.name)]

    @classmethod
    def _certifications(cls, resume: Resume) -> list[dict[str, str]]:
        """Extract certification entries using the actual model field names."""
        return [{"title": cls._text(item.name), "issuer": cls._text(item.issuing_organization), "issue_date": cls._text(item.issue_date)} for item in resume.certifications.all()]

    @classmethod
    def _languages(cls, resume: Resume) -> list[dict[str, str]]:
        """Extract language proficiency entries using the actual model field name."""
        return [{"language": cls._text(item.name), "proficiency": cls._text(item.proficiency)} for item in resume.languages.all()]

"""
Formatter service for converting parsed resume dictionaries into structured Markdown documents.
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

from apps.resume_ai.exceptions import FormatterException

logger = logging.getLogger(__name__)

# Max character safety limit to protect LLM context window (~4000 tokens limit for prompt resume body)
MAX_RESUME_CHAR_LIMIT = 16000


class FormatterService:
    """Converts parsed resume dictionary structures into clean Markdown text.

    This service never calls the LLM directly. It is responsible for deterministic
    Markdown formatting, context length truncation, and string safety.
    """

    @classmethod
    def to_markdown(cls, resume: Dict[str, Any], max_chars: int = MAX_RESUME_CHAR_LIMIT) -> str:
        """Converts a parsed resume dictionary into a structured Markdown string.

        Args:
            resume: Parsed resume data dictionary.
            max_chars: Maximum character threshold for prompt safety.

        Returns:
            Formatted Markdown representation of the resume.

        Raises:
            FormatterException: If formatting fails unexpectedly.
        """
        if not isinstance(resume, dict):
            raise FormatterException(f"Expected dict for resume data, got {type(resume).__name__}")

        try:
            sections: List[str] = ["# Resume"]

            profile_md = cls._profile(resume.get("profile", {}))
            if profile_md:
                sections.append(profile_md)

            summary_md = cls._summary(resume.get("summary", ""))
            if summary_md:
                sections.append(summary_md)

            exp_md = cls._experience(resume.get("experience", []))
            if exp_md:
                sections.append(exp_md)

            edu_md = cls._education(resume.get("education", []))
            if edu_md:
                sections.append(edu_md)

            proj_md = cls._projects(resume.get("projects", []))
            if proj_md:
                sections.append(proj_md)

            skills_md = cls._skills(resume.get("skills", []))
            if skills_md:
                sections.append(skills_md)

            langs_md = cls._languages(resume.get("languages", []))
            if langs_md:
                sections.append(langs_md)

            certs_md = cls._certifications(resume.get("certifications", []))
            if certs_md:
                sections.append(certs_md)

            markdown_text = "\n\n".join(sec for sec in sections if sec).strip()

            # Safeguard context window: truncate oversized input if needed
            if len(markdown_text) > max_chars:
                logger.warning(
                    "Resume markdown size (%d chars) exceeds limit (%d chars). Truncating.",
                    len(markdown_text),
                    max_chars,
                )
                markdown_text = markdown_text[:max_chars] + "\n\n... [Content Truncated For Token Safety]"

            return markdown_text

        except Exception as exc:
            logger.exception("Failed to format resume dictionary into Markdown.")
            raise FormatterException("Failed to format resume into Markdown.") from exc

    @staticmethod
    def _profile(profile: Optional[Dict[str, Any]]) -> str:
        """Formats profile information into Markdown."""
        if not profile or not isinstance(profile, dict):
            return ""

        lines = ["## Personal Information"]
        if profile.get("full_name"):
            lines.append(f"Name: {profile['full_name']}")
        if profile.get("email"):
            lines.append(f"Email: {profile['email']}")
        if profile.get("phone"):
            lines.append(f"Phone: {profile['phone']}")
        if profile.get("location"):
            lines.append(f"Location: {profile['location']}")
        if profile.get("headline"):
            lines.append(f"Headline: {profile['headline']}")
        if profile.get("linkedin"):
            lines.append(f"LinkedIn: {profile['linkedin']}")
        if profile.get("github"):
            lines.append(f"GitHub: {profile['github']}")
        if profile.get("website"):
            lines.append(f"Website: {profile['website']}")

        return "\n".join(lines) if len(lines) > 1 else ""

    @staticmethod
    def _summary(summary: Optional[str]) -> str:
        """Formats professional summary into Markdown."""
        if not summary or not str(summary).strip():
            return ""

        return f"## Professional Summary\n\n{summary.strip()}"

    @staticmethod
    def _experience(experiences: Optional[List[Dict[str, Any]]]) -> str:
        """Formats work experience entries into Markdown."""
        if not experiences or not isinstance(experiences, list):
            return ""

        lines = ["## Experience"]
        for exp in experiences:
            if not isinstance(exp, dict):
                continue
            position = exp.get("position", "").strip() or "Position Not Specified"
            company = exp.get("company", "").strip() or "Company Not Specified"
            emp_type = exp.get("employment_type", "").strip()
            loc = exp.get("location", "").strip()
            start = exp.get("start_date", "").strip()
            end = exp.get("end_date", "").strip() or "Present"

            header = f"Position: {position} | Company: {company}"
            if emp_type:
                header += f" ({emp_type})"
            lines.append(f"\n### {header}")

            details = []
            if loc:
                details.append(f"Location: {loc}")
            if start:
                details.append(f"Duration: {start} - {end}")
            if details:
                lines.append(" | ".join(details))

            desc = exp.get("description", "").strip()
            if desc:
                lines.append(f"\n{desc}")

        return "\n".join(lines) if len(lines) > 1 else ""

    @staticmethod
    def _education(items: Optional[List[Dict[str, Any]]]) -> str:
        """Formats education entries into Markdown."""
        if not items or not isinstance(items, list):
            return ""

        lines = ["## Education"]
        for edu in items:
            if not isinstance(edu, dict):
                continue
            inst = edu.get("institution", "").strip() or "Institution Not Specified"
            degree = edu.get("degree", "").strip()
            field = edu.get("field_of_study", "").strip()
            grade = edu.get("grade", "").strip()

            edu_line = f"- {degree} in {field}" if (degree and field) else f"- {degree or field or 'Degree'}"
            edu_line += f" at {inst}"
            if grade:
                edu_line += f" (Grade: {grade})"
            lines.append(edu_line)

        return "\n".join(lines) if len(lines) > 1 else ""

    @staticmethod
    def _projects(projects: Optional[List[Dict[str, Any]]]) -> str:
        """Formats projects into Markdown."""
        if not projects or not isinstance(projects, list):
            return ""

        lines = ["## Projects"]
        for proj in projects:
            if not isinstance(proj, dict):
                continue
            title = proj.get("title", "").strip() or "Project Title"
            techs = proj.get("technologies", "").strip()
            desc = proj.get("description", "").strip()
            github = proj.get("github_url", "").strip()
            url = proj.get("project_url", "").strip()

            lines.append(f"\n### {title}")
            if techs:
                lines.append(f"Technologies: {techs}")
            if desc:
                lines.append(desc)
            links = []
            if github:
                links.append(f"GitHub: {github}")
            if url:
                links.append(f"Live: {url}")
            if links:
                lines.append(" | ".join(links))

        return "\n".join(lines) if len(lines) > 1 else ""

    @staticmethod
    def _skills(skills: Optional[List[str]]) -> str:
        """Formats skills list into Markdown."""
        if not skills or not isinstance(skills, list):
            return ""

        cleaned_skills = [str(s).strip() for s in skills if s and str(s).strip()]
        if not cleaned_skills:
            return ""

        return "## Skills\n\n" + ", ".join(cleaned_skills)

    @staticmethod
    def _languages(items: Optional[List[Dict[str, Any]]]) -> str:
        """Formats language entries into Markdown."""
        if not items or not isinstance(items, list):
            return ""

        lines = ["## Languages"]
        for lang in items:
            if not isinstance(lang, dict):
                continue
            name = lang.get("language", "").strip()
            prof = lang.get("proficiency", "").strip()
            if name:
                line = f"- {name}"
                if prof:
                    line += f" ({prof})"
                lines.append(line)

        return "\n".join(lines) if len(lines) > 1 else ""

    @staticmethod
    def _certifications(items: Optional[List[Dict[str, Any]]]) -> str:
        """Formats certification entries into Markdown."""
        if not items or not isinstance(items, list):
            return ""

        lines = ["## Certifications"]
        for cert in items:
            if not isinstance(cert, dict):
                continue
            title = cert.get("title", "").strip()
            issuer = cert.get("issuer", "").strip()
            if title:
                line = f"- {title}"
                if issuer:
                    line += f" (Issued by: {issuer})"
                lines.append(line)

        return "\n".join(lines) if len(lines) > 1 else ""
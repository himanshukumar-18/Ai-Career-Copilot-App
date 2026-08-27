"""
Prompt service for building AI-ready prompt strings from resume templates.
"""

from __future__ import annotations

import logging
from apps.resume_ai.constants import ESTIMATED_CHARS_PER_TOKEN, MAX_PROMPT_CHARS
from apps.resume_ai.exceptions import PromptBuildException
from apps.resume_ai.prompts import (
    ATS_SYSTEM_PROMPT,
    EXPERIENCE_PROMPT,
    PROJECT_PROMPT,
    RESUME_ANALYSIS_PROMPT,
    SKILLS_PROMPT,
    SUMMARY_PROMPT,
)

logger = logging.getLogger(__name__)

# Token estimation constants (~3 chars per token for rough estimation)
CHARS_PER_TOKEN: int = ESTIMATED_CHARS_PER_TOKEN


class PromptService:
    """Builds prompt strings for each AI task.

    This service never calls the LLM.
    It is responsible only for formatting prompt templates with sanitized inputs
    and enforcing size constraints to prevent token overflow.
    """

    @staticmethod
    def estimate_tokens(text: str) -> int:
        """Estimates token count using a simple character-based approximation.

        Args:
            text: Input string to estimate.

        Returns:
            Approximate token count.
        """
        return max(1, len(text) // CHARS_PER_TOKEN)

    @staticmethod
    def build_resume_analysis(resume_text: str) -> str:
        """Builds the full resume analysis prompt.

        Args:
            resume_text: Markdown-formatted resume content.

        Returns:
            Formatted prompt string ready for the LLM.

        Raises:
            PromptBuildException: If resume_text is empty or prompt formatting fails.
        """
        if not resume_text or not resume_text.strip():
            raise PromptBuildException(
                "Cannot build analysis prompt: resume_text is empty."
            )

        try:
            prompt = RESUME_ANALYSIS_PROMPT.format(resume=resume_text.strip())
        except (KeyError, ValueError) as exc:
            raise PromptBuildException("Resume analysis prompt template is invalid.") from exc

        estimated_tokens = PromptService.estimate_tokens(prompt)
        logger.debug(
            "Built resume_analysis prompt | size=%d chars | estimated_tokens=%d",
            len(prompt),
            estimated_tokens,
        )

        if len(prompt) > MAX_PROMPT_CHARS:
            raise PromptBuildException("Resume content exceeds the configured AI context limit.")

        return prompt

    @staticmethod
    def build_summary(summary: str) -> str:
        """Builds the professional summary improvement prompt.

        Args:
            summary: Original summary text from the resume.

        Returns:
            Formatted prompt string.

        Raises:
            PromptBuildException: If summary is empty.
        """
        if not summary or not summary.strip():
            raise PromptBuildException(
                "Cannot build summary prompt: summary content is empty."
            )

        try:
            prompt = SUMMARY_PROMPT.format(summary=summary.strip())
            logger.debug("Built summary improvement prompt | size=%d chars", len(prompt))
            return prompt
        except (KeyError, ValueError) as exc:
            raise PromptBuildException(
                f"Summary prompt template has a missing placeholder: {exc}"
            ) from exc

    @staticmethod
    def build_experience(experience: str) -> str:
        """Builds the work experience improvement prompt.

        Args:
            experience: Original work experience content.

        Returns:
            Formatted prompt string.

        Raises:
            PromptBuildException: If experience is empty.
        """
        if not experience or not experience.strip():
            raise PromptBuildException(
                "Cannot build experience prompt: experience content is empty."
            )

        try:
            prompt = EXPERIENCE_PROMPT.format(experience=experience.strip())
            logger.debug("Built experience improvement prompt | size=%d chars", len(prompt))
            return prompt
        except (KeyError, ValueError) as exc:
            raise PromptBuildException(
                f"Experience prompt template has a missing placeholder: {exc}"
            ) from exc

    @staticmethod
    def build_project(project: str) -> str:
        """Builds the project description improvement prompt.

        Args:
            project: Original project description content.

        Returns:
            Formatted prompt string.

        Raises:
            PromptBuildException: If project is empty.
        """
        if not project or not project.strip():
            raise PromptBuildException(
                "Cannot build project prompt: project content is empty."
            )

        try:
            prompt = PROJECT_PROMPT.format(project=project.strip())
            logger.debug("Built project improvement prompt | size=%d chars", len(prompt))
            return prompt
        except (KeyError, ValueError) as exc:
            raise PromptBuildException(
                f"Project prompt template has a missing placeholder: {exc}"
            ) from exc

    @staticmethod
    def build_skills(skills: str) -> str:
        """Builds the skills review and suggestion prompt.

        Args:
            skills: Comma-separated or formatted skills string.

        Returns:
            Formatted prompt string.

        Raises:
            PromptBuildException: If skills string is empty.
        """
        if not skills or not skills.strip():
            raise PromptBuildException(
                "Cannot build skills prompt: skills content is empty."
            )

        try:
            prompt = SKILLS_PROMPT.format(skills=skills.strip())
            logger.debug("Built skills improvement prompt | size=%d chars", len(prompt))
            return prompt
        except (KeyError, ValueError) as exc:
            raise PromptBuildException(
                f"Skills prompt template has a missing placeholder: {exc}"
            ) from exc

    @staticmethod
    def get_ats_system_prompt() -> str:
        """Returns the standard ATS system prompt.

        Returns:
            ATS system message string.
        """
        return ATS_SYSTEM_PROMPT

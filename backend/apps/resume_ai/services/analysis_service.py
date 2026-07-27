"""
Analysis orchestration service for AI-powered resume review.

Coordinates the full pipeline:
    Resume ORM Model
        → Parser (structured dict extraction)
        → Formatter (Markdown generation)
        → PromptService (prompt construction)
        → AIService (LLM call with retries)
        → JSON Parser + Pydantic validation
        → ScoreService (normalization and scoring)
        → ResumeAnalysis result
"""

from __future__ import annotations

import json
import logging
import time
from typing import Any, Dict

from pydantic import ValidationError

from apps.resume_ai.exceptions import (
    AIProviderException,
    AnalysisException,
    FormatterException,
    ParserException,
    PromptBuildException,
    ValidationException,
)
from apps.resume_ai.schemas import ResumeAnalysis
from apps.resume_ai.services.ai_service import AIService
from apps.resume_ai.services.formatter_service import FormatterService
from apps.resume_ai.services.parser_service import ParserService
from apps.resume_ai.services.prompt_service import PromptService
from apps.resume_ai.services.score_service import ScoreService

logger = logging.getLogger(__name__)


class AnalysisService:
    """Orchestrates the complete AI resume analysis pipeline.

    Pipeline:
        Resume (ORM) → Parser → Formatter → PromptService → AIService
            → JSON parse → Pydantic validate → ScoreService → ResumeAnalysis

    Attributes:
        ai_service: The LLM provider abstraction (Groq by default).
    """

    def __init__(self) -> None:
        """Initialises AnalysisService and eagerly builds the AIService instance.

        Raises:
            ValidationException: If LLM configuration is missing.
        """
        self.ai_service: AIService = AIService()

    def analyze(self, resume: Any) -> ResumeAnalysis:
        """Runs the full resume AI analysis pipeline on a Resume ORM instance.

        Args:
            resume: A Django Resume model instance. Must be pre-fetched with
                    related fields (profile, summary, experiences, etc.).

        Returns:
            A fully validated and normalized ResumeAnalysis Pydantic model.

        Raises:
            ValidationException: If the resume object is missing or invalid.
            ParserException: If resume data extraction fails.
            FormatterException: If Markdown conversion fails.
            PromptBuildException: If prompt construction fails.
            AIProviderException: If the LLM call fails after all retries.
            AnalysisException: If JSON parsing or schema validation fails.
        """
        if resume is None:
            raise ValidationException("Resume object cannot be None.")

        resume_id: int = getattr(resume, "id", None)
        pipeline_start = time.monotonic()

        logger.info(
            "Starting resume analysis pipeline | resume_id=%s",
            resume_id,
        )

        # ------------------------------------------------------------------
        # Step 1 — Parse Resume ORM into structured dictionary
        # ------------------------------------------------------------------
        try:
            parsed_resume: Dict[str, Any] = ParserService.build_resume_data(resume)
        except (ParserException, ValidationException):
            raise
        except Exception as exc:
            logger.exception(
                "Unexpected error during resume parsing | resume_id=%s", resume_id
            )
            raise ParserException(
                "An unexpected error occurred while parsing the resume."
            ) from exc

        # ------------------------------------------------------------------
        # Step 2 — Convert to Markdown for the LLM prompt
        # ------------------------------------------------------------------
        try:
            markdown: str = FormatterService.to_markdown(parsed_resume)
        except FormatterException:
            raise
        except Exception as exc:
            logger.exception(
                "Unexpected error during Markdown formatting | resume_id=%s", resume_id
            )
            raise FormatterException(
                "An unexpected error occurred while formatting the resume."
            ) from exc

        if not markdown.strip():
            raise ValidationException(
                f"Resume ID {resume_id} produced empty Markdown content. "
                "Ensure the resume has at least some populated sections."
            )

        # ------------------------------------------------------------------
        # Step 3 — Build analysis prompt
        # ------------------------------------------------------------------
        try:
            prompt: str = PromptService.build_resume_analysis(markdown)
        except PromptBuildException:
            raise
        except Exception as exc:
            logger.exception(
                "Unexpected error during prompt construction | resume_id=%s", resume_id
            )
            raise PromptBuildException(
                "An unexpected error occurred while building the analysis prompt."
            ) from exc

        logger.info(
            "Analysis prompt built | resume_id=%s | prompt_chars=%d | estimated_tokens=%d",
            resume_id,
            len(prompt),
            PromptService.estimate_tokens(prompt),
        )

        # ------------------------------------------------------------------
        # Step 4 — Call the LLM
        # ------------------------------------------------------------------
        try:
            raw_response: str = self.ai_service.generate(prompt)
        except (AIProviderException, ValidationException):
            raise
        except Exception as exc:
            logger.exception(
                "Unexpected error during LLM generation | resume_id=%s", resume_id
            )
            raise AIProviderException(
                "An unexpected error occurred during the AI call."
            ) from exc

        # ------------------------------------------------------------------
        # Step 5 — Sanitize and parse LLM JSON output
        # ------------------------------------------------------------------
        sanitized_response = self._sanitize_json_response(raw_response)

        try:
            data: Dict[str, Any] = json.loads(sanitized_response)
        except json.JSONDecodeError as exc:
            logger.error(
                "JSON decode failed for resume_id=%s | response_preview=%.200r",
                resume_id,
                raw_response,
            )
            raise AnalysisException(
                "The AI returned an invalid JSON response. This may be a transient issue."
            ) from exc

        # ------------------------------------------------------------------
        # Step 6 — Validate against Pydantic schema
        # ------------------------------------------------------------------
        try:
            analysis: ResumeAnalysis = ResumeAnalysis.model_validate(data)
        except ValidationError as exc:
            logger.error(
                "Pydantic schema validation failed for resume_id=%s | errors=%s",
                resume_id,
                exc.errors(),
            )
            raise AnalysisException(
                "The AI response did not match the expected schema."
            ) from exc

        # ------------------------------------------------------------------
        # Step 7 — Normalize and recalculate scores
        # ------------------------------------------------------------------
        analysis = ScoreService.normalize_scores(analysis)
        analysis = ScoreService.calculate_overall_score(analysis)

        total_ms = (time.monotonic() - pipeline_start) * 1000
        logger.info(
            "Resume analysis pipeline completed | resume_id=%s | overall_score=%d | total_ms=%.1f",
            resume_id,
            analysis.scores.overall_score,
            total_ms,
        )

        return analysis

    @staticmethod
    def _sanitize_json_response(raw: str) -> str:
        """Strips common LLM response artifacts like markdown code fences.

        Some LLM responses wrap JSON in ```json ... ``` blocks despite instruction.
        This method safely strips those markers.

        Args:
            raw: The raw text response from the LLM.

        Returns:
            Cleaned string intended to be valid JSON.
        """
        text = raw.strip()

        # Remove markdown code fences e.g. ```json\n...\n```
        if text.startswith("```"):
            lines = text.splitlines()
            # Drop first line (``` or ```json) and last line (```)
            if lines[-1].strip() == "```":
                text = "\n".join(lines[1:-1]).strip()
            else:
                text = "\n".join(lines[1:]).strip()

        return text
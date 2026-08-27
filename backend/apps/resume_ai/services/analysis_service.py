"""Application service that orchestrates deterministic resume analysis stages."""

from __future__ import annotations

import logging
import time
from typing import Any

from apps.resume_ai.exceptions import (
    AnalysisException,
    ChainExecutionException,
    FormatterException,
    ParserException,
    ProviderException,
    ValidationException,
)
from apps.resume_ai.schemas import ResumeAnalysis
from apps.resume_ai.services.ai_service import AIService
from apps.resume_ai.services.formatter_service import FormatterService
from apps.resume_ai.services.parser_service import ParserService
from apps.resume_ai.services.score_service import ScoreService

logger = logging.getLogger(__name__)


class AnalysisService:
    """Coordinates parser, formatter, structured AI chain, and score normalization."""

    def __init__(self, ai_service: AIService | None = None) -> None:
        """Initialize with an injectable AI service for fast, isolated tests.

        Args:
            ai_service: Optional configured AI service.
        """
        self.ai_service: AIService = ai_service or AIService()

    def analyze(self, resume: Any) -> ResumeAnalysis:
        """Create an AI analysis for a prefetched, authorized resume.

        Args:
            resume: Resume ORM object loaded with its analysis relations.

        Returns:
            Schema-validated and deterministically scored analysis.

        Raises:
            ValidationException: If no usable resume content is available.
            ParserException: If ORM extraction fails.
            FormatterException: If deterministic formatting fails.
            ChainExecutionException: If the provider returns unusable structured output.
            ProviderException: If the provider cannot be reached or complete the request.
            AnalysisException: If an unexpected orchestration error occurs.
        """
        if resume is None:
            raise ValidationException("Resume object cannot be None.")
        resume_id = getattr(resume, "id", None)
        started_at = time.monotonic()
        try:
            parsed_resume = ParserService.build_resume_data(resume)
            markdown = FormatterService.to_markdown(parsed_resume)
            if not markdown.strip() or markdown == "# Resume":
                raise ValidationException("Resume has no analysable content.")
            analysis = self.ai_service.analyze(markdown, resume_id=resume_id)
            analysis = ScoreService.normalize_scores(analysis)
            analysis = ScoreService.calculate_overall_score(analysis)
        except (ValidationException, ParserException, FormatterException, ChainExecutionException, ProviderException):
            raise
        except Exception as exc:
            logger.exception("Analysis orchestration failed | resume_id=%s", resume_id)
            raise AnalysisException("Resume analysis could not be completed.") from exc

        logger.info(
            "Resume analysis completed | resume_id=%s | total_ms=%.1f | overall_score=%s",
            resume_id,
            (time.monotonic() - started_at) * 1000,
            analysis.scores.overall_score,
        )
        return analysis

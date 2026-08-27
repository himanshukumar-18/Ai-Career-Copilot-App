"""
Score normalization and calculation service for resume analysis.
"""

from __future__ import annotations

import logging
from statistics import mean
from typing import Dict

from apps.resume_ai.schemas import ResumeAnalysis

logger = logging.getLogger(__name__)

# Score boundary constants
SCORE_MIN: int = 0
SCORE_MAX: int = 100


class ScoreService:
    """Responsible for score normalization, overall score calculation, and grade/level labeling.

    Never communicates with the LLM.
    All operations are deterministic and stateless.
    """

    @staticmethod
    def clamp(score: int | float) -> int:
        """Ensures a score stays within the valid 0–100 range.

        Args:
            score: Raw numeric score value.

        Returns:
            Integer score clamped to [0, 100].
        """
        return max(SCORE_MIN, min(SCORE_MAX, round(score)))

    @classmethod
    def normalize_scores(cls, analysis: ResumeAnalysis) -> ResumeAnalysis:
        """Clamps all score values within ResumeAnalysis to [0, 100].

        Args:
            analysis: ResumeAnalysis instance with raw scores from LLM.

        Returns:
            ResumeAnalysis with all scores safely clamped.
        """
        scores = analysis.scores
        scores.ats_score = cls.clamp(scores.ats_score)
        scores.grammar_score = cls.clamp(scores.grammar_score)
        scores.readability_score = cls.clamp(scores.readability_score)
        scores.impact_score = cls.clamp(scores.impact_score)
        scores.overall_score = cls.clamp(scores.overall_score)

        logger.debug(
            "Normalized scores | ats=%d | grammar=%d | readability=%d | impact=%d | overall=%d",
            scores.ats_score,
            scores.grammar_score,
            scores.readability_score,
            scores.impact_score,
            scores.overall_score,
        )

        return analysis

    @classmethod
    def calculate_overall_score(cls, analysis: ResumeAnalysis) -> ResumeAnalysis:
        """Calculates and sets the overall score as a mean of component scores.

        The overall_score is recalculated from ats, grammar, readability,
        and impact scores rather than trusting the LLM's self-reported value.

        Args:
            analysis: ResumeAnalysis instance post-normalization.

        Returns:
            ResumeAnalysis with recalculated overall_score.
        """
        scores = analysis.scores

        component_scores = [
            scores.ats_score,
            scores.grammar_score,
            scores.readability_score,
            scores.impact_score,
        ]

        calculated_overall = cls.clamp(mean(component_scores))
        scores.overall_score = calculated_overall

        logger.debug(
            "Calculated overall_score=%d from components=%s",
            calculated_overall,
            component_scores,
        )

        return analysis

    @staticmethod
    def grade(score: int) -> str:
        """Returns a letter grade for a given numeric score.

        Args:
            score: Numeric score between 0 and 100.

        Returns:
            Letter grade string: A+, A, B, C, D, or F.
        """
        if score >= 90:
            return "A+"
        if score >= 80:
            return "A"
        if score >= 70:
            return "B"
        if score >= 60:
            return "C"
        if score >= 50:
            return "D"
        return "F"

    @staticmethod
    def level(score: int) -> str:
        """Returns a human-readable performance level label for a score.

        Args:
            score: Numeric score between 0 and 100.

        Returns:
            Performance level label string.
        """
        if score >= 90:
            return "Excellent"
        if score >= 80:
            return "Very Good"
        if score >= 70:
            return "Good"
        if score >= 60:
            return "Average"
        if score >= 50:
            return "Needs Improvement"
        return "Poor"

    @staticmethod
    def color(score: int) -> str:
        """Returns a UI color token string corresponding to a score range.

        Args:
            score: Numeric score between 0 and 100.

        Returns:
            Color identifier string for frontend rendering.
        """
        if score >= 90:
            return "emerald"
        if score >= 80:
            return "green"
        if score >= 70:
            return "yellow"
        if score >= 60:
            return "orange"
        return "red"

    @classmethod
    def build_score_summary(cls, analysis: ResumeAnalysis) -> Dict[str, object]:
        """Builds a concise score summary dictionary suitable for API responses.

        Args:
            analysis: Fully analyzed and normalized ResumeAnalysis instance.

        Returns:
            Dict with score, grade, level, and color keys.
        """
        overall = analysis.scores.overall_score

        return {
            "score": overall,
            "grade": cls.grade(overall),
            "level": cls.level(overall),
            "color": cls.color(overall),
        }
"""Application-facing adapter for AI analysis chains."""

from __future__ import annotations

from apps.resume_ai.chains import ResumeAnalysisChain
from apps.resume_ai.schemas import ResumeAnalysis


class AIService:
    """Provides a small, injectable application boundary around AI execution."""

    def __init__(self, chain: ResumeAnalysisChain | None = None) -> None:
        """Initialize the service with a chain or the production default.

        Args:
            chain: Optional chain dependency for unit tests or future workflows.
        """
        self.chain: ResumeAnalysisChain = chain or ResumeAnalysisChain()

    def analyze(self, resume_markdown: str, *, resume_id: int | None = None) -> ResumeAnalysis:
        """Run structured resume analysis.

        Args:
            resume_markdown: Formatted resume content.
            resume_id: Safe logging identifier.

        Returns:
            Validated analysis produced by the configured chain.
        """
        return self.chain.invoke(resume_markdown, resume_id=resume_id)

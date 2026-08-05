"""Structured LangChain runnable for resume analysis."""

from __future__ import annotations

import logging
import time
from typing import Any

from django.conf import settings
from langchain_core.prompts import ChatPromptTemplate
from pydantic import ValidationError

from apps.resume_ai.exceptions import ChainExecutionException, ProviderException
from apps.resume_ai.llm import LLMProvider
from apps.resume_ai.prompts import ATS_SYSTEM_PROMPT, RESUME_ANALYSIS_PROMPT
from apps.resume_ai.schemas import ResumeAnalysis

logger = logging.getLogger(__name__)


class ResumeAnalysisChain:
    """Runs the analysis prompt and validates the provider's structured output.

    The chain owns LangChain composition only. Parsing, formatting, authorization,
    and HTTP concerns remain in their respective layers.
    """

    def __init__(self, llm: Any | None = None) -> None:
        """Initialize the chain, optionally accepting a test double model.

        Args:
            llm: Optional LangChain-compatible chat model for dependency injection.
        """
        self.prompt: ChatPromptTemplate = ChatPromptTemplate.from_messages(
            (("system", ATS_SYSTEM_PROMPT), ("human", RESUME_ANALYSIS_PROMPT))
        )
        model = llm or LLMProvider.get_llm()
        self.chain: Any = self.prompt | model.with_structured_output(
            ResumeAnalysis, include_raw=True
        )

    def invoke(self, resume_markdown: str, *, resume_id: int | None = None) -> ResumeAnalysis:
        """Invoke the chain and return schema-validated analysis.

        Args:
            resume_markdown: Bounded, formatted resume text.
            resume_id: Resume identifier used only for safe operational logging.

        Returns:
            Validated resume analysis.

        Raises:
            ChainExecutionException: If the provider fails or returns invalid output.
        """
        started_at = time.monotonic()
        try:
            result = self.chain.invoke({"resume": resume_markdown})
            raw_result = result.get("raw") if isinstance(result, dict) else None
            usage = getattr(raw_result, "usage_metadata", None) or {}
            parsed_result = result.get("parsed") if isinstance(result, dict) else result
            if isinstance(result, dict) and result.get("parsing_error"):
                raise ChainExecutionException("The AI response could not be parsed.")
            analysis = (
                parsed_result
                if isinstance(parsed_result, ResumeAnalysis)
                else ResumeAnalysis.model_validate(parsed_result)
            )
        except ValidationError as exc:
            logger.warning("Invalid structured LLM output | resume_id=%s", resume_id)
            raise ChainExecutionException("The AI response did not match the required schema.") from exc
        except ChainExecutionException:
            raise
        except Exception as exc:
            logger.exception("Resume analysis chain failed | resume_id=%s", resume_id)
            raise ProviderException("The AI provider could not complete the analysis.") from exc

        logger.info(
            "LLM analysis completed | resume_id=%s | provider=%s | model=%s | prompt_chars=%d | latency_ms=%.1f | input_tokens=%s | output_tokens=%s",
            resume_id,
            getattr(settings, "LLM_PROVIDER", "unknown"),
            getattr(settings, "LLM_MODEL", "unknown"),
            len(resume_markdown),
            (time.monotonic() - started_at) * 1000,
            usage.get("input_tokens"),
            usage.get("output_tokens"),
        )
        return analysis

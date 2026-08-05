"""Shared constants for the Resume AI bounded context."""

from __future__ import annotations

from typing import Final

ANALYSIS_MAX_RESUME_CHARS: Final[int] = 16_000
MAX_PROMPT_CHARS: Final[int] = 20_000
ESTIMATED_CHARS_PER_TOKEN: Final[int] = 4
DEFAULT_LLM_RETRIES: Final[int] = 2
VALID_RESUME_SECTIONS: Final[tuple[str, ...]] = (
    "profile",
    "summary",
    "experience",
    "education",
    "projects",
    "skills",
    "certifications",
    "languages",
)

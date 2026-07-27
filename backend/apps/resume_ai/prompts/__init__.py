"""
Prompts package exports for Resume AI prompt templates.
"""

from apps.resume_ai.prompts.ats_prompt import ATS_SYSTEM_PROMPT
from apps.resume_ai.prompts.improve_experience import EXPERIENCE_PROMPT
from apps.resume_ai.prompts.improve_project import PROJECT_PROMPT
from apps.resume_ai.prompts.improve_skills import SKILLS_PROMPT
from apps.resume_ai.prompts.improve_summary import SUMMARY_PROMPT
from apps.resume_ai.prompts.resume_analysis import RESUME_ANALYSIS_PROMPT

__all__ = [
    "ATS_SYSTEM_PROMPT",
    "RESUME_ANALYSIS_PROMPT",
    "SUMMARY_PROMPT",
    "EXPERIENCE_PROMPT",
    "PROJECT_PROMPT",
    "SKILLS_PROMPT",
]
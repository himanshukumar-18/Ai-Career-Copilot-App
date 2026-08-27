"""
Human Prompt
"""

RESUME_ANALYSIS_PROMPT: str = """Analyse the resume below for ATS compatibility, grammar,
readability, impact, technical skills, experience, projects, education, certifications,
and languages. Score only from the supplied evidence.

<resume>
{resume}
</resume>

Return the structured response required by the schema."""

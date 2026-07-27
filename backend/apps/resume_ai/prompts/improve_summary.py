"""
Prompt template for rewriting professional resume summaries.
"""

SUMMARY_PROMPT: str = """
Rewrite the following professional summary to be concise, compelling, and ATS-optimized.

Summary:

{summary}

Rules:
• Length: 80 to 120 words maximum.
• Highlight core expertise, key achievements, and value proposition.
• Use active, professional voice.
• Avoid buzzwords or generic self-praise without substance.

Return ONLY the rewritten summary text.
"""
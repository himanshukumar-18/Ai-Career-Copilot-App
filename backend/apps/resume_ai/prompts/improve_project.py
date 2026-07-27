"""
Prompt template for improving project descriptions.
"""

PROJECT_PROMPT: str = """
Improve the following project description for technical impact and business value.

Project:

{project}

Focus:
• Highlight architecture, key technical challenges solved, and results.
• Clearly outline the technology stack utilized.
• Make bullet points concise, clear, and recruiter-friendly.

Return ONLY the improved project description text.
"""
"""
Prompt template for analyzing and suggesting skill section improvements.
"""

SKILLS_PROMPT: str = """
Analyze the following list of skills from a resume.

Skills:

{skills}

Analyze for:
• Missing critical modern industry technologies and frameworks.
• Logical categorization (e.g. Languages, Frameworks, Cloud/DevOps, Databases).
• Removal of obsolete or redundant skills.

Return ONLY valid JSON matching this schema:
{{
  "suggested_additions": ["Docker", "Kubernetes"],
  "categorized": {{
    "Languages": ["Python", "JavaScript"],
    "Frameworks": ["Django", "React"]
  }},
  "feedback": "Strong foundational skill set."
}}
"""
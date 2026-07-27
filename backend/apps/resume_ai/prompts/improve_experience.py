"""
Prompt template for improving work experience entries.
"""

EXPERIENCE_PROMPT: str = """
Improve the following work experience entry to maximize ATS ranking and recruiter impact.

Experience:

{experience}

Requirements:
• Begin bullet points with strong action verbs.
• Quantify achievements with metrics, percentages, or scale where implied.
• Maintain strict factual alignment with the original experience.
• Optimize keyword density for ATS systems.

Return ONLY the improved work experience text without surrounding quotes or conversational text.
"""
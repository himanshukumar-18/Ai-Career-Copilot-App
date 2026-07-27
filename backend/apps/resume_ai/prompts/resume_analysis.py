"""
Prompt template for comprehensive resume analysis.
"""

RESUME_ANALYSIS_PROMPT: str = """
Analyse the following resume text and provide an ATS-level assessment.

Resume:

{resume}

Return ONLY valid JSON matching this exact structure without markdown formatting or trailing text:

{{
  "scores": {{
    "overall_score": 75,
    "ats_score": 80,
    "grammar_score": 85,
    "readability_score": 75,
    "impact_score": 70
  }},
  "strengths": [
    "Clear structure",
    "Relevant technical skills"
  ],
  "weaknesses": [
    "Missing quantified achievements in experience"
  ],
  "recommendations": [
    "Add metric-driven bullet points to work experience"
  ],
  "missing_keywords": [
    "Docker",
    "CI/CD"
  ],
  "missing_sections": [],
  "profile": {{
    "score": 85,
    "feedback": "Contact information is complete.",
    "strengths": ["Includes LinkedIn and GitHub"],
    "weaknesses": [],
    "missing_keywords": [],
    "suggestions": []
  }},
  "summary": {{
    "score": 70,
    "feedback": "Summary provides good context but can be punchier.",
    "strengths": ["Highlights core background"],
    "weaknesses": ["Lacks measurable impact"],
    "missing_keywords": [],
    "suggestions": [
      {{
        "title": "Quantify Achievements",
        "description": "Include years of experience and key domain impact.",
        "priority": "high"
      }}
    ],
    "improved_content": "Results-driven Software Engineer with 5+ years of experience..."
  }},
  "experience": {{
    "score": 70,
    "feedback": "Work history shows progressive responsibility.",
    "strengths": ["Clear job titles and timelines"],
    "weaknesses": ["Bullet points describe duties rather than achievements"],
    "missing_keywords": [],
    "suggestions": []
  }},
  "education": {{
    "score": 80,
    "feedback": "Education details are clearly stated.",
    "strengths": ["Degree and institution specified"],
    "weaknesses": [],
    "missing_keywords": [],
    "suggestions": []
  }},
  "projects": {{
    "score": 75,
    "feedback": "Projects demonstrate hands-on application.",
    "strengths": ["Includes tech stack"],
    "weaknesses": [],
    "missing_keywords": [],
    "suggestions": []
  }},
  "skills": {{
    "score": 85,
    "feedback": "Good variety of technical skills listed.",
    "strengths": ["Well categorized"],
    "weaknesses": [],
    "missing_keywords": [],
    "suggestions": []
  }},
  "certifications": {{
    "score": 60,
    "feedback": "No certifications listed.",
    "strengths": [],
    "weaknesses": ["Adding relevant cloud or framework certifications can boost ATS rank"],
    "missing_keywords": [],
    "suggestions": []
  }},
  "languages": {{
    "score": 80,
    "feedback": "Language proficiencies included.",
    "strengths": ["Spoken languages specified"],
    "weaknesses": [],
    "missing_keywords": [],
    "suggestions": []
  }},
  "final_feedback": "Overall solid resume that will perform well with ATS optimization."
}}
"""
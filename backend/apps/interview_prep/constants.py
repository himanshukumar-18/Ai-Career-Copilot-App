"""Constants and Choice Enums for the interview_prep app."""

from django.db import models


class InterviewCategory(models.TextChoices):
    TECHNICAL = "technical", "Technical"
    BEHAVIORAL = "behavioral", "Behavioral"
    HR = "hr", "HR & Culture"
    SYSTEM_DESIGN = "system_design", "System Design"
    CODING = "coding", "Coding & Algorithms"
    DOMAIN_KNOWLEDGE = "domain_knowledge", "Domain Knowledge"
    CASE_STUDY = "case_study", "Case Study"
    COMMUNICATION = "communication", "Communication"
    ROLE_SPECIFIC = "role_specific", "Role Specific"
    MANAGERIAL = "managerial", "Managerial"


class QuestionSourceType(models.TextChoices):
    CONCEPTUAL = "conceptual", "Conceptual"
    TECHNICAL = "technical", "Technical"
    RESUME_BASED = "resume_based", "Resume Based"
    PROJECT_BASED = "project_based", "Project Based"
    JD_SPECIFIC = "jd_specific", "Job Description Specific"
    BEHAVIORAL = "behavioral", "Behavioral"
    SCENARIO = "scenario", "Scenario Based"


class DifficultyLevel(models.TextChoices):
    BEGINNER = "beginner", "Beginner"
    INTERMEDIATE = "intermediate", "Intermediate"
    ADVANCED = "advanced", "Advanced"


class ProficiencyStatus(models.TextChoices):
    STRONG = "strong", "Strong"
    WEAK = "weak", "Weak"
    MISSING = "missing", "Missing"
    PRIORITY = "priority", "Priority Study Area"


class SessionStatus(models.TextChoices):
    IN_PROGRESS = "in_progress", "In Progress"
    COMPLETED = "completed", "Completed"
    ABANDONED = "abandoned", "Abandoned"


class ResourceType(models.TextChoices):
    DOCUMENTATION = "documentation", "Official Documentation"
    COURSE = "course", "Course"
    TUTORIAL = "tutorial", "Tutorial"
    ARTICLE = "article", "Article"
    VIDEO = "video", "Video"
    PRACTICE_PLATFORM = "practice_platform", "Practice Platform"
    BOOK = "book", "Book"


# LLM Retries & Timeouts
LLM_MAX_RETRIES = 2

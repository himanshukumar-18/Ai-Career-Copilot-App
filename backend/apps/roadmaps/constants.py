"""Constants and enumerations for the roadmaps app."""

from typing import Final


class RoadmapStatus:
    NOT_STARTED: Final = "not_started"
    IN_PROGRESS: Final = "in_progress"
    COMPLETED: Final = "completed"

    CHOICES: Final = (
        (NOT_STARTED, "Not Started"),
        (IN_PROGRESS, "In Progress"),
        (COMPLETED, "Completed"),
    )

    VALID_VALUES: Final = {NOT_STARTED, IN_PROGRESS, COMPLETED}


class StepStatus:
    NOT_STARTED: Final = "not_started"
    IN_PROGRESS: Final = "in_progress"
    COMPLETED: Final = "completed"
    SKIPPED: Final = "skipped"

    CHOICES: Final = (
        (NOT_STARTED, "Not Started"),
        (IN_PROGRESS, "In Progress"),
        (COMPLETED, "Completed"),
        (SKIPPED, "Skipped"),
    )

    VALID_VALUES: Final = {NOT_STARTED, IN_PROGRESS, COMPLETED, SKIPPED}


class DifficultyLevel:
    BEGINNER: Final = "beginner"
    INTERMEDIATE: Final = "intermediate"
    ADVANCED: Final = "advanced"

    CHOICES: Final = (
        (BEGINNER, "Beginner"),
        (INTERMEDIATE, "Intermediate"),
        (ADVANCED, "Advanced"),
    )

    VALID_VALUES: Final = {BEGINNER, INTERMEDIATE, ADVANCED}


class ResourceType:
    DOCUMENTATION: Final = "documentation"
    ARTICLE: Final = "article"
    VIDEO: Final = "video"
    COURSE: Final = "course"
    BOOK: Final = "book"
    PRACTICE: Final = "practice"

    CHOICES: Final = (
        (DOCUMENTATION, "Documentation"),
        (ARTICLE, "Article"),
        (VIDEO, "Video"),
        (COURSE, "Course"),
        (BOOK, "Book"),
        (PRACTICE, "Practice Platform"),
    )

    VALID_VALUES: Final = {
        DOCUMENTATION,
        ARTICLE,
        VIDEO,
        COURSE,
        BOOK,
        PRACTICE,
    }


LLM_MAX_RETRIES: Final = 2


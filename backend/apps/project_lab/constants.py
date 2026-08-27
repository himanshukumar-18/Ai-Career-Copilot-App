# Difficulty levels available for project generation
class Difficulty:
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

    CHOICES = (
        (EASY, "Easy"),
        (MEDIUM, "Medium"),
        (HARD, "Hard"),
    )

    VALID_VALUES = {EASY, MEDIUM, HARD}


# Status values for a user's saved/working project
class ProjectStatus:
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

    CHOICES = (
        (NOT_STARTED, "Not Started"),
        (IN_PROGRESS, "In Progress"),
        (COMPLETED, "Completed"),
    )

    VALID_VALUES = {NOT_STARTED, IN_PROGRESS, COMPLETED}


# Limits for how many projects a user can request per generation call
MIN_PROJECT_COUNT = 1
MAX_PROJECT_COUNT = 5
DEFAULT_PROJECT_COUNT = 3

# Limits for tech stack input validation
MIN_TECH_STACK_ITEMS = 1
MAX_TECH_STACK_ITEMS = 10

# LLM retry config (model, temperature, timeout, max_tokens live in Django settings)
LLM_MAX_RETRIES = 2

# Estimated hours bounds used to sanity-check AI output
MIN_ESTIMATED_HOURS = 1
MAX_ESTIMATED_HOURS = 200

# Cache key prefix for storing recent generations per user
GENERATION_CACHE_KEY_PREFIX = "project_lab:generation"
GENERATION_CACHE_TTL_SECONDS = 60 * 30
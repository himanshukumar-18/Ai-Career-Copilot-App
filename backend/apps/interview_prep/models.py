"""Database models for the interview_prep app."""

import uuid
from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.interview_prep.constants import (
    DifficultyLevel,
    InterviewCategory,
    ProficiencyStatus,
    QuestionSourceType,
    ResourceType,
    SessionStatus,
)


class InterviewPrepPlan(models.Model):
    """Master personalized interview preparation plan for a user."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="interview_prep_plans",
    )
    target_role = models.CharField(max_length=150)
    experience_level = models.CharField(
        max_length=50,
        choices=DifficultyLevel.choices,
        default=DifficultyLevel.INTERMEDIATE,
    )
    company_name = models.CharField(max_length=150, blank=True, default="")
    job_description = models.TextField(blank=True, default="")
    summary = models.TextField(blank=True, default="")
    overall_readiness_score = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Interview Prep Plan"
        verbose_name_plural = "Interview Prep Plans"

    def __str__(self) -> str:
        return f"Prep Plan: {self.target_role} ({self.user.email})"


class PrepTopic(models.Model):
    """Specific focus topic within an interview preparation plan."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    plan = models.ForeignKey(
        InterviewPrepPlan,
        on_delete=models.CASCADE,
        related_name="topics",
    )
    title = models.CharField(max_length=200)
    category = models.CharField(
        max_length=50,
        choices=InterviewCategory.choices,
        default=InterviewCategory.TECHNICAL,
    )
    difficulty = models.CharField(
        max_length=30,
        choices=DifficultyLevel.choices,
        default=DifficultyLevel.INTERMEDIATE,
    )
    priority = models.IntegerField(default=1)  # 1 = Highest Priority
    proficiency_status = models.CharField(
        max_length=30,
        choices=ProficiencyStatus.choices,
        default=ProficiencyStatus.WEAK,
    )
    what_to_study = models.JSONField(default=list, blank=True)
    what_to_practice = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["priority", "title"]

    def __str__(self) -> str:
        return f"{self.title} [{self.get_proficiency_status_display()}]"


class PrepResource(models.Model):
    """Learning and preparation resources linked to a topic."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    topic = models.ForeignKey(
        PrepTopic,
        on_delete=models.CASCADE,
        related_name="resources",
    )
    title = models.CharField(max_length=255)
    url = models.URLField(max_length=500, blank=True, default="")
    provider = models.CharField(max_length=150, blank=True, default="")
    resource_type = models.CharField(
        max_length=50,
        choices=ResourceType.choices,
        default=ResourceType.DOCUMENTATION,
    )
    is_free = models.BooleanField(default=True)
    difficulty = models.CharField(
        max_length=30,
        choices=DifficultyLevel.choices,
        default=DifficultyLevel.INTERMEDIATE,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["title"]

    def __str__(self) -> str:
        return f"{self.title} ({self.provider})"


class InterviewQuestion(models.Model):
    """Dynamic practice interview question generated for a plan/topic."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    plan = models.ForeignKey(
        InterviewPrepPlan,
        on_delete=models.CASCADE,
        related_name="questions",
    )
    topic = models.ForeignKey(
        PrepTopic,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="questions",
    )
    question_text = models.TextField()
    category = models.CharField(
        max_length=50,
        choices=InterviewCategory.choices,
        default=InterviewCategory.TECHNICAL,
    )
    difficulty = models.CharField(
        max_length=30,
        choices=DifficultyLevel.choices,
        default=DifficultyLevel.INTERMEDIATE,
    )
    source_type = models.CharField(
        max_length=50,
        choices=QuestionSourceType.choices,
        default=QuestionSourceType.TECHNICAL,
    )
    ideal_answer_outline = models.TextField(blank=True, default="")
    key_points = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["category", "difficulty", "created_at"]

    def __str__(self) -> str:
        return f"{self.question_text[:60]}... ({self.source_type})"


class QuestionAttempt(models.Model):
    """Student answer attempt and AI evaluation for a question."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question = models.ForeignKey(
        InterviewQuestion,
        on_delete=models.CASCADE,
        related_name="attempts",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="question_attempts",
    )
    user_answer = models.TextField()
    score = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )
    is_correct = models.BooleanField(default=False)
    strengths = models.JSONField(default=list, blank=True)
    weaknesses = models.JSONField(default=list, blank=True)
    missing_points = models.JSONField(default=list, blank=True)
    ideal_answer = models.TextField(blank=True, default="")
    improvement_tips = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Attempt by {self.user.email} | Score: {self.score}"


class MockInterviewSession(models.Model):
    """Interactive mock interview session."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="mock_sessions",
    )
    plan = models.ForeignKey(
        InterviewPrepPlan,
        on_delete=models.CASCADE,
        related_name="mock_sessions",
    )
    title = models.CharField(max_length=200, default="AI Mock Interview")
    category = models.CharField(
        max_length=50,
        choices=InterviewCategory.choices,
        default=InterviewCategory.TECHNICAL,
    )
    total_questions = models.IntegerField(default=5)
    current_question_index = models.IntegerField(default=0)
    status = models.CharField(
        max_length=30,
        choices=SessionStatus.choices,
        default=SessionStatus.IN_PROGRESS,
    )
    overall_score = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )
    feedback = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Mock Session ({self.category}) - {self.user.email} [{self.status}]"


class MockInterviewTurn(models.Model):
    """Individual question and response turn within a mock interview session."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(
        MockInterviewSession,
        on_delete=models.CASCADE,
        related_name="turns",
    )
    turn_index = models.IntegerField(default=0)
    question_text = models.TextField()
    category = models.CharField(
        max_length=50,
        choices=InterviewCategory.choices,
        default=InterviewCategory.TECHNICAL,
    )
    difficulty = models.CharField(
        max_length=30,
        choices=DifficultyLevel.choices,
        default=DifficultyLevel.INTERMEDIATE,
    )
    user_answer = models.TextField(blank=True, default="")
    score = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )
    evaluation = models.TextField(blank=True, default="")
    follow_up_hint = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["turn_index"]

    def __str__(self) -> str:
        return f"Turn #{self.turn_index} - Session {self.session.id}"


class InterviewReadiness(models.Model):
    """Readiness analytics snapshot for a student prep plan."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="readiness_snapshots",
    )
    plan = models.ForeignKey(
        InterviewPrepPlan,
        on_delete=models.CASCADE,
        related_name="readiness_snapshots",
    )
    technical_score = models.IntegerField(default=0)
    behavioral_score = models.IntegerField(default=0)
    project_score = models.IntegerField(default=0)
    overall_score = models.IntegerField(default=0)
    weak_areas = models.JSONField(default=list, blank=True)
    recommendation = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Readiness: {self.overall_score}% for {self.user.email}"

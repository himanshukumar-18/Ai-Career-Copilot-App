import uuid
from django.conf import settings
from django.db import models

from apps.roadmaps.constants import (
    DifficultyLevel,
    ResourceType,
    RoadmapStatus,
    StepStatus,
)


class CareerRole(models.Model):
    """Represents a target software engineering career path (e.g., Backend Developer)."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=150, unique=True, db_index=True)
    description = models.TextField()
    category = models.CharField(max_length=100, default="Software Engineering", db_index=True)
    difficulty = models.CharField(
        max_length=20,
        choices=DifficultyLevel.CHOICES,
        default=DifficultyLevel.INTERMEDIATE,
    )
    estimated_duration_weeks = models.PositiveIntegerField(default=16)
    icon_name = models.CharField(max_length=50, blank=True, default="code")
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["title"]
        verbose_name = "Career Role"
        verbose_name_plural = "Career Roles"

    def __str__(self) -> str:
        return self.title


class Roadmap(models.Model):
    """The master template roadmap for a specific CareerRole."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    career_role = models.OneToOneField(
        CareerRole,
        on_delete=models.CASCADE,
        related_name="roadmap",
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    version = models.CharField(max_length=20, default="1.0.0")
    total_phases = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["career_role__title"]
        verbose_name = "Roadmap Template"
        verbose_name_plural = "Roadmap Templates"

    def __str__(self) -> str:
        return f"Roadmap: {self.career_role.title} ({self.version})"


class RoadmapPhase(models.Model):
    """An ordered learning milestone phase inside a roadmap (e.g., Phase 1: Programming Fundamentals)."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    roadmap = models.ForeignKey(
        Roadmap,
        on_delete=models.CASCADE,
        related_name="phases",
    )
    order = models.PositiveIntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField()
    estimated_hours = models.PositiveIntegerField(default=20)
    learning_objective = models.TextField(blank=True, default="")
    prerequisites_summary = models.CharField(max_length=255, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order"]
        unique_together = [("roadmap", "order")]
        verbose_name = "Roadmap Phase"
        verbose_name_plural = "Roadmap Phases"

    def __str__(self) -> str:
        return f"{self.roadmap.career_role.title} - Phase {self.order}: {self.title}"


class RoadmapStep(models.Model):
    """A granular, actionable learning step within a phase."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phase = models.ForeignKey(
        RoadmapPhase,
        on_delete=models.CASCADE,
        related_name="steps",
    )
    order = models.PositiveIntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField()
    learning_objective = models.TextField()
    what_to_learn = models.JSONField(default=list, blank=True)
    what_to_practice = models.JSONField(default=list, blank=True)
    what_to_build = models.JSONField(default=list, blank=True)
    completion_criteria = models.TextField()
    estimated_hours = models.PositiveIntegerField(default=5)
    difficulty = models.CharField(
        max_length=20,
        choices=DifficultyLevel.CHOICES,
        default=DifficultyLevel.INTERMEDIATE,
    )
    prerequisite_step = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="dependent_steps",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order"]
        unique_together = [("phase", "order")]
        verbose_name = "Roadmap Step"
        verbose_name_plural = "Roadmap Steps"

    def __str__(self) -> str:
        return f"{self.phase.roadmap.career_role.title} - P{self.phase.order}S{self.order}: {self.title}"


class RoadmapResource(models.Model):
    """Curated learning materials linked to a specific RoadmapStep."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    step = models.ForeignKey(
        RoadmapStep,
        on_delete=models.CASCADE,
        related_name="resources",
    )
    title = models.CharField(max_length=200)
    url = models.URLField()
    resource_type = models.CharField(
        max_length=30,
        choices=ResourceType.CHOICES,
        default=ResourceType.DOCUMENTATION,
    )
    provider = models.CharField(max_length=100, blank=True, default="")
    is_free = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order"]
        verbose_name = "Roadmap Resource"
        verbose_name_plural = "Roadmap Resources"

    def __str__(self) -> str:
        return f"{self.title} ({self.resource_type})"


class UserRoadmapProgress(models.Model):
    """Tracks a student's active enrollment and overall progress in a Career Role roadmap."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="roadmap_progresses",
    )
    career_role = models.ForeignKey(
        CareerRole,
        on_delete=models.CASCADE,
        related_name="user_progresses",
    )
    roadmap = models.ForeignKey(
        Roadmap,
        on_delete=models.CASCADE,
        related_name="user_progresses",
    )
    status = models.CharField(
        max_length=20,
        choices=RoadmapStatus.CHOICES,
        default=RoadmapStatus.NOT_STARTED,
        db_index=True,
    )
    current_step = models.ForeignKey(
        RoadmapStep,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="current_for_users",
    )
    completion_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.00,
    )
    skill_gap_analysis = models.JSONField(default=dict, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    last_activity_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-last_activity_at"]
        unique_together = [("user", "career_role")]
        verbose_name = "User Roadmap Progress"
        verbose_name_plural = "User Roadmap Progresses"

    def __str__(self) -> str:
        return f"{self.user.email} - {self.career_role.title} ({self.completion_percentage}%)"


class UserStepProgress(models.Model):
    """Tracks completion status and student study notes for a specific RoadmapStep."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_progress = models.ForeignKey(
        UserRoadmapProgress,
        on_delete=models.CASCADE,
        related_name="step_progresses",
    )
    step = models.ForeignKey(
        RoadmapStep,
        on_delete=models.CASCADE,
        related_name="user_step_progresses",
    )
    status = models.CharField(
        max_length=20,
        choices=StepStatus.CHOICES,
        default=StepStatus.NOT_STARTED,
        db_index=True,
    )
    notes = models.TextField(blank=True, default="")
    completed_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["step__phase__order", "step__order"]
        unique_together = [("user_progress", "step")]
        verbose_name = "User Step Progress"
        verbose_name_plural = "User Step Progresses"

    def __str__(self) -> str:
        return f"{self.user_progress.user.email} - Step {self.step.title} [{self.status}]"

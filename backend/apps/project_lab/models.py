import uuid

from django.conf import settings
from django.db import models

from .constants import Difficulty, ProjectStatus


# Logs each AI generation request and its raw output, used for caching and history
class GeneratedProject(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # user who requested this generation
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="generated_projects",
    )

    # inputs the user requested
    tech_stack = models.JSONField(default=list)
    difficulty = models.CharField(max_length=20, choices=Difficulty.CHOICES)
    requested_count = models.PositiveSmallIntegerField()

    # AI output for this single project idea
    title = models.CharField(max_length=255)
    short_description = models.CharField(max_length=300)
    description = models.TextField()
    features = models.JSONField(default=list)
    learning_outcomes = models.JSONField(default=list)
    estimated_hours = models.PositiveIntegerField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "-created_at"]),
        ]

    def __str__(self):
        return f"{self.title} ({self.difficulty})"


# A project a user has picked from AI suggestions and is actively working on
class UserProject(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="project_lab_entries",
    )

    # link back to the AI generation this project came from, if any
    source_generation = models.ForeignKey(
        GeneratedProject,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="user_projects",
    )

    # snapshot fields so the user's project survives even if the source is deleted
    title = models.CharField(max_length=255)
    description = models.TextField()
    difficulty = models.CharField(max_length=20, choices=Difficulty.CHOICES)
    tech_stack = models.JSONField(default=list)
    estimated_hours = models.PositiveIntegerField()

    status = models.CharField(
        max_length=20,
        choices=ProjectStatus.CHOICES,
        default=ProjectStatus.NOT_STARTED,
        db_index=True,
    )

    repo_link = models.URLField(blank=True, null=True)
    notes = models.TextField(blank=True)

    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]
        indexes = [
            models.Index(fields=["user", "status"]),
        ]

    def __str__(self):
        return f"{self.user} - {self.title} ({self.status})"
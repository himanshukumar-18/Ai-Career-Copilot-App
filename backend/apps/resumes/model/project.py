from django.conf import settings
from django.db import models
from .resume import Resume

#project
class Project(models.Model):

    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="projects",
    )

    title = models.CharField(
        max_length=255,
    )

    role = models.CharField(
        max_length=255,
        blank=True,
    )

    description = models.TextField()

    technologies = models.CharField(
        max_length=500,
        help_text="Comma separated technologies",
    )

    github_url = models.URLField(
        blank=True,
    )

    live_demo_url = models.URLField(
        blank=True,
    )

    start_date = models.DateField(
        null=True,
        blank=True,
    )

    end_date = models.DateField(
        null=True,
        blank=True,
    )

    currently_working = models.BooleanField(
        default=False,
    )

    is_featured = models.BooleanField(
        default=False,
    )

    is_visible = models.BooleanField(
        default=True,
    )

    display_order = models.PositiveIntegerField(
        default=0,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:

        ordering = [
            "display_order",
            "-created_at",
        ]

    def __str__(self):

        return self.title
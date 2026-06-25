from django.conf import settings
from django.db import models
from .resume import Resume

#achievement
class Achievement(models.Model):

    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="achievements",
    )

    title = models.CharField(
        max_length=255,
    )

    organization = models.CharField(
        max_length=255,
        blank=True,
    )

    achievement_date = models.DateField(
        null=True,
        blank=True,
    )

    description = models.TextField(
        blank=True,
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
            "-achievement_date",
        ]

    def __str__(self):

        return self.title
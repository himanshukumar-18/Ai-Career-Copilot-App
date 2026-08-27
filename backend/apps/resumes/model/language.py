from django.conf import settings
from django.db import models
from .resume import Resume

#language
class Language(models.Model):

    PROFICIENCY_CHOICES = [
        ("beginner", "Beginner"),
        ("intermediate", "Intermediate"),
        ("professional", "Professional"),
        ("native", "Native"),
    ]

    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="languages",
    )

    name = models.CharField(
        max_length=100,
    )

    proficiency = models.CharField(
        max_length=20,
        choices=PROFICIENCY_CHOICES,
        default="professional",
    )

    is_visible = models.BooleanField(
        default=True,
    )

    display_order = models.PositiveIntegerField(
        default=0,
    )

    class Meta:

        ordering = [
            "display_order",
            "name",
        ]

    def __str__(self):

        return self.name
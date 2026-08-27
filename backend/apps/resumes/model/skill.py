from django.conf import settings
from django.db import models
from .resume import Resume

#skills
class Skill(models.Model):

    SKILL_LEVEL_CHOICES = [
        ("beginner", "Beginner"),
        ("intermediate", "Intermediate"),
        ("advanced", "Advanced"),
        ("expert", "Expert"),
    ]

    CATEGORY_CHOICES = [
        ("programming", "Programming"),
        ("frontend", "Frontend"),
        ("backend", "Backend"),
        ("database", "Database"),
        ("devops", "DevOps"),
        ("cloud", "Cloud"),
        ("ai_ml", "AI / Machine Learning"),
        ("soft_skill", "Soft Skill"),
        ("other", "Other"),
    ]

    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="skills",
    )

    name = models.CharField(
        max_length=100,
    )

    category = models.CharField(
        max_length=30,
        choices=CATEGORY_CHOICES,
        default="other",
    )

    level = models.CharField(
        max_length=20,
        choices=SKILL_LEVEL_CHOICES,
        default="intermediate",
    )

    years_of_experience = models.PositiveIntegerField(
        default=0,
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
            "name",
        ]

    def __str__(self):

        return self.name
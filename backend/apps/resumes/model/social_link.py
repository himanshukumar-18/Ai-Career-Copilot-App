from django.conf import settings
from django.db import models
from .resume import Resume

#social link
class SocialLink(models.Model):

    PLATFORM_CHOICES = [
        ("linkedin", "LinkedIn"),
        ("github", "GitHub"),
        ("portfolio", "Portfolio"),
        ("leetcode", "LeetCode"),
        ("hackerrank", "HackerRank"),
        ("codeforces", "Codeforces"),
        ("stackoverflow", "Stack Overflow"),
        ("medium", "Medium"),
        ("devto", "Dev.to"),
        ("behance", "Behance"),
        ("dribbble", "Dribbble"),
        ("kaggle", "Kaggle"),
        ("other", "Other"),
    ]

    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="social_links",
    )

    platform = models.CharField(
        max_length=30,
        choices=PLATFORM_CHOICES,
    )

    custom_platform = models.CharField(
        max_length=100,
        blank=True,
        help_text="Used only when platform='other'",
    )

    url = models.URLField()

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
            "platform",
        ]

    def __str__(self):

        return (
            self.custom_platform
            if self.platform == "other"
            else self.get_platform_display()
        )
from django.conf import settings
from django.db import models

#resume model
class Resume(models.Model):

    TEMPLATE_CHOICES = [
        ("classic", "Classic"),
        ("modern", "Modern"),
        ("minimal", "Minimal"),
        ("developer", "Developer"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="resumes",
    )

    title = models.CharField(
        max_length=200,
        default="My Resume",
    )

    template = models.CharField(
        max_length=20,
        choices=TEMPLATE_CHOICES,
        default="classic",
    )

    theme_color = models.CharField(
        max_length=20,
        default="#FFFFFF",
    )

    font_family = models.CharField(
        max_length=50,
        default="Poppins",
    )

    font_size = models.PositiveSmallIntegerField(
        default=14,
    )

    is_default = models.BooleanField(
        default=False,
    )

    is_public = models.BooleanField(
        default=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:

        ordering = [
            "-updated_at",
        ]

    def __str__(self):

        return f"{self.user.email} - {self.title}"
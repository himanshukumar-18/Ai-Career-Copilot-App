from django.conf import settings
from django.db import models
from .resume import Resume

#custom section
class CustomSection(models.Model):

    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="custom_sections",
    )

    title = models.CharField(
        max_length=255,
    )

    content = models.TextField()

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
            "title",
        ]

    def __str__(self):

        return self.title
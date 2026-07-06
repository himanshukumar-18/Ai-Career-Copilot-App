from django.db import models

from .resume import Resume


class ResumeSummary(models.Model):
    resume = models.OneToOneField(
        Resume,
        on_delete=models.CASCADE,
        related_name="summary",
    )

    content = models.TextField(
        blank=True,
        default="",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Resume Summary"
        verbose_name_plural = "Resume Summaries"

    def __str__(self):
        return f"Summary for {self.resume.title}"
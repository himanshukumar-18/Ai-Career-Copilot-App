from django.conf import settings
from django.db import models
from .resume import Resume

#reference
class Reference(models.Model):

    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="references",
    )

    full_name = models.CharField(
        max_length=255,
    )

    designation = models.CharField(
        max_length=255,
    )

    company = models.CharField(
        max_length=255,
    )

    email = models.EmailField()

    phone = models.CharField(
        max_length=20,
        blank=True,
    )

    relationship = models.CharField(
        max_length=100,
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
            "full_name",
        ]

    def __str__(self):

        return self.full_name
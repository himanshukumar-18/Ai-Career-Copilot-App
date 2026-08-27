from django.conf import settings
from django.db import models
from .resume import Resume

#certification
class Certification(models.Model):

    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="certifications",
    )

    name = models.CharField(
        max_length=255,
    )

    issuing_organization = models.CharField(
        max_length=255,
    )

    credential_id = models.CharField(
        max_length=255,
        blank=True,
    )

    credential_url = models.URLField(
        blank=True,
    )

    issue_date = models.DateField()

    expiry_date = models.DateField(
        null=True,
        blank=True,
    )

    does_not_expire = models.BooleanField(
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
            "-issue_date",
        ]

    def __str__(self):

        return self.name

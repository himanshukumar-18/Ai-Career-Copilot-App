from django.conf import settings
from django.db import models
from .resume import Resume

#experience
class Experience(models.Model):

    EMPLOYMENT_TYPE_CHOICES = [
        ("full_time", "Full Time"),
        ("part_time", "Part Time"),
        ("internship", "Internship"),
        ("contract", "Contract"),
        ("freelance", "Freelance"),
        ("self_employed", "Self Employed"),
    ]

    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="experiences",
    )

    company = models.CharField(
        max_length=255,
    )

    position = models.CharField(
        max_length=255,
    )

    employment_type = models.CharField(
        max_length=20,
        choices=EMPLOYMENT_TYPE_CHOICES,
        default="full_time",
    )

    location = models.CharField(
        max_length=255,
        blank=True,
    )

    start_date = models.DateField()

    end_date = models.DateField(
        null=True,
        blank=True,
    )

    currently_working = models.BooleanField(
        default=False,
    )

    description = models.TextField(
        blank=True,
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
            "-start_date",
        ]

    def __str__(self):

        return (
            f"{self.position} - "
            f"{self.company}"
        )
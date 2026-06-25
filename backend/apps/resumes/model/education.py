from django.conf import settings
from django.db import models
from .resume import Resume

#education
class Education(models.Model):

    EDUCATION_LEVEL_CHOICES = [
        ("high_school", "High School"),
        ("diploma", "Diploma"),
        ("bachelor", "Bachelor"),
        ("master", "Master"),
        ("phd", "PhD"),
        ("other", "Other"),
    ]

    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="educations",
    )

    institution = models.CharField(
        max_length=255,
    )

    education_level = models.CharField(
        max_length=20,
        choices=EDUCATION_LEVEL_CHOICES,
        default="bachelor",
    )

    degree = models.CharField(
        max_length=255,
    )

    field_of_study = models.CharField(
        max_length=255,
    )

    grade = models.CharField(
        max_length=50,
        blank=True,
    )

    start_date = models.DateField()

    end_date = models.DateField(
        null=True,
        blank=True,
    )

    currently_studying = models.BooleanField(
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
            f"{self.degree} - "
            f"{self.institution}"
        )
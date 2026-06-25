from django.conf import settings
from django.db import models
from .resume import Resume

class ResumeProfile(models.Model):

    resume = models.OneToOneField(
        Resume,
        on_delete=models.CASCADE,
        related_name="profile",
    )

    headline = models.CharField(
        max_length=255,
    )

    phone = models.CharField(
        max_length=20,
    )

    address = models.CharField(
        max_length=255,
    )

    city = models.CharField(
        max_length=100,
    )

    state = models.CharField(
        max_length=100,
        blank=True,
    )

    country = models.CharField(
        max_length=100,
    )

    website = models.URLField(
        blank=True,
    )

    linkedin = models.URLField(
        blank=True,
    )

    github = models.URLField(
        blank=True,
    )

    portfolio = models.URLField(
        blank=True,
    )

    summary = models.TextField()

    def __str__(self):

        return self.resume.title
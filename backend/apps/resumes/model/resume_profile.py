from django.conf import settings
from django.db import models
from .resume import Resume


class ResumeProfile(models.Model):

    resume = models.OneToOneField(
        Resume,
        on_delete=models.CASCADE,
        related_name="profile",
    )

    first_name = models.CharField(
        max_length=100,
        blank=True,
        default="",
    )

    last_name = models.CharField(
        max_length=100,
        blank=True,
        default="",
    )

    email = models.EmailField(
        blank=True,
        default="",
    )

    postal_code = models.CharField(
        max_length=20,
        blank=True,
        default="",
    )

    date_of_birth = models.DateField(
        blank=True,
        null=True,
    )

    profile_photo = models.ImageField(
        upload_to="resume/profile/",
        blank=True,
        null=True,
    )

    headline = models.CharField(
        max_length=255,
        blank=True,
        default="",
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
        default="",
    )

    address = models.CharField(
        max_length=255,
        blank=True,
        default="",
    )

    city = models.CharField(
        max_length=100,
        blank=True,
        default="",
    )

    state = models.CharField(
        max_length=100,
        blank=True,
        default="",
    )

    country = models.CharField(
        max_length=100,
        blank=True,
        default="",
    )

    def __str__(self):
        return self.resume.title
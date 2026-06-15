from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    username = None

    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        STUDENT = "STUDENT", "Student"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.STUDENT,
    )

    email = models.EmailField(
        unique=True
    )
    
    is_verified = models.BooleanField(
        default=False
    )

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = []
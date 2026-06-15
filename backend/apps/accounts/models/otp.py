from django.db import models

from apps.accounts.models import User


class OTPVerification(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="otp"
    )

    otp = models.CharField(
        max_length=6
    )

    is_verified = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    expires_at = models.DateTimeField()

    def __str__(self):
        return f"{self.user.email} - {self.otp}"
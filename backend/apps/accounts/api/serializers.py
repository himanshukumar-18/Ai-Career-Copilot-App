import logging
from datetime import timedelta

from django.db import transaction
from django.utils import timezone
from rest_framework import serializers
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer
)

from apps.accounts.models import User

from apps.accounts.models import (
    OTPVerification
)

from apps.accounts.services.otp_service import (
    generate_otp
)

from apps.accounts.services.email_service import (
    send_otp_email
)


logger = logging.getLogger(__name__)


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
    )

    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "email",
            "password",
            "confirm_password",
        )
        extra_kwargs = {
            "first_name": {
                "required": False,
                "allow_blank": True,
            },
            "last_name": {
                "required": False,
                "allow_blank": True,
            },
        }

    def to_internal_value(self, data):
        data = data.copy()

        # Accept the field names commonly sent by the frontend sign-up form.
        if data.get("firstName") and not data.get("first_name"):
            data["first_name"] = data["firstName"]

        if data.get("lastName") and not data.get("last_name"):
            data["last_name"] = data["lastName"]

        full_name = data.get("full_name") or data.get("fullName") or data.get("name")
        if full_name and not data.get("first_name"):
            name_parts = str(full_name).strip().split(" ", 1)
            data["first_name"] = name_parts[0]
            if len(name_parts) > 1 and not data.get("last_name"):
                data["last_name"] = name_parts[1]

        confirm_password = (
            data.get("password2")
            or data.get("confirmPassword")
            or data.get("password_confirmation")
        )
        if confirm_password and not data.get("confirm_password"):
            data["confirm_password"] = confirm_password

        return super().to_internal_value(data)

    def validate_email(self, value):
        email = value.strip().lower()

        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return email

    def validate(self, attrs):
        confirm_password = attrs.pop(
            "confirm_password",
            None
        )

        if (
            confirm_password
            and attrs["password"] != confirm_password
        ):
            raise serializers.ValidationError(
                {
                    "confirm_password": "Passwords do not match."
                }
            )

        return attrs

    def create(self, validated_data):

        password = validated_data.pop(
            "password"
        )

        with transaction.atomic():
            user = User(**validated_data)

            user.set_password(password)

            user.save()

            otp = generate_otp()

            OTPVerification.objects.create(
                user=user,
                otp=otp,
                expires_at=(
                    timezone.now()
                    + timedelta(minutes=10)
                )
            )

        try:
            send_otp_email(
                user.email,
                otp,
            )
        except Exception:
            # Keep registration successful even if SMTP is temporarily unavailable.
            logger.exception(
                "OTP email sending failed for %s",
                user.email,
            )

        return user


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            "id",
            "first_name",
            "last_name",
            "email",
            "role",
        )


class EmailTokenObtainPairSerializer(
    TokenObtainPairSerializer
):
    username_field = "email"

    def to_internal_value(self, data):
        data = data.copy()

        # Some clients post `username`; this API authenticates by email.
        if data.get("username") and not data.get("email"):
            data["email"] = data["username"]

        return super().to_internal_value(data)

    def validate(self, attrs):
        attrs["email"] = attrs["email"].strip().lower()
        data = super().validate(attrs)

        if not self.user.is_verified:
            raise serializers.ValidationError(
                {
                    "email": "Please verify your email first."
                }
            )

        return data

    @classmethod
    def get_token(
        cls,
        user
    ):
        return super().get_token(user)


class GoogleAuthSerializer(
    serializers.Serializer
):
    token = serializers.CharField()

class VerifyOTPSerializer(
    serializers.Serializer
):

    email = serializers.EmailField()

    otp = serializers.CharField(
        max_length=6
    )

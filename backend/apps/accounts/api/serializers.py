from rest_framework import serializers
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer
)
from datetime import timedelta
from django.utils import timezone
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


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "email",
            "password",
        )

    def create(self, validated_data):

        password = validated_data.pop(
            "password"
        )

        user = User(**validated_data)

        user.set_password(password)

        user.save()   # SAVE FIRST
        
        print("User Created:", user.email)

        otp = generate_otp()
        
        print("Generated OTP:", otp)

        OTPVerification.objects.create(
            user=user,
            otp=otp,
            expires_at=
                timezone.now()
                + timedelta(minutes=10)
        )
        
        print("==============")
        print("Sending OTP")
        print(user.email)
        print(otp)
        print("==============")

        try:
            send_otp_email(
            user.email,
            otp,
        )
            
            print("OTP Email Sent")

        except Exception:

            import logging

            logger = logging.getLogger(__name__)

            logger.exception(
            "OTP email sending failed (email=%s, otp=%s)",
            user.email,
            otp,
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
    
    @classmethod
    def get_token(
        cls,
        user
    ):

        if not user.is_verified:

            raise serializers.ValidationError(
            "Please verify your email first."
        )

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
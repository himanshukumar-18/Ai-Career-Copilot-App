from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)
from django.utils import timezone

from rest_framework_simplejwt.tokens import RefreshToken

from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from django_ratelimit.core import is_ratelimited
from rest_framework import status

from .serializers import (
    RegisterSerializer,
    UserSerializer,
    EmailTokenObtainPairSerializer,
    GoogleAuthSerializer,
    OTPVerification
)

from apps.accounts.services.google_auth import (
    verify_google_token
)

from apps.accounts.models import User

@method_decorator(
    ratelimit(
        key = "ip",
        rate = "3/m",
        method = "POST",
        block = False,
    ),
    name = "dispatch",
) 
class RegisterAPIView(
    generics.CreateAPIView
):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(
        self,
        request,
        *args,
        **kwargs
    ):

        if is_ratelimited(
            request,
            group="register",
            key="ip",
            rate="3/m",
            increment=True,
        ):

            return Response(
                {
                    "detail":
                    "Too many registration attempts. Please wait 1 minute."
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )

        return super().create(
            request,
            *args,
            **kwargs
        )
    

@method_decorator(
    ratelimit(
        key="ip",
        rate="5/m",
        method="POST",
        block=False,
    ),
    name="dispatch",
)
class LoginAPIView(
    TokenObtainPairView
):

    serializer_class = (
        EmailTokenObtainPairSerializer
    )

    def post(
        self,
        request,
        *args,
        **kwargs
    ):

        if is_ratelimited(
            request,
            group="login",
            key="ip",
            rate="5/m",
            increment=True,
        ):

            return Response(
                {
                    "detail":
                    "Too many login attempts. Please wait 1 minute."
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )

        return super().post(
            request,
            *args,
            **kwargs
        )


class MeAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        serializer = UserSerializer(
            request.user
        )

        return Response(
            serializer.data
        )

@method_decorator(
    ratelimit(
        key="ip",
        rate="10/m",
        method="POST",
        block=False,
    ),
    name="dispatch",
)
class GoogleLoginAPIView(APIView):

    permission_classes = []

    def post(self, request):

        if is_ratelimited(
            request,
            group="google_login",
            key="ip",
            rate="10/m",
            increment=True,
        ):

            return Response(
                {
                    "detail":
                    "Too many Google login attempts. Please wait 1 minute."
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        serializer = GoogleAuthSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        try:

            google_data = verify_google_token(
                serializer.validated_data[
                    "token"
                ]
            )

            email = google_data["email"]

            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "first_name":
                        google_data.get(
                            "given_name",
                            ""
                        ),

                    "last_name":
                        google_data.get(
                            "family_name",
                            ""
                        ),
                },
            )

            refresh = RefreshToken.for_user(
                user
            )

            return Response(
                {
                    "access":
                        str(
                            refresh.access_token
                        ),

                    "refresh":
                        str(refresh),
                }
            )

        except Exception:

            return Response(
                {
                    "detail":
                    "Invalid Google Token"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

@method_decorator(
    ratelimit(
        key="ip",
        rate="5/m",
        method="POST",
        block=False,
    ),
    name="dispatch",
)
class VerifyOTPAPIView(
    APIView
):

    permission_classes = []

    def post(
        self,
        request
    ):

        if is_ratelimited(
            request,
            group="verify_otp",
            key="ip",
            rate="5/m",
            increment=True,
        ):

            return Response(
                {
                    "detail":
                    "Too many OTP verification attempts. Please wait 1 minute."
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )

        email = request.data.get(
            "email"
        )

        otp = request.data.get(
            "otp"
        )

        try:

            verification = OTPVerification.objects.get(
                user__email=email,
                otp=otp,
                is_verified=False,
            )

            if (
                verification.expires_at
                < timezone.now()
            ):

                return Response(
                    {
                        "detail":
                        "OTP Expired"
                    },
                    status=400
                )

            verification.is_verified = True
            verification.save()

            verification.user.is_verified = True
            verification.user.save()

            return Response(
                {
                    "detail":
                    "Email Verified Successfully"
                }
            )

        except OTPVerification.DoesNotExist:

            return Response(
                {
                    "detail":
                    "Invalid OTP"
                },
                status=400
            )


def create(self, request, *args, **kwargs):

    if is_ratelimited(
        request,
        group="register",
        key="ip",
        rate="3/m",
        increment=True,
    ):
        return Response(
            {
                "detail":
                "Too many registration attempts. Please wait 1 minute."
            },
            status=status.HTTP_429_TOO_MANY_REQUESTS
        )

    return super().create(
        request,
        *args,
        **kwargs
    )
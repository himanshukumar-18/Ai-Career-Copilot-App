from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.utils import timezone
from django.core.cache import cache

from rest_framework_simplejwt.tokens import RefreshToken

from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from django_ratelimit.core import is_ratelimited

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
from config.responses import ApiResponse, ApiResponseMixin

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
    ApiResponseMixin,
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

            return ApiResponse.too_many_requests(
                request=request,
                message="Too many registration attempts. Please wait 1 minute.",
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

            return ApiResponse.too_many_requests(
                request=request,
                message="Too many login attempts. Please wait 1 minute.",
            )

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        return ApiResponse.success(
            request=request,
            data=serializer.validated_data,
            message="Login successful.",
        )


class RefreshTokenAPIView(
    TokenRefreshView
):

    def post(
        self,
        request,
        *args,
        **kwargs,
    ):

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        return ApiResponse.success(
            request=request,
            data=serializer.validated_data,
            message="Token refreshed successfully.",
        )


class MeAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        
        cache_key = (
            f"user_{request.user.id}"
        )
        
        cache_user = (
            cache.get(
                cache_key
            )
        )
        
        if cache_user:
            return ApiResponse.success(
                request=request,
                data=cache_user,
                message="User fetched successfully.",
            )

        serializer = UserSerializer(
            request.user
        )
        
        cache.set(
            cache_key,
            serializer.data,
            timeout=300,
        )

        return ApiResponse.success(
            request=request,
            data=serializer.data,
            message="User fetched successfully.",
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

            return ApiResponse.too_many_requests(
                request=request,
                message="Too many Google login attempts. Please wait 1 minute.",
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

            return ApiResponse.success(
                request=request,
                data={
                    "access": str(
                        refresh.access_token
                    ),
                    "refresh": str(refresh),
                },
                message="Google login successful.",
            )

        except Exception:

            return ApiResponse.validation_error(
                request=request,
                errors={
                    "detail": "Invalid Google Token",
                },
                message="Invalid Google Token",
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

            return ApiResponse.too_many_requests(
                request=request,
                message="Too many OTP verification attempts. Please wait 1 minute.",
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

                return ApiResponse.validation_error(
                    request=request,
                    errors={
                        "detail": "OTP Expired",
                    },
                    message="OTP Expired",
                )

            verification.is_verified = True
            verification.save()

            verification.user.is_verified = True
            verification.user.save()

            return ApiResponse.success(
                request=request,
                message="Email Verified Successfully",
            )

        except OTPVerification.DoesNotExist:

            return ApiResponse.validation_error(
                request=request,
                errors={
                    "detail": "Invalid OTP",
                },
                message="Invalid OTP",
            )


def create(self, request, *args, **kwargs):

    if is_ratelimited(
        request,
        group="register",
        key="ip",
        rate="3/m",
        increment=True,
    ):
        return ApiResponse.too_many_requests(
            request=request,
            message="Too many registration attempts. Please wait 1 minute.",
        )

    return super().create(
        request,
        *args,
        **kwargs
    )

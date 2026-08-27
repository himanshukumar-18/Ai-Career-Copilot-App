from django.urls import path
from .views import (
    RegisterAPIView,
    LoginAPIView,
    RefreshTokenAPIView,
    MeAPIView,
    GoogleLoginAPIView,
    VerifyOTPAPIView
)

urlpatterns = [
    path(
        "register/",
        RegisterAPIView.as_view(),
        name="register",
    ),

    path(
        "login/",
        LoginAPIView.as_view(),
        name="login",
    ),
    
     path(
        "token/refresh/",
        RefreshTokenAPIView.as_view(),
        name="token_refresh",
    ),

    path(
        "me/",
        MeAPIView.as_view(),
        name="me",
    ),
    path(
        "google/",
        GoogleLoginAPIView.as_view(),
        name="google-login"
    ),
    path(
    "verify-otp/",
    VerifyOTPAPIView.as_view(),
    name="verify-otp"
    ),
]

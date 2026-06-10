from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from django.urls import path

urlpatterns = [
    path(
        "api/v1/auth/login/",
        TokenObtainPairView.as_view(),
    ),
    path(
        "api/v1/auth/refresh/",
        TokenRefreshView.as_view(),
    ),
]
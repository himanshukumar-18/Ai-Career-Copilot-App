from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path(
        "admin/",
        admin.site.urls
    ),
    path(
        "api/v1/auth/",
        include(
            "apps.accounts.api.urls"
        )
    ),
    path(
        "api/v1/profile/",
        include(
            "apps.profiles.api.urls"
        )
    )
]
from django.contrib import admin
from django.urls import path, include
from pathlib import Path
from django.conf import settings
from django.conf.urls.static import static

BASE_DIR = Path(__file__).resolve().parent.parent

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

from drf_spectacular.views import (

    SpectacularAPIView,

    SpectacularSwaggerView,

    SpectacularRedocView,

)

from django.http import JsonResponse

def health_check_view(request):
    return JsonResponse({"status": "healthy", "service": "AI Career Copilot API"})

urlpatterns = [
    path("health/", health_check_view, name="health_check"),
    path("api/v1/health/", health_check_view, name="api_health_check"),
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
    ),
    path(
        "api/v1/",
        include("apps.resumes.urls"),
    ),
    
    # OpenAPI Schema
    path(
        "api/schema/",
        SpectacularAPIView.as_view(),
        name="schema",
    ),

    # Swagger UI
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(
            url_name="schema",
        ),
        name="swagger-ui",
    ),

    # ReDoc
    path(
        "api/redoc/",
        SpectacularRedocView.as_view(
            url_name="schema",
        ),
        name="redoc",
    ),
    
    #resume-ai
    path(
        "api/v1/",
        include(
            "apps.resume_ai.urls"
        )
    ),
    path("api/v1/project-lab/", include("apps.project_lab.urls")),
    path("api/v1/roadmaps/", include("apps.roadmaps.urls")),
    path("api/v1/interview-prep/", include("apps.interview_prep.urls")),
    path("api/v1/admin/", include("apps.admin_panel.urls")),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )
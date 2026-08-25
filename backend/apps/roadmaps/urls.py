"""URL routing for the roadmaps app."""

from django.urls import path
from rest_framework.routers import DefaultRouter

from apps.roadmaps.views import (
    CareerRoleViewSet,
    CompleteStepView,
    EnrollRoadmapView,
    FullRoadmapDetailView,
    GenerateAIRoadmapView,
    MyEnrolledRoadmapsView,
    NextStepView,
    UserRoadmapProgressView,
)

router = DefaultRouter()
router.register(r"roles", CareerRoleViewSet, basename="career-roles")

urlpatterns = [
    # AI Personalized Roadmap Generation
    path(
        "generate/",
        GenerateAIRoadmapView.as_view(),
        name="roadmap-ai-generate",
    ),
    # Role-specific roadmap detail
    path(
        "roles/<slug:slug>/full/",
        FullRoadmapDetailView.as_view(),
        name="roadmap-full-detail",
    ),
    # Student roadmap enrollment & progress tracking
    path(
        "roles/<slug:slug>/enroll/",
        EnrollRoadmapView.as_view(),
        name="roadmap-enroll",
    ),
    path(
        "roles/<slug:slug>/my-progress/",
        UserRoadmapProgressView.as_view(),
        name="roadmap-user-progress",
    ),
    path(
        "roles/<slug:slug>/next-step/",
        NextStepView.as_view(),
        name="roadmap-next-step",
    ),
    # Step completion
    path(
        "steps/<uuid:step_id>/complete/",
        CompleteStepView.as_view(),
        name="roadmap-complete-step",
    ),
    # List all enrolled roadmaps for user
    path(
        "my-progress/",
        MyEnrolledRoadmapsView.as_view(),
        name="roadmap-my-enrolled-list",
    ),
] + router.urls

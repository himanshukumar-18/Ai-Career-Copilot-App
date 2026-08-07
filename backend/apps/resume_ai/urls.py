"""
URL configuration for the Resume AI module.
"""

from django.urls import path

from apps.resume_ai.views import ResumeAnalysisAPIView, ResumeImproveAPIView

app_name = "resume_ai"

urlpatterns = [
    path(
        "resume-ai/analyze/",
        ResumeAnalysisAPIView.as_view(),
        name="resume-ai-analysis",
    ),
    path(
        "resume-ai/improve/",
        ResumeImproveAPIView.as_view(),
        name="resume-ai-improve",
    ),
]

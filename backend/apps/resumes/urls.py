from django.urls import path
from rest_framework.routers import DefaultRouter

from apps.resumes.views import (
    AchievementViewSet,
    CertificationViewSet,
    CustomSectionViewSet,
    EducationViewSet,
    ExperienceViewSet,
    LanguageViewSet,
    ProjectViewSet,
    ReferenceViewSet,
    ResumeSummaryView,
    ResumeViewSet,
    SkillViewSet,
    SocialLinkViewSet,
)

from .views.profile import ResumeProfileViewSet

router = DefaultRouter()

router.register(r"resumes", ResumeViewSet, basename="resume")
router.register(r"educations", EducationViewSet, basename="education")
router.register(r"experiences", ExperienceViewSet, basename="experience")
router.register(r"skills", SkillViewSet, basename="skill")
router.register(r"projects", ProjectViewSet, basename="project")
router.register(r"certifications", CertificationViewSet, basename="certification")
router.register(r"languages", LanguageViewSet, basename="language")
router.register(r"achievements", AchievementViewSet, basename="achievement")
router.register(r"references", ReferenceViewSet, basename="reference")
router.register(r"social-links", SocialLinkViewSet, basename="social-link")
router.register(r"custom-sections", CustomSectionViewSet, basename="custom-section")

urlpatterns = router.urls + [
    # One profile belongs to one resume.
    path(
        "resumes/<int:resume_id>/profile/",
        ResumeProfileViewSet.as_view(),
        name="resume-profile",
    ),

    # One summary belongs to one resume.
    path(
        "resumes/<int:resume_id>/summary/",
        ResumeSummaryView.as_view(),
        name="resume-summary",
    ),
]
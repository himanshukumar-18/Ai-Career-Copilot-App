from rest_framework.routers import DefaultRouter

from apps.resumes.views import (
    ResumeViewSet,
    EducationViewSet,
    ExperienceViewSet,
    SkillViewSet,
    ProjectViewSet,
    CertificationViewSet,
    LanguageViewSet,
    AchievementViewSet,
    ReferenceViewSet,
    SocialLinkViewSet,
    CustomSectionViewSet,
)

router = DefaultRouter()

# Resume
router.register(
    r"resumes",
    ResumeViewSet,
    basename="resume",
)

# Education
router.register(
    r"educations",
    EducationViewSet,
    basename="education",
)

# Experience
router.register(
    r"experiences",
    ExperienceViewSet,
    basename="experience",
)

# Skills
router.register(
    r"skills",
    SkillViewSet,
    basename="skill",
)

# Projects
router.register(
    r"projects",
    ProjectViewSet,
    basename="project",
)

# Certifications
router.register(
    r"certifications",
    CertificationViewSet,
    basename="certification",
)

# Languages
router.register(
    r"languages",
    LanguageViewSet,
    basename="language",
)

# Achievements
router.register(
    r"achievements",
    AchievementViewSet,
    basename="achievement",
)

# References
router.register(
    r"references",
    ReferenceViewSet,
    basename="reference",
)

# Social Links
router.register(
    r"social-links",
    SocialLinkViewSet,
    basename="social-link",
)

# Custom Sections
router.register(
    r"custom-sections",
    CustomSectionViewSet,
    basename="custom-section",
)

urlpatterns = router.urls
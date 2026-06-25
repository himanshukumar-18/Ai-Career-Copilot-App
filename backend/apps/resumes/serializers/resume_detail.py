from rest_framework import serializers

from apps.resumes.model.resume import Resume

from .profile import ResumeProfileSerializer
from .education import EducationSerializer
from .experience import ExperienceSerializer
from .skill import SkillSerializer
from .project import ProjectSerializer
from .certification import CertificationSerializer
from .language import LanguageSerializer
from .achievement import AchievementSerializer
from .reference import ReferenceSerializer
from .social_link import SocialLinkSerializer
from .custom_section import CustomSectionSerializer


class ResumeDetailSerializer(
    serializers.ModelSerializer
):

    profile = ResumeProfileSerializer(
        read_only=True,
    )

    educations = EducationSerializer(
        many=True,
        read_only=True,
    )

    experiences = ExperienceSerializer(
        many=True,
        read_only=True,
    )

    skills = SkillSerializer(
        many=True,
        read_only=True,
    )

    projects = ProjectSerializer(
        many=True,
        read_only=True,
    )

    certifications = CertificationSerializer(
        many=True,
        read_only=True,
    )

    languages = LanguageSerializer(
        many=True,
        read_only=True,
    )

    achievements = AchievementSerializer(
        many=True,
        read_only=True,
    )

    references = ReferenceSerializer(
        many=True,
        read_only=True,
    )

    social_links = SocialLinkSerializer(
        many=True,
        read_only=True,
    )

    custom_sections = CustomSectionSerializer(
        many=True,
        read_only=True,
    )

    class Meta:

        model = Resume

        fields = [

            "id",

            "user",

            "title",

            "template",

            "theme_color",

            "font_family",

            "font_size",

            "is_default",

            "is_public",

            "created_at",

            "updated_at",

            "profile",

            "educations",

            "experiences",

            "skills",

            "projects",

            "certifications",

            "languages",

            "achievements",

            "references",

            "social_links",

            "custom_sections",

        ]

        read_only_fields = fields
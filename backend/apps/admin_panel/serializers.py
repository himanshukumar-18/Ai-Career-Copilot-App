from rest_framework import serializers
from apps.accounts.models.user import User
from apps.profiles.model.profile import Profile
from apps.resumes.model.resume import Resume
from apps.roadmaps.models import CareerRole, RoadmapResource
from apps.interview_prep.models import PrepResource


class AdminStudentListSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    resumes_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "role",
            "is_verified",
            "is_active",
            "date_joined",
            "resumes_count",
        ]

    def get_full_name(self, obj):
        return f"{obj.first_name or ''} {obj.last_name or ''}".strip() or "Student"

    def get_resumes_count(self, obj):
        return getattr(obj, "resumes_count", obj.resumes.count() if hasattr(obj, "resumes") else 0)


class AdminStudentDetailSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    profile = serializers.SerializerMethodField()
    stats = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "role",
            "is_verified",
            "is_active",
            "date_joined",
            "profile",
            "stats",
        ]

    def get_full_name(self, obj):
        return f"{obj.first_name or ''} {obj.last_name or ''}".strip() or "Student"

    def get_profile(self, obj):
        try:
            profile = obj.profile
            return {
                "headline": profile.headline or "",
                "bio": profile.bio or "",
                "phone": profile.phone or "",
                "location": profile.location or "",
                "career_goal": profile.career_goal or "",
                "profile_picture": profile.profile_picture.url if profile.profile_picture else None,
                "github_url": profile.github_url or "",
                "linkedin_url": profile.linkedin_url or "",
                "portfolio_url": profile.portfolio_url or "",
            }
        except Exception:
            return None

    def get_stats(self, obj):
        resumes_count = obj.resumes.count() if hasattr(obj, "resumes") else 0
        roadmaps_count = obj.roadmap_progress.count() if hasattr(obj, "roadmap_progress") else 0
        projects_count = obj.user_projects.count() if hasattr(obj, "user_projects") else 0
        interviews_count = obj.interview_plans.count() if hasattr(obj, "interview_plans") else 0

        return {
            "resumes_count": resumes_count,
            "roadmaps_count": roadmaps_count,
            "projects_count": projects_count,
            "interviews_count": interviews_count,
        }


class AdminCareerRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerRole
        fields = [
            "id",
            "title",
            "slug",
            "category",
            "description",
            "difficulty",
            "estimated_duration_weeks",
            "icon_name",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class AdminRoadmapResourceSerializer(serializers.ModelSerializer):
    step_title = serializers.SerializerMethodField()
    role_title = serializers.SerializerMethodField()

    class Meta:
        model = RoadmapResource
        fields = [
            "id",
            "title",
            "url",
            "resource_type",
            "provider",
            "description",
            "step",
            "step_title",
            "role_title",
        ]

    def get_step_title(self, obj):
        return obj.step.title if obj.step else ""

    def get_role_title(self, obj):
        return obj.step.phase.roadmap.career_role.title if (obj.step and obj.step.phase and obj.step.phase.roadmap) else ""


class AdminPrepResourceSerializer(serializers.ModelSerializer):
    topic_title = serializers.SerializerMethodField()

    class Meta:
        model = PrepResource
        fields = [
            "id",
            "title",
            "url",
            "resource_type",
            "provider",
            "description",
            "topic",
            "topic_title",
        ]

    def get_topic_title(self, obj):
        return obj.topic.title if obj.topic else ""


class AdminResumeListSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    student_email = serializers.SerializerMethodField()

    class Meta:
        model = Resume
        fields = [
            "id",
            "title",
            "template",
            "is_default",
            "is_public",
            "completion_percentage",
            "created_at",
            "updated_at",
            "student_name",
            "student_email",
        ]

    def get_student_name(self, obj):
        user = obj.user
        return f"{user.first_name or ''} {user.last_name or ''}".strip() if user else "Unknown"

    def get_student_email(self, obj):
        return obj.user.email if obj.user else ""

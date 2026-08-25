from rest_framework import serializers

from apps.roadmaps.models import (
    CareerRole,
    Roadmap,
    RoadmapPhase,
    RoadmapResource,
    RoadmapStep,
    UserRoadmapProgress,
    UserStepProgress,
)


class CareerRoleSerializer(serializers.ModelSerializer):
    """Serializer for CareerRole list and detail."""

    class Meta:
        model = CareerRole
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "category",
            "difficulty",
            "estimated_duration_weeks",
            "icon_name",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class RoadmapResourceSerializer(serializers.ModelSerializer):
    """Serializer for learning resources attached to a step."""

    class Meta:
        model = RoadmapResource
        fields = [
            "id",
            "title",
            "url",
            "resource_type",
            "provider",
            "is_free",
            "order",
        ]
        read_only_fields = ["id"]


class RoadmapStepSerializer(serializers.ModelSerializer):
    """Serializer for a single roadmap step."""

    resources = RoadmapResourceSerializer(many=True, read_only=True)
    prerequisite_step_id = serializers.UUIDField(source="prerequisite_step.id", read_only=True)

    class Meta:
        model = RoadmapStep
        fields = [
            "id",
            "order",
            "title",
            "description",
            "learning_objective",
            "what_to_learn",
            "what_to_practice",
            "what_to_build",
            "completion_criteria",
            "estimated_hours",
            "difficulty",
            "prerequisite_step_id",
            "resources",
        ]
        read_only_fields = ["id"]


class RoadmapPhaseSerializer(serializers.ModelSerializer):
    """Serializer for a roadmap phase with nested steps."""

    steps = RoadmapStepSerializer(many=True, read_only=True)

    class Meta:
        model = RoadmapPhase
        fields = [
            "id",
            "order",
            "title",
            "description",
            "estimated_hours",
            "learning_objective",
            "prerequisites_summary",
            "steps",
        ]
        read_only_fields = ["id"]


class RoadmapSerializer(serializers.ModelSerializer):
    """Basic roadmap summary serializer."""

    career_role = CareerRoleSerializer(read_only=True)

    class Meta:
        model = Roadmap
        fields = [
            "id",
            "career_role",
            "title",
            "description",
            "version",
            "total_phases",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class RoadmapDetailSerializer(serializers.ModelSerializer):
    """Full nested roadmap tree serializer with phases and steps."""

    career_role = CareerRoleSerializer(read_only=True)
    phases = RoadmapPhaseSerializer(many=True, read_only=True)

    class Meta:
        model = Roadmap
        fields = [
            "id",
            "career_role",
            "title",
            "description",
            "version",
            "total_phases",
            "is_published",
            "phases",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class UserStepProgressSerializer(serializers.ModelSerializer):
    """Serializer for student step completion progress."""

    step = RoadmapStepSerializer(read_only=True)

    class Meta:
        model = UserStepProgress
        fields = [
            "id",
            "step",
            "status",
            "notes",
            "completed_at",
            "updated_at",
        ]
        read_only_fields = ["id", "completed_at", "updated_at"]


class UserRoadmapProgressSerializer(serializers.ModelSerializer):
    """Summary of student's progress in a roadmap."""

    career_role = CareerRoleSerializer(read_only=True)

    class Meta:
        model = UserRoadmapProgress
        fields = [
            "id",
            "career_role",
            "status",
            "completion_percentage",
            "skill_gap_analysis",
            "current_step_id",
            "started_at",
            "completed_at",
            "last_activity_at",
            "created_at",
        ]
        read_only_fields = ["id", "started_at", "completed_at", "last_activity_at", "created_at"]


class UserRoadmapProgressDetailSerializer(serializers.ModelSerializer):
    """Detailed progress including step-by-step statuses for all steps in the roadmap."""

    career_role = CareerRoleSerializer(read_only=True)
    roadmap = RoadmapDetailSerializer(read_only=True)
    step_progresses = UserStepProgressSerializer(many=True, read_only=True)

    class Meta:
        model = UserRoadmapProgress
        fields = [
            "id",
            "career_role",
            "roadmap",
            "status",
            "completion_percentage",
            "skill_gap_analysis",
            "current_step_id",
            "started_at",
            "completed_at",
            "last_activity_at",
            "step_progresses",
        ]
        read_only_fields = ["id"]


class StepCompletionRequestSerializer(serializers.Serializer):
    """Request payload for marking a step complete."""

    notes = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=5000,
        help_text="Optional study notes, key learnings, or repository links.",
    )


class GenerateAIRoadmapRequestSerializer(serializers.Serializer):
    """Request payload for triggering AI personalized roadmap generation."""

    career_role_input = serializers.CharField(
        required=False,
        max_length=150,
        help_text="Target career role title or slug (e.g., 'Golang Backend Developer', 'backend-developer').",
    )
    career_role_slug = serializers.CharField(
        required=False,
        max_length=150,
        help_text="Backwards compatible slug field.",
    )
    force_regenerate = serializers.BooleanField(
        default=False,
        required=False,
        help_text="Force fresh LLM generation even if already enrolled.",
    )

    def validate(self, attrs):
        role_input = attrs.get("career_role_input") or attrs.get("career_role_slug")
        if not role_input or not str(role_input).strip():
            raise serializers.ValidationError(
                {"career_role_input": "Career role title or slug is required."}
            )
        attrs["career_role_input"] = str(role_input).strip()
        return attrs


class NextStepResponseSerializer(serializers.Serializer):
    """Response DTO for next recommended step engine."""

    career_role = CareerRoleSerializer(read_only=True)
    current_step = RoadmapStepSerializer(read_only=True, allow_null=True)
    next_step = RoadmapStepSerializer(read_only=True, allow_null=True)
    current_phase_title = serializers.CharField(read_only=True)
    completion_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)
    completed_steps_count = serializers.IntegerField()
    total_steps_count = serializers.IntegerField()
    remaining_steps_count = serializers.IntegerField()

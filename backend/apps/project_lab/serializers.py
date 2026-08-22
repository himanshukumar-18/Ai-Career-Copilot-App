"""Serializers for the project_lab app."""

from rest_framework import serializers

from apps.project_lab.constants import (
    Difficulty,
    MAX_PROJECT_COUNT,
    MAX_TECH_STACK_ITEMS,
    MIN_PROJECT_COUNT,
    MIN_TECH_STACK_ITEMS,
    ProjectStatus,
)
from apps.project_lab.models import GeneratedProject, UserProject
from apps.project_lab.services.user_project_service import update_status


# incoming request to generate AI project suggestions
class ProjectGenerationRequestSerializer(serializers.Serializer):
    tech_stack = serializers.ListField(
        child=serializers.CharField(max_length=50),
        min_length=MIN_TECH_STACK_ITEMS,
        max_length=MAX_TECH_STACK_ITEMS,
    )

    difficulty = serializers.ChoiceField(choices=Difficulty.CHOICES)

    count = serializers.IntegerField(
        min_value=MIN_PROJECT_COUNT,
        max_value=MAX_PROJECT_COUNT,
    )

    # strip blank/whitespace-only entries so validation reflects real content
    def validate_tech_stack(self, value):
        cleaned = [item.strip() for item in value if item and item.strip()]

        if not cleaned:
            raise serializers.ValidationError("tech_stack must contain at least one valid item.")

        return cleaned


# a single AI-generated project idea, returned before the user saves it
class GeneratedProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedProject
        fields = [
            "id",
            "title",
            "short_description",
            "description",
            "difficulty",
            "tech_stack",
            "estimated_hours",
            "features",
            "learning_outcomes",
            "created_at",
        ]
        read_only_fields = fields


# request body for saving a chosen generated project into the user's list
class SaveGeneratedProjectSerializer(serializers.Serializer):
    generated_project_id = serializers.UUIDField()


# request body for updating a saved project's status
class UpdateProjectStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=ProjectStatus.CHOICES)
    repo_link = serializers.URLField(required=False, allow_null=True, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)


# a project the user has picked and is tracking progress on
class UserProjectSerializer(serializers.ModelSerializer):
    source_generation_id = serializers.SerializerMethodField()

    class Meta:
        model = UserProject
        fields = [
            "id",
            "source_generation_id",
            "title",
            "description",
            "difficulty",
            "tech_stack",
            "estimated_hours",
            "status",
            "repo_link",
            "notes",
            "started_at",
            "completed_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "source_generation_id",
            "title",
            "description",
            "difficulty",
            "tech_stack",
            "estimated_hours",
            "started_at",
            "completed_at",
            "created_at",
            "updated_at",
        ]

    # returns None if the source generation was deleted rather than raising
    def get_source_generation_id(self, obj):
        return obj.source_generation_id

    def update(self, instance, validated_data):
        user = self.context["request"].user
        new_status = validated_data.get("status", instance.status)
        repo_link = validated_data.get("repo_link", instance.repo_link)
        notes = validated_data.get("notes", instance.notes)

        return update_status(
            user=user,
            user_project_id=instance.id,
            new_status=new_status,
            repo_link=repo_link,
            notes=notes,
        )
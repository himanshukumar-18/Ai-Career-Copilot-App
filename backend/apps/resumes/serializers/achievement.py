from rest_framework import serializers

from apps.resumes.model.achievement import Achievement


class AchievementSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Achievement

        fields = "__all__"

        read_only_fields = (
            "id",
            "resume",
            "created_at",
            "updated_at",
        )

    def validate_title(
        self,
        value,
    ):

        value = value.strip()

        if len(value) < 2:

            raise serializers.ValidationError(
                "Achievement title is required."
            )

        return value

    def validate_description(
        self,
        value,
    ):

        return value.strip()
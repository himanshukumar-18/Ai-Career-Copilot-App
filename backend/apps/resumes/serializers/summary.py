from rest_framework import serializers

from apps.resumes.model.summary import ResumeSummary


class ResumeSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeSummary
        fields = [
            "id",
            "content",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def validate_content(self, value):
        value = value.strip()

        if len(value) > 2000:
            raise serializers.ValidationError(
                "Summary must be 2000 characters or fewer."
            )

        return value
from rest_framework import serializers

from apps.resumes.model.resume import Resume


class ResumeListSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Resume

        fields = [
            "id",
            "title",
            "template",
            "theme_color",
            "is_default",
            "is_public",
            "updated_at",
        ]

        read_only_fields = fields
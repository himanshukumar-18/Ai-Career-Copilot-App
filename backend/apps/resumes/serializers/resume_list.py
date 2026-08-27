from rest_framework import serializers

from apps.resumes.model.resume import Resume
from apps.resumes.services import ResumeService


class ResumeListSerializer(
    serializers.ModelSerializer
):

    completion_percentage = serializers.SerializerMethodField()

    def get_completion_percentage(self, resume):
        return ResumeService.calculate_completion(resume)

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
            "completion_percentage",
        ]

        read_only_fields = fields

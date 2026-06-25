from rest_framework import serializers

from apps.resumes.model.custom_section import CustomSection


class CustomSectionSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = CustomSection

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
                "Section title is required."
            )

        return value

    def validate_content(
        self,
        value,
    ):

        value = value.strip()

        if len(value) < 10:

            raise serializers.ValidationError(
                "Content should contain at least 10 characters."
            )

        return value
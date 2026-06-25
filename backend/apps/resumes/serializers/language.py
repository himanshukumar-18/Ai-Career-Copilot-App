from rest_framework import serializers

from apps.resumes.model.language import Language


class LanguageSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Language

        fields = "__all__"

        read_only_fields = (
            "id",
            "resume",
        )

    def validate_name(
        self,
        value,
    ):

        value = value.strip()

        if len(value) < 2:

            raise serializers.ValidationError(
                "Language is required."
            )

        return value
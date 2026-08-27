from rest_framework import serializers

from apps.resumes.model.skill import Skill


class SkillSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Skill

        fields = "__all__"

        read_only_fields = (
            "id",
            "resume",
            "created_at",
            "updated_at",
        )

    def validate_name(
        self,
        value,
    ):

        value = value.strip()

        if len(value) < 2:

            raise serializers.ValidationError(
                "Skill name is required."
            )

        return value

    def validate_years_of_experience(
        self,
        value,
    ):

        if value < 0:

            raise serializers.ValidationError(
                "Years of experience cannot be negative."
            )

        if value > 50:

            raise serializers.ValidationError(
                "Years of experience is not valid."
            )

        return value

    def validate(
        self,
        attrs,
    ):

        attrs["name"] = attrs["name"].strip()

        return attrs
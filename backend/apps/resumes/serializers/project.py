from rest_framework import serializers

from apps.resumes.model.project import Project


class ProjectSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Project

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

        if len(value) < 3:

            raise serializers.ValidationError(
                "Project title is required."
            )

        return value

    def validate_role(
        self,
        value,
    ):

        return value.strip()

    def validate_description(
        self,
        value,
    ):

        value = value.strip()

        if len(value) < 20:

            raise serializers.ValidationError(
                "Project description should contain at least 20 characters."
            )

        return value

    def validate_technologies(
        self,
        value,
    ):

        value = value.strip()

        if not value:

            raise serializers.ValidationError(
                "Please provide technologies used."
            )

        return value

    def validate(
        self,
        attrs,
    ):

        start = attrs.get(
            "start_date"
        )

        end = attrs.get(
            "end_date"
        )

        current = attrs.get(
            "currently_working"
        )

        if current:

            attrs["end_date"] = None

        elif start and end:

            if end < start:

                raise serializers.ValidationError(
                    {
                        "end_date":
                        "End date cannot be earlier than start date."
                    }
                )

        return attrs
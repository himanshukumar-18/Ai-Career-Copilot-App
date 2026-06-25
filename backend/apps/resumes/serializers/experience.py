from rest_framework import serializers

from apps.resumes.model.experience import Experience


class ExperienceSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Experience

        fields = "__all__"

        read_only_fields = (
            "id",
            "resume",
            "created_at",
            "updated_at",
        )

    def validate_company(
        self,
        value,
    ):

        value = value.strip()

        if len(value) < 2:

            raise serializers.ValidationError(
                "Company name is required."
            )

        return value

    def validate_position(
        self,
        value,
    ):

        value = value.strip()

        if len(value) < 2:

            raise serializers.ValidationError(
                "Position is required."
            )

        return value

    def validate_location(
        self,
        value,
    ):

        return value.strip()

    def validate_description(
        self,
        value,
    ):

        return value.strip()

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
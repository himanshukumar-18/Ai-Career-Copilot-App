from rest_framework import serializers

from apps.resumes.model.education import Education


class EducationSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Education

        fields = "__all__"

        read_only_fields = (
            "id",
            "resume",
            "created_at",
            "updated_at",
        )

    def validate_institution(
        self,
        value,
    ):

        value = value.strip()

        if len(value) < 2:

            raise serializers.ValidationError(
                "Institution name is too short."
            )

        return value

    def validate_degree(
        self,
        value,
    ):

        value = value.strip()

        if len(value) < 2:

            raise serializers.ValidationError(
                "Degree is required."
            )

        return value

    def validate_field_of_study(
        self,
        value,
    ):

        return value.strip()

    def validate_grade(
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
            "currently_studying"
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
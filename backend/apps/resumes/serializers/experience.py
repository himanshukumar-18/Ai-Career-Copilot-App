from rest_framework import serializers

from apps.resumes.model import Experience


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = [
            "id",
            "resume",
            "company",
            "position",
            "employment_type",
            "location",
            "start_date",
            "end_date",
            "currently_working",
            "description",
            "display_order",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "resume",
            "created_at",
            "updated_at",
        ]

    def validate_company(self, value):
        value = value.strip()

        if len(value) < 2:
            raise serializers.ValidationError(
                "Company name must contain at least 2 characters."
            )

        return value

    def validate_position(self, value):
        value = value.strip()

        if len(value) < 2:
            raise serializers.ValidationError(
                "Position must contain at least 2 characters."
            )

        return value

    def validate_location(self, value):
        return value.strip()

    def validate_description(self, value):
        return value.strip()

    def validate(self, attrs):
        instance = getattr(self, "instance", None)

        start_date = attrs.get(
            "start_date",
            getattr(instance, "start_date", None),
        )
        end_date = attrs.get(
            "end_date",
            getattr(instance, "end_date", None),
        )
        currently_working = attrs.get(
            "currently_working",
            getattr(instance, "currently_working", False),
        )

        if currently_working:
            attrs["end_date"] = None
        elif not end_date:
            raise serializers.ValidationError(
                {
                    "end_date": (
                        "End date is required unless this is your current role."
                    )
                }
            )
        elif start_date and end_date < start_date:
            raise serializers.ValidationError(
                {
                    "end_date": (
                        "End date cannot be earlier than start date."
                    )
                }
            )

        return attrs
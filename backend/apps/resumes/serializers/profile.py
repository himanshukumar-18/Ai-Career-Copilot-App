from rest_framework import serializers

from apps.resumes.model.resume_profile import ResumeProfile


class ResumeProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = ResumeProfile

        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "headline",
            "phone",
            "address",
            "city",
            "state",
            "postal_code",
            "country",
            "profile_photo",
        ]

        read_only_fields = [
            "id",
        ]

    def validate_summary(self, value):
        value = value.strip()

        # Only enforce the minimum length once the user actually writes
        # something. An empty summary is allowed (profile is blank on
        # creation and filled in section by section).
        if value and len(value) < 30:
            raise serializers.ValidationError(
                "Professional summary should contain at least 30 characters."
            )

        return value

    def validate_phone(self, value):
        value = value.strip()

        # Same idea: don't block saving other sections just because
        # phone hasn't been filled in yet.
        if value and len(value) < 10:
            raise serializers.ValidationError(
                "Please enter a valid phone number."
            )

        return value
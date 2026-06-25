from rest_framework import serializers

from apps.resumes.model.resume_profile import ResumeProfile


class ResumeProfileSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = ResumeProfile

        fields = [
            "id",
            "headline",
            "phone",
            "address",
            "city",
            "state",
            "country",
            "website",
            "linkedin",
            "github",
            "portfolio",
            "summary",
        ]

        read_only_fields = [
            "id",
        ]

    def validate_summary(self, value):

        value = value.strip()

        if len(value) < 30:

            raise serializers.ValidationError(
                "Professional summary should contain at least 30 characters."
            )

        return value

    def validate_phone(self, value):

        value = value.strip()

        if len(value) < 10:

            raise serializers.ValidationError(
                "Please enter a valid phone number."
            )

        return value

    def validate(self, attrs):

        urls = [
            "website",
            "linkedin",
            "github",
            "portfolio",
        ]

        for field in urls:

            url = attrs.get(field)

            if (
                url
                and not (
                    url.startswith("http://")
                    or url.startswith("https://")
                )
            ):

                attrs[field] = (
                    "https://" + url
                )

        return attrs
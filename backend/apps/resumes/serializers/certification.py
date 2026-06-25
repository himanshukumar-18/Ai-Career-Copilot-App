from rest_framework import serializers

from apps.resumes.model.certification import Certification


class CertificationSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Certification

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
                "Certification name is required."
            )

        return value

    def validate_issuing_organization(
        self,
        value,
    ):

        return value.strip()

    def validate(
        self,
        attrs,
    ):

        issue = attrs.get("issue_date")

        expiry = attrs.get("expiry_date")

        never = attrs.get(
            "does_not_expire"
        )

        if never:

            attrs["expiry_date"] = None

        elif issue and expiry:

            if expiry < issue:

                raise serializers.ValidationError(
                    {
                        "expiry_date":
                        "Expiry date cannot be earlier than issue date."
                    }
                )

        return attrs
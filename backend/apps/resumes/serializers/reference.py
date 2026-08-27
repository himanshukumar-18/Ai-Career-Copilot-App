from rest_framework import serializers

from apps.resumes.model.reference import Reference


class ReferenceSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Reference

        fields = "__all__"

        read_only_fields = (
            "id",
            "resume",
            "created_at",
            "updated_at",
        )

    def validate_full_name(
        self,
        value,
    ):

        return value.strip()

    def validate_designation(
        self,
        value,
    ):

        return value.strip()

    def validate_company(
        self,
        value,
    ):

        return value.strip()

    def validate_relationship(
        self,
        value,
    ):

        return value.strip()
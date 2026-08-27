from rest_framework import serializers

from apps.resumes.model.social_link import SocialLink


class SocialLinkSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = SocialLink

        fields = "__all__"

        read_only_fields = (
            "id",
            "resume",
            "created_at",
            "updated_at",
        )

    def validate(
        self,
        attrs,
    ):

        platform = attrs.get(
            "platform"
        )

        custom = attrs.get(
            "custom_platform"
        )

        if (
            platform == "other"
            and not custom
        ):

            raise serializers.ValidationError(
                {
                    "custom_platform":
                    "Custom platform is required."
                }
            )

        return attrs
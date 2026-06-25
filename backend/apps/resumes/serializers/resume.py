from rest_framework import serializers

from apps.resumes.model.resume import Resume


class ResumeSerializer(serializers.ModelSerializer):

    user = serializers.PrimaryKeyRelatedField(
        read_only=True,
    )

    class Meta:

        model = Resume

        fields = [
            "id",
            "user",
            "title",
            "template",
            "theme_color",
            "font_family",
            "font_size",
            "is_default",
            "is_public",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "created_at",
            "updated_at",
        ]

    def validate_title(self, value):

        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Resume title cannot be empty."
            )

        return value

    def validate_font_size(self, value):

        if value < 8 or value > 24:

            raise serializers.ValidationError(
                "Font size must be between 8 and 24."
            )

        return value

    def validate(self, attrs):

        request = self.context.get("request")

        if (
            attrs.get("is_default")
            and request
            and request.user.is_authenticated
        ):

            Resume.objects.filter(
                user=request.user,
                is_default=True,
            ).update(
                is_default=False,
            )

        return attrs
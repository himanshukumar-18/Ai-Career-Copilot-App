from rest_framework import serializers

from apps.resumes.model.resume import Resume


class ResumeSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Resume

        fields = [

            "id",

            "title",

            "template",

            "theme_color",

            "font_family",

            "font_size",

            "is_default",

            "is_public",

        ]

        read_only_fields = [

            "id",

        ]

    def validate_title(
        self,
        value,
    ):

        value = value.strip()

        if not value:

            raise serializers.ValidationError(
                "Resume title is required."
            )

        return value

    def validate_font_size(
        self,
        value,
    ):

        if value < 8 or value > 24:

            raise serializers.ValidationError(
                "Font size must be between 8 and 24."
            )

        return value

    def validate(
        self,
        attrs,
    ):

        request = self.context.get(
            "request"
        )

        if (
            request
            and attrs.get("is_default")
        ):

            Resume.objects.filter(
                user=request.user,
                is_default=True,
            ).update(
                is_default=False,
            )

        return attrs

    def create(
        self,
        validated_data,
    ):

        validated_data["user"] = (
            self.context["request"].user
        )

        return super().create(
            validated_data
        )
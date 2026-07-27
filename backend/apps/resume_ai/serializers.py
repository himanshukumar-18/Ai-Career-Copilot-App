"""
DRF serializers for Resume AI request and response contracts.
"""

from rest_framework import serializers


class ResumeAnalysisRequestSerializer(serializers.Serializer):
    """Validates the request payload for AI resume analysis.

    Fields:
        resume_id: ID of the resume to analyze. Must be a positive integer.
    """

    resume_id = serializers.IntegerField(
        min_value=1,
        required=True,
        help_text="Positive integer ID of the resume to analyse.",
        error_messages={
            "required": "resume_id is required.",
            "invalid": "resume_id must be a valid integer.",
            "min_value": "resume_id must be greater than 0.",
        },
    )

    def validate_resume_id(self, value: int) -> int:
        """Ensures resume_id is a clean positive integer.

        Args:
            value: Integer resume ID.

        Returns:
            Validated integer resume ID.

        Raises:
            ValidationError: If value is not a valid positive integer.
        """
        if not isinstance(value, int) or value <= 0:
            raise serializers.ValidationError(
                "resume_id must be a positive integer."
            )
        return value


class ResumeImproveRequestSerializer(serializers.Serializer):
    """Validates the request payload for AI section improvement.

    Fields:
        resume_id: ID of the resume to improve.
        section: The section to improve.
    """

    VALID_SECTIONS = [
        "profile",
        "summary",
        "experience",
        "education",
        "projects",
        "skills",
        "certifications",
        "languages",
    ]

    resume_id = serializers.IntegerField(
        min_value=1,
        required=True,
        help_text="Positive integer ID of the resume to improve.",
        error_messages={
            "required": "resume_id is required.",
            "invalid": "resume_id must be a valid integer.",
            "min_value": "resume_id must be greater than 0.",
        },
    )

    section = serializers.ChoiceField(
        choices=VALID_SECTIONS,
        required=True,
        help_text=f"Resume section to improve. Valid choices: {', '.join(VALID_SECTIONS)}.",
        error_messages={
            "required": "section is required.",
            "invalid_choice": "Invalid section. Must be one of: " + ", ".join(VALID_SECTIONS) + ".",
        },
    )


class ResumeAnalysisResponseSerializer(serializers.Serializer):
    """API response wrapper for resume analysis results.

    Note:
        The ``data`` field carries the ResumeAnalysis Pydantic model's
        serialized dictionary directly, so field-level validation is handled
        by Pydantic upstream.
    """

    success = serializers.BooleanField()
    message = serializers.CharField()
    data = serializers.JSONField()
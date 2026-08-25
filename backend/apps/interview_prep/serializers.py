"""DRF Serializers for the interview_prep app."""

from rest_framework import serializers

from apps.interview_prep.constants import (
    DifficultyLevel,
    InterviewCategory,
)
from apps.interview_prep.models import (
    InterviewPrepPlan,
    InterviewQuestion,
    InterviewReadiness,
    MockInterviewSession,
    MockInterviewTurn,
    PrepResource,
    PrepTopic,
    QuestionAttempt,
)


class GeneratePrepPlanRequestSerializer(serializers.Serializer):
    """Request payload for generating an interview prep plan."""

    target_role = serializers.CharField(
        required=True,
        max_length=150,
        help_text="Target career role or job title (e.g., 'Backend Developer', 'AI/ML Engineer').",
    )
    experience_level = serializers.ChoiceField(
        choices=DifficultyLevel.choices,
        default=DifficultyLevel.INTERMEDIATE,
        required=False,
    )
    company_name = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=150,
        default="",
    )
    job_description = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=10000,
        default="",
    )
    force_regenerate = serializers.BooleanField(
        default=False,
        required=False,
    )


class PrepResourceSerializer(serializers.ModelSerializer):
    """Serializer for learning resources."""

    class Meta:
        model = PrepResource
        fields = [
            "id",
            "title",
            "url",
            "provider",
            "resource_type",
            "is_free",
            "difficulty",
            "created_at",
        ]


class PrepTopicSerializer(serializers.ModelSerializer):
    """Serializer for interview prep topics."""

    resources = PrepResourceSerializer(many=True, read_only=True)

    class Meta:
        model = PrepTopic
        fields = [
            "id",
            "title",
            "category",
            "difficulty",
            "priority",
            "proficiency_status",
            "what_to_study",
            "what_to_practice",
            "resources",
            "created_at",
        ]


class InterviewPrepPlanSerializer(serializers.ModelSerializer):
    """Summary serializer for interview prep plans."""

    topic_count = serializers.IntegerField(source="topics.count", read_only=True)
    question_count = serializers.IntegerField(source="questions.count", read_only=True)

    class Meta:
        model = InterviewPrepPlan
        fields = [
            "id",
            "target_role",
            "experience_level",
            "company_name",
            "summary",
            "overall_readiness_score",
            "topic_count",
            "question_count",
            "is_active",
            "created_at",
            "updated_at",
        ]


class InterviewPrepPlanDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for interview prep plan with nested topics and resources."""

    topics = PrepTopicSerializer(many=True, read_only=True)

    class Meta:
        model = InterviewPrepPlan
        fields = [
            "id",
            "target_role",
            "experience_level",
            "company_name",
            "job_description",
            "summary",
            "overall_readiness_score",
            "topics",
            "is_active",
            "created_at",
            "updated_at",
        ]


class GenerateQuestionsRequestSerializer(serializers.Serializer):
    """Request payload for generating practice questions."""

    topic_id = serializers.UUIDField(required=False, allow_null=True)
    question_count = serializers.IntegerField(default=5, min_value=1, max_value=10)


class InterviewQuestionSerializer(serializers.ModelSerializer):
    """Serializer for practice interview questions."""

    class Meta:
        model = InterviewQuestion
        fields = [
            "id",
            "plan",
            "topic",
            "question_text",
            "category",
            "difficulty",
            "source_type",
            "ideal_answer_outline",
            "key_points",
            "created_at",
        ]


class SubmitAnswerRequestSerializer(serializers.Serializer):
    """Request payload for submitting a candidate answer."""

    user_answer = serializers.CharField(
        required=True,
        min_length=3,
        max_length=10000,
        help_text="Candidate submitted answer text.",
    )


class QuestionAttemptSerializer(serializers.ModelSerializer):
    """Serializer for question attempt evaluation result."""

    class Meta:
        model = QuestionAttempt
        fields = [
            "id",
            "question",
            "user_answer",
            "score",
            "is_correct",
            "strengths",
            "weaknesses",
            "missing_points",
            "ideal_answer",
            "improvement_tips",
            "created_at",
        ]


class StartMockSessionRequestSerializer(serializers.Serializer):
    """Request payload for starting a mock interview session."""

    category = serializers.ChoiceField(
        choices=InterviewCategory.choices,
        default=InterviewCategory.TECHNICAL,
    )
    total_questions = serializers.IntegerField(default=5, min_value=1, max_value=10)


class SubmitMockTurnRequestSerializer(serializers.Serializer):
    """Request payload for submitting mock turn answer."""

    user_answer = serializers.CharField(required=True, min_length=3, max_length=10000)


class MockTurnSerializer(serializers.ModelSerializer):
    """Serializer for a turn within a mock interview."""

    class Meta:
        model = MockInterviewTurn
        fields = [
            "id",
            "turn_index",
            "question_text",
            "category",
            "difficulty",
            "user_answer",
            "score",
            "evaluation",
            "follow_up_hint",
            "created_at",
        ]


class MockSessionSerializer(serializers.ModelSerializer):
    """Serializer for mock interview sessions."""

    class Meta:
        model = MockInterviewSession
        fields = [
            "id",
            "plan",
            "title",
            "category",
            "total_questions",
            "current_question_index",
            "status",
            "overall_score",
            "feedback",
            "created_at",
            "updated_at",
        ]


class MockSessionDetailSerializer(serializers.ModelSerializer):
    """Detailed mock interview session serializer with all turns."""

    turns = MockTurnSerializer(many=True, read_only=True)

    class Meta:
        model = MockInterviewSession
        fields = [
            "id",
            "plan",
            "title",
            "category",
            "total_questions",
            "current_question_index",
            "status",
            "overall_score",
            "feedback",
            "turns",
            "created_at",
            "updated_at",
        ]


class InterviewReadinessSerializer(serializers.ModelSerializer):
    """Serializer for interview readiness analytics."""

    class Meta:
        model = InterviewReadiness
        fields = [
            "id",
            "plan",
            "technical_score",
            "behavioral_score",
            "project_score",
            "overall_score",
            "weak_areas",
            "recommendation",
            "created_at",
        ]

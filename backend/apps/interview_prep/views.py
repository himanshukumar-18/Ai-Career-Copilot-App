"""REST API views for the interview_prep app."""

import logging
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from config.responses import ApiResponse, ApiResponseMixin

from apps.interview_prep.exceptions import (
    AIGenerationError,
    InvalidSessionStateError,
    LLMConfigurationException,
    LLMRequestFailedError,
    MockSessionNotFoundError,
    PrepGenerationParseError,
    PrepPlanNotFoundError,
    QuestionNotFoundError,
)
from apps.interview_prep.models import (
    InterviewPrepPlan,
    InterviewQuestion,
    MockInterviewSession,
    QuestionAttempt,
)
from apps.interview_prep.serializers import (
    GeneratePrepPlanRequestSerializer,
    GenerateQuestionsRequestSerializer,
    InterviewPrepPlanDetailSerializer,
    InterviewPrepPlanSerializer,
    InterviewQuestionSerializer,
    InterviewReadinessSerializer,
    MockSessionDetailSerializer,
    MockSessionSerializer,
    QuestionAttemptSerializer,
    StartMockSessionRequestSerializer,
    SubmitAnswerRequestSerializer,
    SubmitMockTurnRequestSerializer,
)
from apps.interview_prep.services import (
    calculate_interview_readiness,
    finish_mock_interview_session,
    generate_and_save_prep_plan,
    generate_questions_for_plan,
    get_study_today_recommendation,
    start_mock_interview_session,
    submit_mock_turn_answer,
    submit_question_answer,
)

logger = logging.getLogger(__name__)


@extend_schema(
    tags=["Interview Preparation"],
    summary="Generate personalized interview preparation plan",
    description="Trigger AI interview plan generation based on profile, resume, projects, roadmaps, and optional job description.",
    request=GeneratePrepPlanRequestSerializer,
    responses={201: InterviewPrepPlanDetailSerializer, 400: ApiResponse, 500: ApiResponse},
)
class GeneratePrepPlanView(ApiResponseMixin, APIView):
    """Trigger AI personalized interview plan generation."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = GeneratePrepPlanRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        target_role = serializer.validated_data["target_role"]
        exp_level = serializer.validated_data.get("experience_level", "intermediate")
        company = serializer.validated_data.get("company_name", "")
        jd = serializer.validated_data.get("job_description", "")
        force = serializer.validated_data.get("force_regenerate", False)

        try:
            plan = generate_and_save_prep_plan(
                user=request.user,
                target_role=target_role,
                experience_level=exp_level,
                company_name=company,
                job_description=jd,
                force_regenerate=force,
            )
            out_serializer = InterviewPrepPlanDetailSerializer(plan)
            return ApiResponse.created(
                request=request,
                data=out_serializer.data,
                message="Personalized AI interview preparation plan generated successfully.",
            )
        except (LLMConfigurationException, LLMRequestFailedError, PrepGenerationParseError, AIGenerationError) as exc:
            return ApiResponse.error(
                request=request,
                message=exc.message,
                errors=exc.details,
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@extend_schema_view(
    list=extend_schema(
        tags=["Interview Preparation"],
        summary="List user's interview preparation plans",
        responses={200: InterviewPrepPlanSerializer(many=True)},
    ),
    retrieve=extend_schema(
        tags=["Interview Preparation"],
        summary="Get detail of an interview preparation plan with topics & resources",
        responses={200: InterviewPrepPlanDetailSerializer, 404: ApiResponse},
    ),
)
class PrepPlanViewSet(ApiResponseMixin, viewsets.ReadOnlyModelViewSet):
    """ReadOnly viewset for listing and retrieving student's interview prep plans."""

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return InterviewPrepPlan.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == "retrieve":
            return InterviewPrepPlanDetailSerializer
        return InterviewPrepPlanSerializer


@extend_schema(
    tags=["Interview Preparation"],
    summary="Generate practice questions for a plan",
    description="Generate dynamic technical, resume-based, project-based, or JD questions.",
    request=GenerateQuestionsRequestSerializer,
    responses={201: InterviewQuestionSerializer(many=True), 404: ApiResponse},
)
class GenerateQuestionsView(ApiResponseMixin, APIView):
    """Generate AI practice questions for a specific prep plan."""

    permission_classes = [IsAuthenticated]

    def post(self, request, plan_id):
        serializer = GenerateQuestionsRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        topic_id = serializer.validated_data.get("topic_id")
        q_count = serializer.validated_data.get("question_count", 5)

        try:
            questions = generate_questions_for_plan(
                user=request.user,
                plan_id=str(plan_id),
                topic_id=str(topic_id) if topic_id else None,
                question_count=q_count,
            )
            out_serializer = InterviewQuestionSerializer(questions, many=True)
            return ApiResponse.created(
                request=request,
                data=out_serializer.data,
                message=f"Generated {len(questions)} interview questions successfully.",
            )
        except PrepPlanNotFoundError as exc:
            return ApiResponse.not_found(request=request, message=exc.message)
        except (LLMConfigurationException, LLMRequestFailedError, AIGenerationError) as exc:
            return ApiResponse.error(request=request, message=exc.message)


@extend_schema(
    tags=["Interview Preparation"],
    summary="Submit candidate answer for AI evaluation",
    request=SubmitAnswerRequestSerializer,
    responses={201: QuestionAttemptSerializer, 404: ApiResponse},
)
class SubmitAnswerView(ApiResponseMixin, APIView):
    """Submit candidate answer and receive instant AI score, strengths, and ideal answer."""

    permission_classes = [IsAuthenticated]

    def post(self, request, question_id):
        serializer = SubmitAnswerRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_answer = serializer.validated_data["user_answer"]

        try:
            attempt = submit_question_answer(
                user=request.user,
                question_id=str(question_id),
                user_answer=user_answer,
            )
            out_serializer = QuestionAttemptSerializer(attempt)
            return ApiResponse.created(
                request=request,
                data=out_serializer.data,
                message="Answer evaluated successfully.",
            )
        except QuestionNotFoundError as exc:
            return ApiResponse.not_found(request=request, message=exc.message)


@extend_schema(
    tags=["Interview Preparation"],
    summary="Start an adaptive AI mock interview session",
    request=StartMockSessionRequestSerializer,
    responses={201: MockSessionDetailSerializer, 404: ApiResponse},
)
class StartMockSessionView(ApiResponseMixin, APIView):
    """Start an interactive mock interview session."""

    permission_classes = [IsAuthenticated]

    def post(self, request, plan_id):
        serializer = StartMockSessionRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        category = serializer.validated_data.get("category", "technical")
        total_q = serializer.validated_data.get("total_questions", 5)

        try:
            session = start_mock_interview_session(
                user=request.user,
                plan_id=str(plan_id),
                category=category,
                total_questions=total_q,
            )
            out_serializer = MockSessionDetailSerializer(session)
            return ApiResponse.created(
                request=request,
                data=out_serializer.data,
                message="Mock interview session started successfully.",
            )
        except PrepPlanNotFoundError as exc:
            return ApiResponse.not_found(request=request, message=exc.message)


@extend_schema(
    tags=["Interview Preparation"],
    summary="Submit answer for current mock turn & receive adaptive follow-up",
    request=SubmitMockTurnRequestSerializer,
    responses={200: ApiResponse, 400: ApiResponse, 404: ApiResponse},
)
class MockSessionTurnView(ApiResponseMixin, APIView):
    """Submit turn response and retrieve adaptive next question."""

    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        serializer = SubmitMockTurnRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_answer = serializer.validated_data["user_answer"]

        try:
            result = submit_mock_turn_answer(
                user=request.user,
                session_id=str(session_id),
                user_answer=user_answer,
            )
            if result.get("is_finished"):
                session_data = MockSessionDetailSerializer(result["session"]).data
                return ApiResponse.success(
                    request=request,
                    data={"is_finished": True, "session": session_data},
                    message="Mock interview completed successfully!",
                )

            return ApiResponse.success(
                request=request,
                data={
                    "is_finished": False,
                    "completed_turn_score": result["completed_turn"].score,
                    "completed_turn_evaluation": result["completed_turn"].evaluation,
                    "next_question": result["next_turn"].question_text,
                    "next_turn_index": result["next_turn"].turn_index,
                },
                message="Turn evaluated. Next question ready.",
            )
        except MockSessionNotFoundError as exc:
            return ApiResponse.not_found(request=request, message=exc.message)
        except InvalidSessionStateError as exc:
            return ApiResponse.error(request=request, message=exc.message)


@extend_schema(
    tags=["Interview Preparation"],
    summary="Retrieve interview readiness analytics",
    responses={200: InterviewReadinessSerializer, 404: ApiResponse},
)
class InterviewReadinessView(ApiResponseMixin, APIView):
    """Retrieve holistic interview readiness score and recommendations."""

    permission_classes = [IsAuthenticated]

    def get(self, request, plan_id):
        try:
            readiness = calculate_interview_readiness(user=request.user, plan_id=str(plan_id))
            out_serializer = InterviewReadinessSerializer(readiness)
            return ApiResponse.success(
                request=request,
                data=out_serializer.data,
                message="Readiness assessment calculated successfully.",
            )
        except PrepPlanNotFoundError as exc:
            return ApiResponse.not_found(request=request, message=exc.message)


@extend_schema(
    tags=["Interview Preparation"],
    summary="Get daily focus study recommendation",
    responses={200: ApiResponse},
)
class StudyTodayView(ApiResponseMixin, APIView):
    """Retrieve focused daily study recommendation for candidate."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        rec = get_study_today_recommendation(user=request.user)
        return ApiResponse.success(
            request=request,
            data=rec,
            message="Daily study recommendation fetched.",
        )

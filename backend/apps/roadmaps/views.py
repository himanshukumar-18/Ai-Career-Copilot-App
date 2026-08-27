"""REST API views for the roadmaps app."""

import logging
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from config.responses import ApiResponse, ApiResponseMixin

from apps.roadmaps.exceptions import (
    AIGenerationError,
    AlreadyEnrolledError,
    CareerRoleNotFoundError,
    InvalidStatusTransitionError,
    LLMConfigurationException,
    LLMRequestFailedError,
    NotEnrolledError,
    PrerequisiteNotMetError,
    RoadmapException,
    RoadmapGenerationParseError,
    RoadmapNotFoundError,
    StepNotFoundError,
)
from apps.roadmaps.serializers import (
    CareerRoleSerializer,
    GenerateAIRoadmapRequestSerializer,
    NextStepResponseSerializer,
    RoadmapDetailSerializer,
    StepCompletionRequestSerializer,
    UserRoadmapProgressDetailSerializer,
    UserRoadmapProgressSerializer,
)
from apps.roadmaps.services import (
    complete_step,
    enroll_user_in_roadmap,
    generate_and_save_personalized_roadmap,
    get_career_role_by_slug,
    get_next_recommended_step,
    get_roadmap_by_role_slug,
    get_user_progress,
    list_active_career_roles,
    list_user_roadmaps,
)

logger = logging.getLogger(__name__)


@extend_schema_view(
    list=extend_schema(
        tags=["Career Roadmaps"],
        summary="List active career roles",
        description="Retrieve all available career role learning paths (e.g., Backend Developer, Frontend Developer).",
        responses={200: CareerRoleSerializer(many=True)},
    ),
    retrieve=extend_schema(
        tags=["Career Roadmaps"],
        summary="Get career role details",
        description="Retrieve detail for a specific career role path by its slug.",
        responses={200: CareerRoleSerializer, 404: ApiResponse},
    ),
)
class CareerRoleViewSet(ApiResponseMixin, viewsets.ReadOnlyModelViewSet):
    """Public listing and detail of available career roles."""

    permission_classes = [IsAuthenticated]
    serializer_class = CareerRoleSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return list_active_career_roles()


@extend_schema(
    tags=["Career Roadmaps"],
    summary="Get full career roadmap tree",
    description="Retrieve the complete ordered roadmap phase and step hierarchy for a specific career role.",
    responses={200: RoadmapDetailSerializer, 404: ApiResponse},
)
class FullRoadmapDetailView(ApiResponseMixin, APIView):
    """Retrieve full structured roadmap phases and steps for a career role."""

    permission_classes = [IsAuthenticated]

    def get(self, request, slug):
        try:
            roadmap = get_roadmap_by_role_slug(slug)
            serializer = RoadmapDetailSerializer(roadmap)
            return ApiResponse.success(
                request=request,
                data=serializer.data,
                message="Career roadmap fetched successfully.",
            )
        except (CareerRoleNotFoundError, RoadmapNotFoundError) as exc:
            return ApiResponse.not_found(request=request, message=exc.message)
        except RoadmapException as exc:
            return ApiResponse.error(
                request=request,
                message=exc.message,
                errors=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
            )


@extend_schema(
    tags=["Career Roadmaps"],
    summary="Enroll in a career roadmap",
    description="Initialize a personalized step-by-step progress tracker for a career role.",
    responses={210: UserRoadmapProgressSerializer, 400: ApiResponse, 404: ApiResponse},
)
class EnrollRoadmapView(ApiResponseMixin, APIView):
    """Enroll the authenticated student in a career role roadmap."""

    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        try:
            progress = enroll_user_in_roadmap(request.user, slug)
            serializer = UserRoadmapProgressSerializer(progress)
            return ApiResponse.created(
                request=request,
                data=serializer.data,
                message="Successfully enrolled in career roadmap.",
            )
        except AlreadyEnrolledError as exc:
            return ApiResponse.error(
                request=request,
                message=exc.message,
                errors=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        except RoadmapNotFoundError:
            # Fallback to AI-driven personalized roadmap generation if template is absent
            progress = generate_and_save_personalized_roadmap(request.user, slug)
            serializer = UserRoadmapProgressSerializer(progress)
            return ApiResponse.created(
                request=request,
                data=serializer.data,
                message="Successfully generated and enrolled in AI personalized roadmap.",
            )
        except CareerRoleNotFoundError as exc:
            return ApiResponse.not_found(request=request, message=exc.message)
        except RoadmapException as exc:
            return ApiResponse.error(
                request=request,
                message=exc.message,
                errors=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
            )


@extend_schema(
    tags=["Career Roadmaps"],
    summary="Generate personalized AI career roadmap",
    description="Invoke LangChain + ChatGroq to analyze student profile/projects and generate a personalized roadmap.",
    request=GenerateAIRoadmapRequestSerializer,
    responses={
        201: UserRoadmapProgressDetailSerializer,
        400: ApiResponse,
        404: ApiResponse,
        500: ApiResponse,
        502: ApiResponse,
        503: ApiResponse,
    },
)
class GenerateAIRoadmapView(ApiResponseMixin, APIView):
    """Trigger AI personalized roadmap generation and gap analysis."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = GenerateAIRoadmapRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        role_input = serializer.validated_data["career_role_input"]
        force = serializer.validated_data.get("force_regenerate", False)

        try:
            progress = generate_and_save_personalized_roadmap(
                user=request.user,
                career_role_input=role_input,
                force_regenerate=force,
            )
            out_serializer = UserRoadmapProgressDetailSerializer(progress)
            return ApiResponse.created(
                request=request,
                data=out_serializer.data,
                message="Personalized AI career roadmap generated successfully.",
            )
        except CareerRoleNotFoundError as exc:
            return ApiResponse.not_found(request=request, message=exc.message)
        except LLMConfigurationException as exc:
            return ApiResponse.error(
                request=request,
                message=exc.message,
                errors=exc.details,
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except LLMRequestFailedError as exc:
            return ApiResponse.error(
                request=request,
                message=exc.message,
                errors=exc.details,
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except RoadmapGenerationParseError as exc:
            return ApiResponse.error(
                request=request,
                message=exc.message,
                errors=exc.details,
                status_code=status.HTTP_502_BAD_GATEWAY,
            )
        except AIGenerationError as exc:
            return ApiResponse.error(
                request=request,
                message=exc.message,
                errors=exc.details,
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except RoadmapException as exc:
            return ApiResponse.error(
                request=request,
                message=exc.message,
                errors=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
            )


@extend_schema(
    tags=["Career Roadmaps"],
    summary="Get user's roadmap progress",
    description="Retrieve student's step-by-step progress and study notes for a specific career role roadmap.",
    responses={200: UserRoadmapProgressDetailSerializer, 404: ApiResponse},
)
class UserRoadmapProgressView(ApiResponseMixin, APIView):
    """Get student's detailed progress in a career role roadmap."""

    permission_classes = [IsAuthenticated]

    def get(self, request, slug):
        try:
            progress = get_user_progress(request.user, slug)
            serializer = UserRoadmapProgressDetailSerializer(progress)
            return ApiResponse.success(
                request=request,
                data=serializer.data,
                message="User roadmap progress fetched successfully.",
            )
        except (CareerRoleNotFoundError, NotEnrolledError) as exc:
            return ApiResponse.not_found(request=request, message=exc.message)
        except RoadmapException as exc:
            return ApiResponse.error(
                request=request,
                message=exc.message,
                errors=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
            )


@extend_schema(
    tags=["Career Roadmaps"],
    summary="Complete a roadmap step",
    description="Mark a learning step as completed, record optional study notes, and recalculate next step.",
    request=StepCompletionRequestSerializer,
    responses={200: ApiResponse, 400: ApiResponse, 404: ApiResponse},
)
class CompleteStepView(ApiResponseMixin, APIView):
    """Complete a specific step in the student's active roadmap."""

    permission_classes = [IsAuthenticated]

    def post(self, request, step_id):
        serializer = StepCompletionRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        notes = serializer.validated_data.get("notes")

        try:
            result = complete_step(request.user, step_id, notes=notes)
            next_step_data = get_next_recommended_step(
                request.user, result["user_progress"].career_role.slug
            )
            out_serializer = NextStepResponseSerializer(next_step_data)

            return ApiResponse.success(
                request=request,
                data=out_serializer.data,
                message="Step marked as completed successfully.",
            )
        except (StepNotFoundError, NotEnrolledError) as exc:
            return ApiResponse.not_found(request=request, message=exc.message)
        except PrerequisiteNotMetError as exc:
            return ApiResponse.error(
                request=request,
                message=exc.message,
                errors=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        except RoadmapException as exc:
            return ApiResponse.error(
                request=request,
                message=exc.message,
                errors=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
            )


@extend_schema(
    tags=["Career Roadmaps"],
    summary="Get next recommended step",
    description="Query the backend recommendation engine for the student's next actionable step.",
    responses={200: NextStepResponseSerializer, 404: ApiResponse},
)
class NextStepView(ApiResponseMixin, APIView):
    """Get student's next recommended learning step."""

    permission_classes = [IsAuthenticated]

    def get(self, request, slug):
        try:
            next_step_data = get_next_recommended_step(request.user, slug)
            serializer = NextStepResponseSerializer(next_step_data)
            return ApiResponse.success(
                request=request,
                data=serializer.data,
                message="Next recommended step fetched successfully.",
            )
        except (CareerRoleNotFoundError, NotEnrolledError) as exc:
            return ApiResponse.not_found(request=request, message=exc.message)
        except RoadmapException as exc:
            return ApiResponse.error(
                request=request,
                message=exc.message,
                errors=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
            )


@extend_schema(
    tags=["Career Roadmaps"],
    summary="List student's enrolled roadmaps",
    description="Retrieve all career roadmaps the student has currently enrolled in.",
    responses={200: UserRoadmapProgressSerializer(many=True)},
)
class MyEnrolledRoadmapsView(ApiResponseMixin, APIView):
    """List all enrolled roadmaps for the logged-in student."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        progresses = list_user_roadmaps(request.user)
        serializer = UserRoadmapProgressSerializer(progresses, many=True)
        return ApiResponse.success(
            request=request,
            data=serializer.data,
            message="Enrolled roadmaps fetched successfully.",
        )

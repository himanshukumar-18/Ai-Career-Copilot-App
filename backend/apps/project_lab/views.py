"""Views for the project_lab app."""

import logging
import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from config.responses import ApiResponse, ApiResponseMixin

from apps.project_lab.exceptions import (
    AIGenerationError,
    InvalidGenerationRequest,
    InvalidProjectStatusTransition,
    LLMConfigurationException,
    LLMRequestFailedError,
    ProjectGenerationParseError,
    ProjectLabException,
    ProjectNotFoundError,
)
from apps.project_lab.models import UserProject
from apps.project_lab.serializers import (
    GeneratedProjectSerializer,
    ProjectGenerationRequestSerializer,
    SaveGeneratedProjectSerializer,
    UpdateProjectStatusSerializer,
    UserProjectSerializer,
)
from apps.project_lab.services import (
    delete_user_project,
    generate_and_save_projects,
    get_user_projects,
    save_generated_project,
    update_status,
)

logger = logging.getLogger(__name__)


class UserProjectFilter(django_filters.FilterSet):
    status = django_filters.CharFilter(field_name="status", lookup_expr="exact")
    difficulty = django_filters.CharFilter(field_name="difficulty", lookup_expr="exact")

    class Meta:
        model = UserProject
        fields = ["status", "difficulty"]


@extend_schema(
    tags=["Project Lab"],
    summary="Generate AI project ideas",
    description="Generates tailored coding project ideas based on tech stack, difficulty, and requested count.",
    request=ProjectGenerationRequestSerializer,
    responses={
        201: GeneratedProjectSerializer(many=True),
        400: ApiResponse,
        500: ApiResponse,
        502: ApiResponse,
        503: ApiResponse,
    },
)
class GenerateProjectsView(ApiResponseMixin, APIView):
    """
    Endpoint for requesting AI-generated project suggestions.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ProjectGenerationRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        tech_stack = serializer.validated_data["tech_stack"]
        difficulty = serializer.validated_data["difficulty"]
        count = serializer.validated_data["count"]

        try:
            generated_projects = generate_and_save_projects(
                user=request.user,
                tech_stack=tech_stack,
                difficulty=difficulty,
                count=count,
            )
            out_serializer = GeneratedProjectSerializer(generated_projects, many=True)
            return ApiResponse.created(
                request=request,
                data=out_serializer.data,
                message="Projects generated successfully.",
            )
        except InvalidGenerationRequest as exc:
            return ApiResponse.error(
                request=request,
                message=exc.message,
                errors=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
            )
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
        except ProjectGenerationParseError as exc:
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
        except ProjectLabException as exc:
            return ApiResponse.error(
                request=request,
                message=exc.message,
                errors=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
            )


@extend_schema_view(
    list=extend_schema(
        tags=["Project Lab"],
        summary="List user projects",
        description="Retrieve all projects saved or created by the authenticated user with filtering and search.",
    ),
    retrieve=extend_schema(
        tags=["Project Lab"],
        summary="Get user project detail",
        description="Retrieve detailed progress for a specific user project.",
    ),
    create=extend_schema(
        tags=["Project Lab"],
        summary="Save generated project",
        description="Snapshot an AI-generated project idea into the user's saved projects.",
        request=SaveGeneratedProjectSerializer,
        responses={201: UserProjectSerializer, 400: ApiResponse, 404: ApiResponse},
    ),
    destroy=extend_schema(
        tags=["Project Lab"],
        summary="Delete user project",
        description="Remove a project from the authenticated user's workspace.",
        responses={200: ApiResponse, 404: ApiResponse},
    ),
)
class UserProjectViewSet(ApiResponseMixin, viewsets.ModelViewSet):
    """
    A user's saved and in-progress project tracking entries.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = UserProjectSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = UserProjectFilter
    search_fields = ["title", "description", "notes"]
    ordering_fields = ["created_at", "updated_at", "estimated_hours", "title"]
    ordering = ["-updated_at"]

    def get_queryset(self):
        return get_user_projects(self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = SaveGeneratedProjectSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        generated_project_id = serializer.validated_data["generated_project_id"]

        try:
            user_project = save_generated_project(
                user=request.user,
                generated_project_id=generated_project_id,
            )
            out_serializer = UserProjectSerializer(user_project)
            return ApiResponse.created(
                request=request,
                data=out_serializer.data,
                message="Project saved successfully.",
            )
        except ProjectNotFoundError as exc:
            return ApiResponse.not_found(
                request=request,
                message=exc.message,
            )
        except InvalidGenerationRequest as exc:
            return ApiResponse.error(
                request=request,
                message=exc.message,
                errors=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        except ProjectLabException as exc:
            return ApiResponse.error(
                request=request,
                message=exc.message,
                errors=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

    @extend_schema(
        tags=["Project Lab"],
        summary="Update user project status",
        description="Update project status (not_started -> in_progress -> completed), repo link, and notes.",
        request=UpdateProjectStatusSerializer,
        responses={200: UserProjectSerializer, 400: ApiResponse, 404: ApiResponse},
    )
    @action(detail=True, methods=["patch"], url_path="status")
    def update_status(self, request, pk=None):
        serializer = UpdateProjectStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_status = serializer.validated_data["status"]
        repo_link = serializer.validated_data.get("repo_link")
        notes = serializer.validated_data.get("notes")

        try:
            updated = update_status(
                user=request.user,
                user_project_id=pk,
                new_status=new_status,
                repo_link=repo_link,
                notes=notes,
            )
            out_serializer = self.get_serializer(updated)
            return ApiResponse.updated(
                request=request,
                data=out_serializer.data,
                message="Project status updated successfully.",
            )
        except ProjectNotFoundError as exc:
            return ApiResponse.not_found(
                request=request,
                message=exc.message,
            )
        except InvalidProjectStatusTransition as exc:
            return ApiResponse.error(
                request=request,
                message=exc.message,
                errors=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        except ProjectLabException as exc:
            return ApiResponse.error(
                request=request,
                message=exc.message,
                errors=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

    def destroy(self, request, pk=None, *args, **kwargs):
        try:
            delete_user_project(user=request.user, user_project_id=pk)
            return ApiResponse.deleted(
                request=request,
                message="Project deleted successfully.",
            )
        except ProjectNotFoundError as exc:
            return ApiResponse.not_found(
                request=request,
                message=exc.message,
            )
        except ProjectLabException as exc:
            return ApiResponse.error(
                request=request,
                message=exc.message,
                errors=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
            )
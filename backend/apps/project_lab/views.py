"""Views for the project_lab app."""

import logging
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from config.responses import ApiResponse, ApiResponseMixin

from .exceptions import (
    AIGenerationError,
    InvalidGenerationRequest,
    InvalidProjectStatusTransition,
    LLMConfigurationException,
    LLMRequestFailedError,
    ProjectGenerationParseError,
    ProjectLabException,
    ProjectNotFoundError,
)
from .serializers import (
    GeneratedProjectSerializer,
    ProjectGenerationRequestSerializer,
    SaveGeneratedProjectSerializer,
    UpdateProjectStatusSerializer,
    UserProjectSerializer,
)
from .services import (
    delete_user_project,
    generate_and_save_projects,
    get_user_projects,
    save_generated_project,
    update_status,
)

logger = logging.getLogger(__name__)


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


class UserProjectViewSet(ApiResponseMixin, viewsets.ModelViewSet):
    """
    A user's saved and in-progress project tracking entries.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = UserProjectSerializer

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
        except ProjectLabException as exc:
            return ApiResponse.error(
                request=request,
                message=exc.message,
                errors=exc.details,
                status_code=status.HTTP_400_BAD_REQUEST,
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
from rest_framework.decorators import action
from config.responses import ApiResponse

from apps.resumes.model import Project
from apps.resumes.serializers import ProjectSerializer
from apps.resumes.services import ProjectService, ResumeService

from .base import BaseResumeViewSet


class ProjectViewSet(BaseResumeViewSet):

    model = Project

    serializer_class = ProjectSerializer

    service = ProjectService

    @action(
        detail=False,
        methods=["post"],
    )
    def reorder(self, request):

        resume = ResumeService.get_resume_by_id(
            request.user,
            request.data["resume"],
        )

        ProjectService.reorder(
            resume,
            request.data["ordered_ids"],
        )

        return ApiResponse.success(
            request = request,
            message = "Projects reordered successfully.",
        )

    @action(
        detail=True,
        methods=["post"],
    )
    def feature(self, request, pk=None):

        project = self.get_object()

        ProjectService.feature(project)

        return ApiResponse.success(
            request=request,
            message="Project marked as featured.",
        )

    @action(
        detail=True,
        methods=["post"],
    )
    def unfeature(self, request, pk=None):

        project = self.get_object()

        ProjectService.unfeature(project)

        return ApiResponse.success(
           request=request,
           message="Project unfeatured.",
        )

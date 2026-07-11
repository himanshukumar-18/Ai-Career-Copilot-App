from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from config.responses import ApiResponse, ApiResponseMixin
from apps.resumes.model import Experience
from apps.resumes.permissions.base import IsResumeOwner
from apps.resumes.serializers import ExperienceSerializer
from apps.resumes.services import ExperienceService, ResumeService


class ExperienceViewSet(ApiResponseMixin, viewsets.ModelViewSet):
    serializer_class = ExperienceSerializer
    permission_classes = [IsAuthenticated, IsResumeOwner]
    queryset = Experience.objects.none()

    def get_queryset(self):
        queryset = Experience.objects.filter(
            resume__user=self.request.user
        )

        resume_id = self.request.query_params.get("resume")

        if resume_id:
            # A bad value here (e.g. "undefined" from a broken frontend
            # link) would otherwise crash the int cast with an unhandled
            # ValueError -> 500. Treat it as "no filter" instead.
            try:
                resume_id = int(resume_id)
            except (TypeError, ValueError):
                return queryset.none()

            queryset = queryset.filter(resume_id=resume_id)

        return queryset.order_by(
            "display_order",
            "-start_date",
            "-id",
        )

    def perform_create(self, serializer):
        resume_id = self.request.data.get("resume")

        resume = ResumeService.get_resume_by_id(
            user=self.request.user,
            resume_id=resume_id,
        )

        serializer.instance = ExperienceService.create(
            resume=resume,
            validated_data=serializer.validated_data,
        )

    def perform_update(self, serializer):
        serializer.instance = ExperienceService.update(
            experience=self.get_object(),
            validated_data=serializer.validated_data,
        )

    def perform_destroy(self, instance):
        ExperienceService.delete(instance)

    @action(detail=False, methods=["post"], url_path="reorder")
    def reorder(self, request):
        resume_id = request.data.get("resume")
        ordered_ids = request.data.get("ordered_ids", [])

        resume = ResumeService.get_resume_by_id(
            user=request.user,
            resume_id=resume_id,
        )

        ExperienceService.reorder(
            resume=resume,
            ordered_ids=ordered_ids,
        )

        return ApiResponse.success(
            request=request,
            message="Experience reordered successfully.",
        )
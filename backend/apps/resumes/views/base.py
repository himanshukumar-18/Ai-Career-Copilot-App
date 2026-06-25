from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.resumes.permissions.base import IsResumeOwner
from apps.resumes.services import ResumeService
from config.responses import ApiResponseMixin


class BaseResumeViewSet(
    ApiResponseMixin,
    viewsets.ModelViewSet,
):

    permission_classes = [
        IsAuthenticated,
        IsResumeOwner,
    ]

    model = None
    service = None

    def get_queryset(self):

        return self.model.objects.filter(
            resume__user=self.request.user
        ).order_by(
            "display_order"
        )

    def perform_create(self, serializer):

        resume = ResumeService.get_resume_by_id(
            self.request.user,
            self.request.data.get("resume"),
        )

        self.service.create(
            resume,
            serializer.validated_data,
        )

    def perform_update(self, serializer):

        self.service.update(
            self.get_object(),
            serializer.validated_data,
        )

    def perform_destroy(self, instance):

        self.service.delete(instance)

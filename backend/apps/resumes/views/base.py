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
        queryset = self.model.objects.filter(
            resume__user=self.request.user
        )

        # Child resources are always owned by a resume.  Honour the optional
        # resume filter used by the editor so records from another resume are
        # never shown while editing the current one.
        resume_id = self.request.query_params.get("resume")
        if resume_id:
            queryset = queryset.filter(resume_id=resume_id)

        return queryset.order_by(
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

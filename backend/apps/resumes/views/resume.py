from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from config.responses import ApiResponse, ApiResponseMixin

from django_filters.rest_framework import (
    DjangoFilterBackend,
)

from rest_framework.filters import (

    SearchFilter,

    OrderingFilter,

)

from apps.resumes.filters.resume import (
    ResumeFilter,
)

from apps.resumes.model import Resume
from apps.resumes.permissions.base import IsResumeOwner
from apps.resumes.serializers import (
    ResumeDetailSerializer,
    ResumeListSerializer,
    ResumeSerializer,
)
from apps.resumes.services import ResumeService


class ResumeViewSet(
    ApiResponseMixin,
    viewsets.ModelViewSet,
):

    permission_classes = [
        IsAuthenticated,
        IsResumeOwner,
    ]
    
    filter_backends = [

        DjangoFilterBackend,

        SearchFilter,

        OrderingFilter,

    ]

    filterset_class = ResumeFilter

    search_fields = [

        "title",

    ]

    ordering_fields = [

        "title",

        "created_at",

        "updated_at",

    ]

    ordering = [

        "-updated_at",

    ]

    queryset = Resume.objects.none()

    def get_queryset(self):

        return Resume.objects.filter(
            user=self.request.user
        ).order_by(
            "-updated_at"
        )

    def get_serializer_class(self):

        if self.action == "list":
            return ResumeListSerializer

        if self.action == "retrieve":
            return ResumeDetailSerializer

        return ResumeSerializer

    def perform_create(self, serializer):

        ResumeService.create_resume(
            user=self.request.user,
            validated_data=serializer.validated_data,
        )

    def perform_update(self, serializer):

        ResumeService.update_resume(
            resume=self.get_object(),
            validated_data=serializer.validated_data,
        )

    def perform_destroy(self, instance):

        ResumeService.delete_resume(
            instance,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="duplicate",
    )
    def duplicate(self, request, pk=None):

        resume = self.get_object()

        duplicated = ResumeService.duplicate_resume(
            resume,
        )

        serializer = ResumeDetailSerializer(
            duplicated,
            context={
                "request": request,
            },
        )

        return ApiResponse.created(
            request=request,
            data=serializer.data,
            message="Resume created successful"
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="set-default",
    )
    def set_default(self, request, pk=None):

        resume = self.get_object()

        ResumeService.set_default_resume(
            resume,
        )

        return ApiResponse.updated(
           request=request,
           message="Default resume updated successfully."
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="publish",
    )
    def publish(self, request, pk=None):

        resume = self.get_object()

        ResumeService.publish_resume(
            resume,
        )

        return ApiResponse.success(
            request=request,
            message="Resume published successfully.",
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="unpublish",
    )
    def unpublish(self, request, pk=None):

        resume = self.get_object()

        ResumeService.unpublish_resume(
            resume,
        )

        return ApiResponse.success(
           request = request,
           message="Resume unpublished successfully.",
        )

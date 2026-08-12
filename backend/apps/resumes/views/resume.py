from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
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


class PublicResumeDetailView(APIView):
    """Read-only public representation of a resume explicitly published by its owner."""

    permission_classes = [AllowAny]

    def get(self, request, pk):
        resume = Resume.objects.filter(id=pk, is_public=True).first()
        if resume is None:
            from django.http import Http404

            raise Http404("Public resume not found.")

        serializer = ResumeDetailSerializer(resume, context={"request": request})
        return ApiResponse.success(request=request, data=serializer.data)


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
        ).select_related(
            "profile",
            "summary",
        ).prefetch_related(
            "experiences",
            "educations",
            "skills",
            "projects",
            "certifications",
            "languages",
            "social_links",
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

        serializer.instance = ResumeService.create_resume(
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

        updated_resume = ResumeService.set_default_resume(
            resume,
        )

        serializer = ResumeSerializer(updated_resume, context={"request": request})

        return ApiResponse.updated(
           request=request,
           data=serializer.data,
           message="Default resume updated successfully."
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="publish",
    )
    def publish(self, request, pk=None):

        resume = self.get_object()

        published_resume = ResumeService.publish_resume(
            resume,
        )

        serializer = ResumeDetailSerializer(
            published_resume,
            context={"request": request},
        )

        return ApiResponse.success(
            request=request,
            data={
                "resume": serializer.data,
                # This is a frontend-relative path: the browser supplies the
                # deployed origin rather than the API server guessing a host.
                "public_path": f"/public/resume/{published_resume.id}",
                "published_at": published_resume.updated_at.isoformat(),
            },
            message="Resume published successfully.",
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="unpublish",
    )
    def unpublish(self, request, pk=None):

        resume = self.get_object()

        unpublished_resume = ResumeService.unpublish_resume(
            resume,
        )

        serializer = ResumeDetailSerializer(
            unpublished_resume,
            context={"request": request},
        )

        return ApiResponse.success(
           request = request,
           data={"resume": serializer.data},
           message="Resume unpublished successfully.",
        )

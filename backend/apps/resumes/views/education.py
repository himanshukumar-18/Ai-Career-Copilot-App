from rest_framework import viewsets

from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from config.responses import ApiResponse, ApiResponseMixin

from apps.resumes.model import Education

from apps.resumes.permissions.base import (
    IsResumeOwner,
)

from apps.resumes.serializers import (
    EducationSerializer,
)

from apps.resumes.services import (
    EducationService,
    ResumeService,
)


class EducationViewSet(
    ApiResponseMixin,
    viewsets.ModelViewSet
):

    serializer_class = (
        EducationSerializer
    )

    permission_classes = [

        IsAuthenticated,

        IsResumeOwner,

    ]

    queryset = Education.objects.none()

    def get_queryset(self):

        return Education.objects.filter(

            resume__user=self.request.user

        ).order_by(

            "display_order",

            "-start_date",

        )

    def perform_create(
        self,
        serializer,
    ):

        resume = ResumeService.get_resume_by_id(

            self.request.user,

            self.request.data.get(
                "resume"
            ),

        )

        EducationService.create(

            resume,

            serializer.validated_data,

        )

    def perform_update(
        self,
        serializer,
    ):

        EducationService.update(

            self.get_object(),

            serializer.validated_data,

        )

    def perform_destroy(
        self,
        instance,
    ):

        EducationService.delete(
            instance
        )

    @action(

        detail=False,

        methods=["post"],

        url_path="reorder",

    )

    def reorder(
        self,
        request,
    ):

        resume = ResumeService.get_resume_by_id(

            request.user,

            request.data.get(
                "resume"
            ),

        )

        ordered = request.data.get(

            "ordered_ids",

            [],

        )

        EducationService.reorder(

            resume,

            ordered,

        )

        return ApiResponse.success(
            request=request,
            message="Education reordered successfully.",
        )

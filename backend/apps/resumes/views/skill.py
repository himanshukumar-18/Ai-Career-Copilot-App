from rest_framework.decorators import action
from config.responses import ApiResponse

from apps.resumes.model import Skill
from apps.resumes.serializers import SkillSerializer
from apps.resumes.services import SkillService, ResumeService

from .base import BaseResumeViewSet


class SkillViewSet(BaseResumeViewSet):

    model = Skill

    serializer_class = SkillSerializer

    service = SkillService

    @action(
        detail=False,
        methods=["post"],
    )
    def reorder(self, request):

        resume = ResumeService.get_resume_by_id(
            request.user,
            request.data["resume"],
        )

        SkillService.reorder(
            resume,
            request.data["ordered_ids"],
        )

        return ApiResponse.success(
           request=request,
           message="Skills reordered successfully.",
        )

    @action(
        detail=False,
        methods=["post"],
    )
    def bulk_create(self, request):

        resume = ResumeService.get_resume_by_id(
            request.user,
            request.data["resume"],
        )

        SkillService.bulk_create(
            resume,
            request.data["skills"],
        )

        return ApiResponse.success(
            request = request,
            message="Skills added successfully.",
        )

from apps.resumes.model import Achievement
from apps.resumes.serializers import AchievementSerializer
from apps.resumes.services import AchievementService

from .base import BaseResumeViewSet


class AchievementViewSet(
    BaseResumeViewSet
):

    model = Achievement

    serializer_class = AchievementSerializer

    service = AchievementService
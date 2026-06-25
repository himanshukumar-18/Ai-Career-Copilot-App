from apps.resumes.model import CustomSection
from apps.resumes.serializers import CustomSectionSerializer
from apps.resumes.services import CustomSectionService

from .base import BaseResumeViewSet


class CustomSectionViewSet(
    BaseResumeViewSet
):

    model = CustomSection

    serializer_class = CustomSectionSerializer

    service = CustomSectionService
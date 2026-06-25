from apps.resumes.model import Reference
from apps.resumes.serializers import ReferenceSerializer
from apps.resumes.services import ReferenceService

from .base import BaseResumeViewSet


class ReferenceViewSet(
    BaseResumeViewSet
):

    model = Reference

    serializer_class = ReferenceSerializer

    service = ReferenceService
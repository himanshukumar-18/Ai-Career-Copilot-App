from apps.resumes.model import Certification
from apps.resumes.serializers import CertificationSerializer
from apps.resumes.services import CertificationService

from .base import BaseResumeViewSet


class CertificationViewSet(
    BaseResumeViewSet
):

    model = Certification

    serializer_class = CertificationSerializer

    service = CertificationService
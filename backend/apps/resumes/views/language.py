from apps.resumes.model import Language
from apps.resumes.serializers import LanguageSerializer
from apps.resumes.services import LanguageService

from .base import BaseResumeViewSet


class LanguageViewSet(
    BaseResumeViewSet
):

    model = Language

    serializer_class = LanguageSerializer

    service = LanguageService
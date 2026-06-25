from apps.resumes.model import SocialLink
from apps.resumes.serializers import SocialLinkSerializer
from apps.resumes.services import SocialLinkService

from .base import BaseResumeViewSet


class SocialLinkViewSet(
    BaseResumeViewSet
):

    model = SocialLink

    serializer_class = SocialLinkSerializer

    service = SocialLinkService
from apps.resumes.model import SocialLink

from .base import BaseResumeService


class SocialLinkService(
    BaseResumeService
):

    model = SocialLink
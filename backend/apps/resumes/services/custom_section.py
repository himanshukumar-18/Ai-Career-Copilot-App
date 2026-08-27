from apps.resumes.model import CustomSection

from .base import BaseResumeService


class CustomSectionService(
    BaseResumeService
):

    model = CustomSection
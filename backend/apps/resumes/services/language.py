from apps.resumes.model import Language

from .base import BaseResumeService


class LanguageService(
    BaseResumeService
):

    model = Language
from apps.resumes.model import Achievement

from .base import BaseResumeService


class AchievementService(
    BaseResumeService
):

    model = Achievement
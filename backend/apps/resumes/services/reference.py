from apps.resumes.model import Reference

from .base import BaseResumeService


class ReferenceService(
    BaseResumeService
):

    model = Reference
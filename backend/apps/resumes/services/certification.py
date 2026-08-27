from apps.resumes.model import Certification

from .base import BaseResumeService


class CertificationService(
    BaseResumeService
):

    model = Certification
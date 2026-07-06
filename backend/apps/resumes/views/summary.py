from rest_framework import generics, permissions
from rest_framework.exceptions import NotFound

from apps.resumes.model import Resume, ResumeSummary
from apps.resumes.serializers import ResumeSummarySerializer


class ResumeSummaryView(generics.RetrieveUpdateAPIView):
    serializer_class = ResumeSummarySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        resume_id = self.kwargs["resume_id"]

        try:
            resume = Resume.objects.get(
                id=resume_id,
                user=self.request.user,
            )
        except Resume.DoesNotExist:
            raise NotFound("Resume not found.")

        summary, _ = ResumeSummary.objects.get_or_create(
            resume=resume,
        )

        return summary
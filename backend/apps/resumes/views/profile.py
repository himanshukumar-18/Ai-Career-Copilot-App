from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions

from apps.resumes.model.resume import Resume
from apps.resumes.model.resume_profile import ResumeProfile
from apps.resumes.serializers.profile import ResumeProfileSerializer


class ResumeProfileViewSet(generics.RetrieveUpdateAPIView):
    """
    One profile per resume, so this is not a list-based ViewSet like your
    other sections. It reads/updates the profile for one specific resume,
    identified by resume_id in the URL.

    GET  /resumes/<resume_id>/profile/  -> fetch profile (auto-created if missing)
    PUT  /resumes/<resume_id>/profile/  -> full update
    PATCH /resumes/<resume_id>/profile/ -> partial update
    """

    serializer_class = ResumeProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        resume = get_object_or_404(
            Resume,
            pk=self.kwargs["resume_id"],
            user=self.request.user,
        )

        # A resume can exist before its profile has ever been saved.
        # Auto-create an empty profile the first time it's requested,
        # so the frontend always gets a 200 with an editable object
        # instead of a 404 on a brand new resume.
        profile, _ = ResumeProfile.objects.get_or_create(resume=resume)
        return profile
from django.db import transaction
from django.http import Http404
from django.shortcuts import get_object_or_404

from apps.resumes.model import (
    Resume,
    ResumeProfile,
    Education,
    Experience,
    Skill,
    Project,
    Certification,
    Language,
    Achievement,
    Reference,
    SocialLink,
    CustomSection,
)


class ResumeService:

    @staticmethod
    def list_user_resumes(user):
        return Resume.objects.filter(user=user).order_by("-updated_at")

    @staticmethod
    def get_resume_by_id(user, resume_id):
        # resume_id can arrive as bad text (e.g. "undefined", "", "null")
        # if the frontend sends a broken value. Without this check,
        # Django tries to cast it to an int for the DB query and raises
        # an unhandled ValueError -> 500, instead of a clean 404.
        try:
            resume_id = int(resume_id)
        except (TypeError, ValueError):
            raise Http404("Invalid resume id.")

        return get_object_or_404(Resume, id=resume_id, user=user)

    @staticmethod
    @transaction.atomic
    def create_resume(user, validated_data):
        if validated_data.get("is_default"):
            Resume.objects.filter(
                user=user,
                is_default=True,
            ).update(is_default=False)

        resume = Resume.objects.create(user=user, **validated_data)

        ResumeProfile.objects.create(resume=resume)

        return resume

    @staticmethod
    @transaction.atomic
    def update_resume(resume, validated_data):
        if validated_data.get("is_default"):
            Resume.objects.filter(
                user=resume.user,
                is_default=True,
            ).exclude(id=resume.id).update(is_default=False)

        for field, value in validated_data.items():
            setattr(resume, field, value)

        resume.save()

        return resume

    @staticmethod
    def delete_resume(resume):
        resume.delete()

    @staticmethod
    @transaction.atomic
    def set_default_resume(resume):
        Resume.objects.filter(
            user=resume.user,
            is_default=True,
        ).update(is_default=False)

        resume.is_default = True
        resume.save(update_fields=["is_default"])

        return resume

    @staticmethod
    @transaction.atomic
    def publish_resume(resume):
        resume.is_public = True
        resume.save(update_fields=["is_public"])

        return resume

    @staticmethod
    @transaction.atomic
    def unpublish_resume(resume):
        resume.is_public = False
        resume.save(update_fields=["is_public"])

        return resume

    @staticmethod
    @transaction.atomic
    def duplicate_resume(resume):
        duplicate = Resume.objects.create(
            user=resume.user,
            title=f"{resume.title} (Copy)",
            template=resume.template,
            theme_color=resume.theme_color,
            font_family=resume.font_family,
            font_size=resume.font_size,
            is_default=False,
            is_public=False,
        )

        if hasattr(resume, "profile"):
            profile = resume.profile

            ResumeProfile.objects.create(
                resume=duplicate,
                headline=profile.headline,
                phone=profile.phone,
                address=profile.address,
                city=profile.city,
                state=profile.state,
                country=profile.country,
                website=profile.website,
                linkedin=profile.linkedin,
                github=profile.github,
                portfolio=profile.portfolio,
                summary=profile.summary,
            )

        ResumeService._duplicate_children(Education, resume, duplicate)
        ResumeService._duplicate_children(Experience, resume, duplicate)
        ResumeService._duplicate_children(Skill, resume, duplicate)
        ResumeService._duplicate_children(Project, resume, duplicate)
        ResumeService._duplicate_children(Certification, resume, duplicate)
        ResumeService._duplicate_children(Language, resume, duplicate)
        ResumeService._duplicate_children(Achievement, resume, duplicate)
        ResumeService._duplicate_children(Reference, resume, duplicate)
        ResumeService._duplicate_children(SocialLink, resume, duplicate)
        ResumeService._duplicate_children(CustomSection, resume, duplicate)

        return duplicate

    @staticmethod
    def _duplicate_children(model, source_resume, target_resume):
        children = model.objects.filter(resume=source_resume)

        for obj in children:
            obj.pk = None
            obj.resume = target_resume
            obj.save()
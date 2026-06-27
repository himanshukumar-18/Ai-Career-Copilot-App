from __future__ import annotations

from django.test import TestCase
from django.http import Http404

from apps.accounts.models import User
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
from apps.resumes.services.resume import ResumeService

from .factories import create_user, create_resume


class ResumeServiceTestCase(TestCase):

    def setUp(self):
        self.user = create_user(email="owner@example.com")
        self.other_user = create_user(email="other@example.com")

        self.resume = create_resume(
            self.user,
            title="Owner Resume",
            is_default=False,
            is_public=False,
        )

    def test_create_resume_creates_resume_profile(self):
        resume = ResumeService.create_resume(
            user=self.user,
            validated_data={
                "title": "New Resume",
                "template": "template-1",
                "theme_color": "#ffffff",
                "font_family": "Inter",
                "font_size": 12,
                "is_default": False,
                "is_public": False,
            },
        )
        self.assertIsInstance(resume, Resume)
        self.assertTrue(ResumeProfile.objects.filter(resume=resume).exists())

    def test_update_resume_updates_fields(self):
        updated = ResumeService.update_resume(
            resume=self.resume,
            validated_data={
                "title": "Updated Title",
                "theme_color": "#000000",
            },
        )
        self.assertEqual(updated.title, "Updated Title")
        self.assertEqual(updated.theme_color, "#000000")

    def test_delete_resume_deletes(self):
        ResumeService.delete_resume(self.resume)
        self.assertFalse(Resume.objects.filter(id=self.resume.id).exists())

    def test_set_default_resume_sets_only_one_default(self):
        # Create another default candidate
        other = create_resume(self.user, title="Other", is_default=True)

        updated = ResumeService.set_default_resume(self.resume)
        self.assertTrue(updated.is_default)
        self.assertFalse(Resume.objects.get(id=other.id).is_default)

    def test_publish_and_unpublish_resume(self):
        published = ResumeService.publish_resume(self.resume)
        self.assertTrue(published.is_public)
        unpublished = ResumeService.unpublish_resume(self.resume)
        self.assertFalse(unpublished.is_public)

    def test_duplicate_resume_duplicates_children(self):
        # Seed a few children records for duplication
        Education.objects.create(
            resume=self.resume,
            degree="BSc",
            institution="Uni",
            start_date="2020-01-01",
            end_date="2024-01-01",
            display_order=0,
        )
        Experience.objects.create(
            resume=self.resume,
            title="Dev",
            company="Co",
            start_date="2022-01-01",
            end_date="2023-01-01",
            display_order=0,
        )
        Skill.objects.create(
            resume=self.resume,
            name="Python",
            level="advanced",
            display_order=0,
        )
        Project.objects.create(
            resume=self.resume,
            name="Project A",
            description="Desc",
            link="https://example.com",
            display_order=0,
            is_featured=False,
        )
        Certification.objects.create(
            resume=self.resume,
            name="Cert A",
            issuer="Issuer",
            issue_date="2023-01-01",
            display_order=0,
        )
        Language.objects.create(
            resume=self.resume,
            name="English",
            level="C1",
            display_order=0,
        )
        Achievement.objects.create(
            resume=self.resume,
            title="Achievement",
            description="Desc",
            date="2022-01-01",
            display_order=0,
        )
        Reference.objects.create(
            resume=self.resume,
            name="Ref",
            company="Ref Co",
            email="ref@example.com",
            display_order=0,
        )
        SocialLink.objects.create(
            resume=self.resume,
            platform="linkedin",
            url="https://linkedin.com",
            display_order=0,
        )
        CustomSection.objects.create(
            resume=self.resume,
            title="Section",
            content="Content",
            display_order=0,
        )

        # Ensure ResumeProfile has required fields used during duplication
        profile = self.resume.profile
        profile.headline = "H"
        profile.phone = "123"
        profile.address = "Addr"
        profile.city = "City"
        profile.state = "State"
        profile.country = "Country"
        profile.website = "https://site"
        profile.linkedin = "https://linkedin"
        profile.github = "https://github"
        profile.portfolio = "https://portfolio"
        profile.summary = "Summary"
        profile.save()

        duplicate = ResumeService.duplicate_resume(self.resume)
        self.assertNotEqual(duplicate.id, self.resume.id)
        self.assertEqual(duplicate.user_id, self.resume.user_id)
        self.assertEqual(duplicate.title, f"{self.resume.title} (Copy)")
        self.assertFalse(duplicate.is_public)

        # Child counts should be preserved
        self.assertEqual(Education.objects.filter(resume=duplicate).count(), 1)
        self.assertEqual(Experience.objects.filter(resume=duplicate).count(), 1)
        self.assertEqual(Skill.objects.filter(resume=duplicate).count(), 1)
        self.assertEqual(Project.objects.filter(resume=duplicate).count(), 1)
        self.assertEqual(Certification.objects.filter(resume=duplicate).count(), 1)
        self.assertEqual(Language.objects.filter(resume=duplicate).count(), 1)
        self.assertEqual(Achievement.objects.filter(resume=duplicate).count(), 1)
        self.assertEqual(Reference.objects.filter(resume=duplicate).count(), 1)
        self.assertEqual(SocialLink.objects.filter(resume=duplicate).count(), 1)
        self.assertEqual(CustomSection.objects.filter(resume=duplicate).count(), 1)

    def test_get_resume_by_id_ownership_failure_raises_http404(self):
        with self.assertRaises(Http404):
            ResumeService.get_resume_by_id(self.other_user, self.resume.id)


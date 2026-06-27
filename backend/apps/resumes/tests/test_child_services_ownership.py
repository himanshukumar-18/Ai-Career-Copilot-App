from __future__ import annotations

from django.test import TestCase
from django.http import Http404

from apps.resumes.model import Education
from apps.resumes.services.education import EducationService

from .factories import create_user, create_resume, create_education


class ChildServiceOwnershipTestCase(TestCase):

    def setUp(self):
        self.user = create_user(email="u@example.com")
        self.other_user = create_user(email="o@example.com")
        self.resume = create_resume(self.user)
        self.other_resume = create_resume(self.other_user)

        self.education = create_education(self.resume)

    def test_education_get_raises_http404_for_other_users_resume(self):
        with self.assertRaises(Http404):
            EducationService.get(
                education_id=self.education.id,
                resume=self.other_resume,
            )

    def test_education_update_happens_when_correct_instance_passed(self):
        updated = EducationService.update(
            education=self.education,
            validated_data={
                "degree": "Updated Degree",
            },
        )
        self.assertEqual(updated.degree, "Updated Degree")

    def test_education_delete_deletes(self):
        EducationService.delete(self.education)
        self.assertFalse(Education.objects.filter(id=self.education.id).exists())


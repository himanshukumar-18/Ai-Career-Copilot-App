from __future__ import annotations

from django.test import TestCase
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.resumes.model import Resume


class ResumeAPITestCase(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(
            email="resume@example.com",
            first_name="R",
            last_name="U",
            role="student",
            is_verified=True,
        )
        self.user.set_password("StrongPass!123")
        self.user.save()

        login = self.client.post(
            "/api/v1/auth/login/",
            data={
                "email": self.user.email,
                "password": "StrongPass!123",
            },
            format="json",
        )
        access = login.data.get("access")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

    def test_create_resume_returns_201_or_200(self):
        payload = {
            "title": "API Resume",
            "template": "template-1",
            "theme_color": "#ffffff",
            "font_family": "Inter",
            "font_size": 12,
            "is_default": False,
            "is_public": False,
        }
        resp = self.client.post("/api/v1/resumes/", data=payload, format="json")
        self.assertIn(resp.status_code, (200, 201))
        self.assertTrue(Resume.objects.filter(user=self.user, title="API Resume").exists())

    def test_duplicate_resume_returns_201_or_200(self):
        resume = Resume.objects.create(
            user=self.user,
            title="Dup Source",
            template="template-1",
            theme_color="#fff",
            font_family="Inter",
            font_size=12,
            is_default=False,
            is_public=False,
        )
        # ensure resume profile exists if required
        if not hasattr(resume, "profile"):
            # profile may be created by signal; skip if not required
            pass

        resp = self.client.post(f"/api/v1/resumes/{resume.id}/duplicate/")
        self.assertIn(resp.status_code, (200, 201))

    def test_publish_returns_public_path_and_public_endpoint_is_readable(self):
        resume = Resume.objects.create(
            user=self.user,
            title="Public Resume",
        )

        response = self.client.post(f"/api/v1/resumes/{resume.id}/publish/")

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["success"])
        self.assertEqual(
            response.data["data"]["public_path"],
            f"/public/resume/{resume.id}",
        )
        self.assertTrue(response.data["data"]["resume"]["is_public"])

        public_client = APIClient()
        public_response = public_client.get(f"/api/v1/public/resumes/{resume.id}/")

        self.assertEqual(public_response.status_code, 200)
        self.assertEqual(public_response.data["data"]["id"], resume.id)

    def test_unpublished_resume_is_not_publicly_readable(self):
        resume = Resume.objects.create(user=self.user, title="Private Resume")

        response = APIClient().get(f"/api/v1/public/resumes/{resume.id}/")

        self.assertEqual(response.status_code, 404)

from __future__ import annotations

from django.test import TestCase
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.profiles.model.profile import Profile


class ProfileAPITestCase(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(
            email="profile@example.com",
            first_name="P",
            last_name="U",
            role="student",
            is_verified=True,
        )
        self.user.set_password("StrongPass!123")
        self.user.save()
        # Signal should create profile
        self.profile = Profile.objects.get(user=self.user)

        # Authenticate via login endpoint
        resp = self.client.post(
            "/api/v1/auth/login/",
            data={
                "email": self.user.email,
                "password": "StrongPass!123",
            },
            format="json",
        )
        access = resp.data.get("data", {}).get("access") or resp.data.get("access")
        if not access:
            self.client.force_authenticate(user=self.user)
        else:
            self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

    def test_get_profile_returns_200(self):
        resp = self.client.get("/api/v1/profile/me/")
        self.assertIn(resp.status_code, (200,))

    def test_patch_profile_updates(self):
        payload = {
            "headline": "New Headline",
        }
        resp = self.client.patch(
            "/api/v1/profile/me/",
            data=payload,
            format="json",
        )
        self.assertIn(resp.status_code, (200, 201))
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.headline, "New Headline")


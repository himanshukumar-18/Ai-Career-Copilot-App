from __future__ import annotations

from django.test import TestCase
from rest_framework.test import APIClient

from apps.accounts.models import User


class AuthAPITestCase(TestCase):

    def setUp(self):
        self.client = APIClient()

    def test_register_success_creates_user(self):
        payload = {
            "first_name": "Test",
            "last_name": "User",
            "email": "reg@example.com",
            "password": "StrongPass!123",
            "confirm_password": "StrongPass!123",
        }
        resp = self.client.post(
            "/api/v1/auth/register/",
            data=payload,
            format="json",
        )
        # Exact response shape depends on ApiResponse implementation.
        self.assertIn(resp.status_code, (200, 201))
        self.assertTrue(User.objects.filter(email__iexact="reg@example.com").exists())

    def test_login_requires_verified_user(self):
        # User with is_verified=False should fail via EmailTokenObtainPairSerializer
        user = User.objects.create(
            email="unverified@example.com",
            first_name="U",
            last_name="V",
            role="student",
            is_verified=False,
        )
        user.set_password("StrongPass!123")
        user.save()

        resp = self.client.post(
            "/api/v1/auth/login/",
            data={
                "email": "unverified@example.com",
                "password": "StrongPass!123",
            },
            format="json",
        )
        self.assertIn(resp.status_code, (400, 401))


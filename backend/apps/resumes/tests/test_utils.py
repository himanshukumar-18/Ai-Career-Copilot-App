from __future__ import annotations

from rest_framework.test import APIClient


def auth_client_for_user(user) -> APIClient:
    client = APIClient()
    refresh = None
    # Obtain token via SimpleJWT refresh token flow using existing endpoint patterns.
    # We keep it light; if endpoint requires verification, set is_verified in factory.
    login_url = "/api/v1/auth/login/"
    resp = client.post(
        login_url,
        data={
            "email": user.email,
            "password": "StrongPass!123",
        },
        format="json",
    )
    if resp.status_code not in (200, 201):
        raise AssertionError(f"Login failed: {resp.status_code} {resp.content}")

    access = resp.data.get("access") or resp.data.get("access_token")
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
    return client


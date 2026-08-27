from rest_framework.permissions import BasePermission
from apps.accounts.models.user import User


class IsAdminUserPermission(BasePermission):
    """
    Permission check for platform admins.
    Ensures user is authenticated and has role == 'ADMIN', is_staff, or is_superuser.
    """

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (
                getattr(request.user, "role", None) == User.Role.ADMIN
                or request.user.is_staff
                or request.user.is_superuser
            )
        )

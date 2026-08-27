from rest_framework.permissions import (
    BasePermission,
)


class IsResumeOwner(
    BasePermission
):

    message = (
        "You do not have permission "
        "to access this resource."
    )

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):

        if hasattr(
            obj,
            "user",
        ):

            return (
                obj.user == request.user
            )

        if hasattr(
            obj,
            "resume",
        ):

            return (
                obj.resume.user
                == request.user
            )

        return False
from django.core.cache import cache
from rest_framework.generics import (
    RetrieveUpdateAPIView
)


from rest_framework.permissions import (
    IsAuthenticated
)

from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
)

from apps.profiles.model.profile import Profile

from .serializers import (
    ProfileSerializer
)
from config.responses import ApiResponse, ApiResponseMixin


class ProfileAPIView(
    ApiResponseMixin,
    RetrieveUpdateAPIView
):
    
    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    permission_classes = [
        IsAuthenticated
    ]

    serializer_class = (
        ProfileSerializer
    )

    def get_object(self):

        return self.request.user.profile
    
    def retrieve(
        self,
        request,
        *args,
        **kwargs
    ):
        cache_key = (
            f"profile_{request.user.id}"
        )

        cached_profile = cache.get(
            cache_key
        )

        if cached_profile:
            return ApiResponse.success(
                request=request,
                data=cached_profile,
                message="Profile fetched successfully.",
            )

        profile = self.get_object()

        serializer = self.get_serializer(
            profile
        )

        cache.set(
            cache_key,
            serializer.data,
            timeout=300,
        )

        return ApiResponse.success(
            request=request,
            data=serializer.data,
            message="Profile fetched successfully.",
        )
    
    def update(
        self,
        request,
        *args,
        **kwargs,
    ):
        response = super().update(
            request,
            *args,
            **kwargs
        )

        cache.delete(
            f"profile_{request.user.id}"
        )

        return response

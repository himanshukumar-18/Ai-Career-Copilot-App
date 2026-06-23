from django.core.cache import cache
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import (
    RetrieveUpdateAPIView
)


from rest_framework.permissions import (
    IsAuthenticated
)

from apps.profiles.model.profile import Profile

from .serializers import (
    ProfileSerializer
)


class ProfileAPIView(
    RetrieveUpdateAPIView
):

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
            f"profile_{request.user.id}",
        )
        
        cached_profile = cache.get(
            cache_key
        )
        
        if cached_profile:
            
            return Response(
                cached_profile
            )
        
        profile = self.get_serializer(
            profile
        )
        
        cache.set(
            cache_key,
            serializer.data,
            timeout=300,
        )
        
        return Response(
            serializer.data
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
        
        return Response
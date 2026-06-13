from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.views import (
    TokenObtainPairView
)

from .serializers import (
    RegisterSerializer,
    UserSerializer,
    EmailTokenObtainPairSerializer
)

from apps.accounts.models import User


class RegisterAPIView(
    generics.CreateAPIView
):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class LoginAPIView(
    TokenObtainPairView
):
    serializer_class = (
        EmailTokenObtainPairSerializer
    )


class MeAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        serializer = UserSerializer(
            request.user
        )

        return Response(
            serializer.data
        )
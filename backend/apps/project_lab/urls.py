from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import GenerateProjectsView, UserProjectViewSet

router = DefaultRouter()
router.register(r"my-projects", UserProjectViewSet, basename="user-project")

urlpatterns = [
    path("generate/", GenerateProjectsView.as_view(), name="project-generate"),
    path("", include(router.urls)),
]
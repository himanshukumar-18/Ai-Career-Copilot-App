"""URL routing for the interview_prep app."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.interview_prep.views import (
    GeneratePrepPlanView,
    GenerateQuestionsView,
    InterviewReadinessView,
    MockSessionTurnView,
    PrepPlanViewSet,
    StartMockSessionView,
    StudyTodayView,
    SubmitAnswerView,
)

app_name = "interview_prep"

router = DefaultRouter()
router.register("plans", PrepPlanViewSet, basename="prep-plan")

urlpatterns = [
    path("generate/", GeneratePrepPlanView.as_view(), name="generate-plan"),
    path("study-today/", StudyTodayView.as_view(), name="study-today"),
    path("plans/<uuid:plan_id>/questions/generate/", GenerateQuestionsView.as_view(), name="generate-questions"),
    path("questions/<uuid:question_id>/submit/", SubmitAnswerView.as_view(), name="submit-answer"),
    path("plans/<uuid:plan_id>/mock/start/", StartMockSessionView.as_view(), name="start-mock"),
    path("mock/<uuid:session_id>/turn/", MockSessionTurnView.as_view(), name="mock-turn"),
    path("plans/<uuid:plan_id>/readiness/", InterviewReadinessView.as_view(), name="readiness"),
    path("", include(router.urls)),
]

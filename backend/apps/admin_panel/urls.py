from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.admin_panel.views import (
    AdminDashboardStatsView,
    AdminStudentViewSet,
    AdminCareerRoleViewSet,
    AdminResourceViewSet,
    AdminResumeListView,
    AdminAIMonitoringView,
    AdminAnalyticsView,
    AdminHealthView,
    AdminSettingsView,
)

app_name = "admin_panel"

router = DefaultRouter()
router.register("students", AdminStudentViewSet, basename="admin-students")
router.register("career-roles", AdminCareerRoleViewSet, basename="admin-career-roles")

urlpatterns = [
    path("dashboard/stats/", AdminDashboardStatsView.as_view(), name="admin-dashboard-stats"),
    path("resources/", AdminResourceViewSet.as_view(), name="admin-resources"),
    path("resumes/", AdminResumeListView.as_view(), name="admin-resumes"),
    path("ai-monitoring/", AdminAIMonitoringView.as_view(), name="admin-ai-monitoring"),
    path("analytics/", AdminAnalyticsView.as_view(), name="admin-analytics"),
    path("health/", AdminHealthView.as_view(), name="admin-health"),
    path("settings/", AdminSettingsView.as_view(), name="admin-settings"),
    path("", include(router.urls)),
]

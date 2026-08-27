"""Django admin configuration for the interview_prep app."""

from django.contrib import admin

from apps.interview_prep.models import (
    InterviewPrepPlan,
    InterviewQuestion,
    InterviewReadiness,
    MockInterviewSession,
    MockInterviewTurn,
    PrepResource,
    PrepTopic,
    QuestionAttempt,
)


class PrepResourceInline(admin.TabularInline):
    model = PrepResource
    extra = 1


class PrepTopicInline(admin.StackedInline):
    model = PrepTopic
    extra = 1


@admin.register(InterviewPrepPlan)
class InterviewPrepPlanAdmin(admin.ModelAdmin):
    list_display = ("target_role", "user", "experience_level", "overall_readiness_score", "is_active", "created_at")
    list_filter = ("experience_level", "is_active", "created_at")
    search_fields = ("target_role", "company_name", "user__email")
    inlines = [PrepTopicInline]


@admin.register(PrepTopic)
class PrepTopicAdmin(admin.ModelAdmin):
    list_display = ("title", "plan", "category", "difficulty", "priority", "proficiency_status")
    list_filter = ("category", "difficulty", "proficiency_status")
    search_fields = ("title", "plan__target_role")
    inlines = [PrepResourceInline]


@admin.register(InterviewQuestion)
class InterviewQuestionAdmin(admin.ModelAdmin):
    list_display = ("question_text_short", "plan", "category", "source_type", "difficulty")
    list_filter = ("category", "source_type", "difficulty")
    search_fields = ("question_text", "plan__target_role")

    def question_text_short(self, obj):
        return obj.question_text[:60] + "..." if len(obj.question_text) > 60 else obj.question_text


@admin.register(QuestionAttempt)
class QuestionAttemptAdmin(admin.ModelAdmin):
    list_display = ("question", "user", "score", "is_correct", "created_at")
    list_filter = ("is_correct", "created_at")


class MockTurnInline(admin.TabularInline):
    model = MockInterviewTurn
    extra = 0


@admin.register(MockInterviewSession)
class MockInterviewSessionAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "category", "status", "overall_score", "created_at")
    list_filter = ("status", "category")
    inlines = [MockTurnInline]


@admin.register(InterviewReadiness)
class InterviewReadinessAdmin(admin.ModelAdmin):
    list_display = ("user", "plan", "technical_score", "behavioral_score", "project_score", "overall_score", "created_at")

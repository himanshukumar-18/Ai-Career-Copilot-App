"""Django Admin configurations for the roadmaps app."""

from django.contrib import admin

from apps.roadmaps.models import (
    CareerRole,
    Roadmap,
    RoadmapPhase,
    RoadmapResource,
    RoadmapStep,
    UserRoadmapProgress,
    UserStepProgress,
)


class RoadmapPhaseInline(admin.TabularInline):
    model = RoadmapPhase
    extra = 0
    ordering = ["order"]
    fields = ["order", "title", "estimated_hours"]


class RoadmapResourceInline(admin.TabularInline):
    model = RoadmapResource
    extra = 0
    ordering = ["order"]
    fields = ["order", "title", "resource_type", "url", "is_free"]


class RoadmapStepInline(admin.TabularInline):
    model = RoadmapStep
    extra = 0
    ordering = ["order"]
    fields = ["order", "title", "estimated_hours", "difficulty"]


@admin.register(CareerRole)
class CareerRoleAdmin(admin.ModelAdmin):
    list_display = ["title", "slug", "category", "difficulty", "estimated_duration_weeks", "is_active", "created_at"]
    list_filter = ["category", "difficulty", "is_active"]
    search_fields = ["title", "slug", "description", "category"]
    prepopulated_fields = {"slug": ("title",)}
    ordering = ["title"]


@admin.register(Roadmap)
class RoadmapAdmin(admin.ModelAdmin):
    list_display = ["career_role", "title", "version", "total_phases", "is_published", "created_at"]
    list_filter = ["is_published", "version"]
    search_fields = ["title", "career_role__title", "description"]
    inlines = [RoadmapPhaseInline]


@admin.register(RoadmapPhase)
class RoadmapPhaseAdmin(admin.ModelAdmin):
    list_display = ["roadmap", "order", "title", "estimated_hours", "created_at"]
    list_filter = ["roadmap__career_role"]
    search_fields = ["title", "description", "learning_objective"]
    ordering = ["roadmap", "order"]
    inlines = [RoadmapStepInline]


@admin.register(RoadmapStep)
class RoadmapStepAdmin(admin.ModelAdmin):
    list_display = ["phase", "order", "title", "difficulty", "estimated_hours", "prerequisite_step"]
    list_filter = ["difficulty", "phase__roadmap__career_role"]
    search_fields = ["title", "description", "learning_objective", "completion_criteria"]
    ordering = ["phase", "order"]
    inlines = [RoadmapResourceInline]


@admin.register(RoadmapResource)
class RoadmapResourceAdmin(admin.ModelAdmin):
    list_display = ["title", "step", "resource_type", "provider", "is_free", "order"]
    list_filter = ["resource_type", "is_free", "provider"]
    search_fields = ["title", "url", "provider"]
    ordering = ["step", "order"]


class UserStepProgressInline(admin.TabularInline):
    model = UserStepProgress
    extra = 0
    readonly_fields = ["step", "status", "notes", "completed_at", "updated_at"]
    can_delete = False


@admin.register(UserRoadmapProgress)
class UserRoadmapProgressAdmin(admin.ModelAdmin):
    list_display = ["user", "career_role", "status", "completion_percentage", "current_step", "started_at", "last_activity_at"]
    list_filter = ["status", "career_role"]
    search_fields = ["user__email", "career_role__title"]
    readonly_fields = ["started_at", "completed_at", "last_activity_at", "created_at", "updated_at"]
    inlines = [UserStepProgressInline]


@admin.register(UserStepProgress)
class UserStepProgressAdmin(admin.ModelAdmin):
    list_display = ["user_progress", "step", "status", "completed_at", "updated_at"]
    list_filter = ["status"]
    search_fields = ["user_progress__user__email", "step__title", "notes"]
    readonly_fields = ["completed_at", "updated_at"]

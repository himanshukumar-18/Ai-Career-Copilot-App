from django.contrib import admin

from .models import GeneratedProject, UserProject


@admin.register(GeneratedProject)
class GeneratedProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "difficulty", "requested_count", "created_at")
    list_filter = ("difficulty", "created_at")
    search_fields = ("title", "description", "user__email")


@admin.register(UserProject)
class UserProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "status", "difficulty", "started_at", "completed_at", "updated_at")
    list_filter = ("status", "difficulty", "created_at", "updated_at")
    search_fields = ("title", "description", "notes", "user__email")

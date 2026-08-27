from django.db import transaction
from django.shortcuts import get_object_or_404

from apps.resumes.model import Project


class ProjectService:

    @staticmethod
    def list(
        resume,
    ):

        return Project.objects.filter(
            resume=resume
        ).order_by(
            "display_order",
            "-created_at",
        )

    @staticmethod
    def get(
        project_id,
        resume,
    ):

        return get_object_or_404(
            Project,
            id=project_id,
            resume=resume,
        )

    @staticmethod
    @transaction.atomic
    def create(
        resume,
        validated_data,
    ):

        return Project.objects.create(
            resume=resume,
            **validated_data,
        )

    @staticmethod
    @transaction.atomic
    def update(
        project,
        validated_data,
    ):

        for field, value in validated_data.items():

            setattr(
                project,
                field,
                value,
            )

        project.save()

        return project

    @staticmethod
    @transaction.atomic
    def delete(
        project,
    ):

        project.delete()

    @staticmethod
    @transaction.atomic
    def reorder(
        resume,
        ordered_ids,
    ):

        for index, pk in enumerate(
            ordered_ids
        ):

            Project.objects.filter(
                id=pk,
                resume=resume,
            ).update(
                display_order=index
            )

        return Project.objects.filter(
            resume=resume
        ).order_by(
            "display_order"
        )

    @staticmethod
    @transaction.atomic
    def feature(
        project,
    ):

        Project.objects.filter(
            resume=project.resume,
            is_featured=True,
        ).update(
            is_featured=False,
        )

        project.is_featured = True

        project.save(
            update_fields=[
                "is_featured",
            ]
        )

        return project

    @staticmethod
    @transaction.atomic
    def unfeature(
        project,
    ):

        project.is_featured = False

        project.save(
            update_fields=[
                "is_featured",
            ]
        )

        return project
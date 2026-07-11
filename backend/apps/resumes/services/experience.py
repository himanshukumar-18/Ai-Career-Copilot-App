from django.shortcuts import get_object_or_404
from django.db import transaction

from apps.resumes.model import (
    Experience,
    Resume,
)


class ExperienceService:

    @staticmethod
    def list(
        resume,
    ):

        return Experience.objects.filter(
            resume=resume
        ).order_by(
            "display_order",
            "-start_date",
        )

    @staticmethod
    def get(
        experience_id,
        resume,
    ):

        return get_object_or_404(
            Experience,
            id=experience_id,
            resume=resume,
        )

    @staticmethod
    @transaction.atomic
    def create(
        resume,
        validated_data,
    ):

        return Experience.objects.create(
            resume=resume,
            **validated_data,
        )

    @staticmethod
    @transaction.atomic
    def update(
        experience,
        validated_data,
    ):

        for field, value in validated_data.items():

            setattr(
                experience,
                field,
                value,
            )

        experience.save()

        return experience

    @staticmethod
    @transaction.atomic
    def delete(
        experience,
    ):

        experience.delete()

    @staticmethod
    @transaction.atomic
    def reorder(
        resume,
        ordered_ids,
    ):

        for index, pk in enumerate(
            ordered_ids
        ):

            Experience.objects.filter(
                id=pk,
                resume=resume,
            ).update(
                display_order=index
            )

        return Experience.objects.filter(
            resume=resume
        ).order_by(
            "display_order"
        )
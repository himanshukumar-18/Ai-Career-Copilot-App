from django.shortcuts import get_object_or_404
from django.db import transaction

from apps.resumes.model import (
    Education,
    Resume
)


class EducationService:

    @staticmethod
    def list(
        resume,
    ):

        return Education.objects.filter(
            resume=Resume
        ).order_by(
            "display_order",
            "-start_date",
        )

    @staticmethod
    def get(
        education_id,
        resume,
    ):

        return get_object_or_404(
            Education,
            id=education_id,
            resume=resume,
        )

    @staticmethod
    @transaction.atomic
    def create(
        resume,
        validated_data,
    ):

        return Education.objects.create(
            resume=resume,
            **validated_data,
        )

    @staticmethod
    @transaction.atomic
    def update(
        education,
        validated_data,
    ):

        for field, value in validated_data.items():

            setattr(
                education,
                field,
                value,
            )

        education.save()

        return education

    @staticmethod
    @transaction.atomic
    def delete(
        education,
    ):

        education.delete()

    @staticmethod
    @transaction.atomic
    def reorder(
        resume,
        ordered_ids,
    ):

        for index, pk in enumerate(
            ordered_ids
        ):

            Education.objects.filter(
                id=pk,
                resume=resume,
            ).update(
                display_order=index
            )

        return Education.objects.filter(
            resume=resume
        ).order_by(
            "display_order"
        )
from django.db import transaction
from django.shortcuts import get_object_or_404

from apps.resumes.model import Skill


class SkillService:

    @staticmethod
    def list(
        resume,
    ):

        return Skill.objects.filter(
            resume=resume
        ).order_by(
            "display_order",
            "name",
        )

    @staticmethod
    def get(
        skill_id,
        resume,
    ):

        return get_object_or_404(
            Skill,
            id=skill_id,
            resume=resume,
        )

    @staticmethod
    @transaction.atomic
    def create(
        resume,
        validated_data,
    ):

        return Skill.objects.create(
            resume=resume,
            **validated_data,
        )

    @staticmethod
    @transaction.atomic
    def bulk_create(
        resume,
        skills,
    ):

        objects = [

            Skill(
                resume=resume,
                **skill,
            )

            for skill in skills

        ]

        Skill.objects.bulk_create(
            objects
        )

        return Skill.objects.filter(
            resume=resume
        )

    @staticmethod
    @transaction.atomic
    def update(
        skill,
        validated_data,
    ):

        for field, value in validated_data.items():

            setattr(
                skill,
                field,
                value,
            )

        skill.save()

        return skill

    @staticmethod
    @transaction.atomic
    def delete(
        skill,
    ):

        skill.delete()

    @staticmethod
    @transaction.atomic
    def reorder(
        resume,
        ordered_ids,
    ):

        for index, pk in enumerate(
            ordered_ids
        ):

            Skill.objects.filter(
                id=pk,
                resume=resume,
            ).update(
                display_order=index
            )

        return Skill.objects.filter(
            resume=resume
        ).order_by(
            "display_order"
        )
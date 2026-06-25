from django.db import transaction
from django.shortcuts import get_object_or_404


class BaseResumeService:

    model = None

    @classmethod
    def list(cls, resume):

        return cls.model.objects.filter(
            resume=resume
        ).order_by(
            "display_order"
        )

    @classmethod
    def get(cls, object_id, resume):

        return get_object_or_404(
            cls.model,
            id=object_id,
            resume=resume,
        )

    @classmethod
    @transaction.atomic
    def create(cls, resume, validated_data):

        return cls.model.objects.create(
            resume=resume,
            **validated_data,
        )

    @classmethod
    @transaction.atomic
    def update(cls, instance, validated_data):

        for field, value in validated_data.items():

            setattr(
                instance,
                field,
                value,
            )

        instance.save()

        return instance

    @classmethod
    @transaction.atomic
    def delete(cls, instance):

        instance.delete()

    @classmethod
    @transaction.atomic
    def reorder(cls, resume, ordered_ids):

        for index, pk in enumerate(ordered_ids):

            cls.model.objects.filter(
                id=pk,
                resume=resume,
            ).update(
                display_order=index,
            )

        return cls.list(resume)
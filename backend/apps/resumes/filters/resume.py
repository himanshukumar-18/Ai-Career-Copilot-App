import django_filters

from apps.resumes.model import Resume


class ResumeFilter(
    django_filters.FilterSet
):

    title = django_filters.CharFilter(
        lookup_expr="icontains",
    )

    template = django_filters.CharFilter()

    is_default = django_filters.BooleanFilter()

    is_public = django_filters.BooleanFilter()

    created_after = django_filters.DateFilter(

        field_name="created_at",

        lookup_expr="gte",

    )

    created_before = django_filters.DateFilter(

        field_name="created_at",

        lookup_expr="lte",

    )

    class Meta:

        model = Resume

        fields = [

            "template",

            "is_default",

            "is_public",

        ]
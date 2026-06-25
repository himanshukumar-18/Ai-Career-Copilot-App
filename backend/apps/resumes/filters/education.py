import django_filters

from apps.resumes.model import Education


class EducationFilter(
    django_filters.FilterSet
):

    institution = django_filters.CharFilter(
        lookup_expr="icontains",
    )

    degree = django_filters.CharFilter(
        lookup_expr="icontains",
    )

    currently_studying = (
        django_filters.BooleanFilter()
    )

    class Meta:

        model = Education

        fields = [

            "currently_studying",

        ]
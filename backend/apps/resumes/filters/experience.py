class ExperienceFilter(
    django_filters.FilterSet
):

    company = django_filters.CharFilter(
        lookup_expr="icontains",
    )

    position = django_filters.CharFilter(
        lookup_expr="icontains",
    )

    currently_working = (
        django_filters.BooleanFilter()
    )

    class Meta:

        model = Experience

        fields = [

            "currently_working",

        ]
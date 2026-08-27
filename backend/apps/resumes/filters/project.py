class ProjectFilter(
    django_filters.FilterSet
):

    is_featured = (
        django_filters.BooleanFilter()
    )

    class Meta:

        model = Project

        fields = [

            "is_featured",

        ]
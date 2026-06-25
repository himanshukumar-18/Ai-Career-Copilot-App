class SkillFilter(
    django_filters.FilterSet
):

    category = django_filters.CharFilter()

    proficiency = django_filters.CharFilter()

    class Meta:

        model = Skill

        fields = [

            "category",

            "proficiency",

        ]
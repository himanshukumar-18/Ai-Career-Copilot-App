from rest_framework import serializers

from apps.profiles.model.profile import Profile

class ProfileSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = Profile
        fields = "__all__"
        
        read_only_fields = (
            "user",
        )
from django.db import models
from django.conf import settings
from cloudinary.models import CloudinaryField

class Profile(models.Model):
    
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile"
    )
    
    profile_picture = CloudinaryField(
        "profile",
        blank=True,
        null=True
    )
    
    headline = models.CharField(
        max_length=25,
        blank=True
    )
    
    bio = models.TextField(
        blank=True
    )
    
    phone = models.CharField(
        max_length=100,
        blank=True
    )
    
    location = models.CharField(
        max_length=100,
        blank=True
    )
    
    github_url = models.URLField(
        blank=True
    )
    
    linkedin_url = models.URLField(
        blank=True
    )
    
    portfolio_url = models.URLField(
        blank=True
    )
    
    career_goal = models.TextField(
        blank=True
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    
    updated_at = models.DateTimeField(
        auto_now=True
    )
    
    def __str__(self):
        return self.user.email
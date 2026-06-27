from __future__ import annotations

from datetime import date

from apps.accounts.models import User
from apps.resumes.model import (
    Resume,
    Education,
    Experience,
    Skill,
    Project,
    Certification,
    Language,
    Achievement,
    Reference,
    SocialLink,
    CustomSection,
    ResumeProfile,
)


def create_user(**kwargs) -> User:
    defaults = {
        "email": "user@example.com",
        "first_name": "User",
        "last_name": "Test",
        "role": "student",
        "is_verified": True,
    }
    defaults.update(kwargs)
    user = User(**defaults)
    user.set_password("StrongPass!123")
    user.save()
    return user


def create_resume(user: User, **kwargs) -> Resume:
    defaults = {
        "title": "My Resume",
        "template": "template-1",
        "theme_color": "#ffffff",
        "font_family": "Inter",
        "font_size": 12,
        "is_default": False,
        "is_public": False,
    }
    defaults.update(kwargs)
    resume = Resume.objects.create(user=user, **defaults)
    ResumeProfile.objects.create(resume=resume)
    return resume


def create_education(resume: Resume, **kwargs) -> Education:
    defaults = {
        "degree": "B.Tech",
        "institution": "Test University",
        "start_date": date(2020, 1, 1),
        "end_date": date(2024, 1, 1),
        "display_order": 0,
    }
    defaults.update(kwargs)
    return Education.objects.create(resume=resume, **defaults)


def create_experience(resume: Resume, **kwargs) -> Experience:
    defaults = {
        "title": "Engineer",
        "company": "Test Co",
        "start_date": date(2022, 1, 1),
        "end_date": date(2023, 1, 1),
        "display_order": 0,
    }
    defaults.update(kwargs)
    return Experience.objects.create(resume=resume, **defaults)


def create_skill(resume: Resume, **kwargs) -> Skill:
    defaults = {
        "name": "Python",
        "level": "advanced",
        "display_order": 0,
    }
    defaults.update(kwargs)
    return Skill.objects.create(resume=resume, **defaults)


def create_project(resume: Resume, **kwargs) -> Project:
    defaults = {
        "name": "Project A",
        "description": "Desc",
        "link": "https://example.com",
        "display_order": 0,
        "created_at": date(2024, 1, 1),
        "is_featured": False,
    }
    defaults.update(kwargs)
    # created_at field may be auto; keep minimal if it errors
    try:
        return Project.objects.create(resume=resume, **defaults)
    except TypeError:
        defaults.pop("created_at", None)
        return Project.objects.create(resume=resume, **defaults)


def create_certification(resume: Resume, **kwargs) -> Certification:
    defaults = {
        "name": "Cert A",
        "issuer": "Issuer",
        "issue_date": date(2023, 1, 1),
        "display_order": 0,
    }
    defaults.update(kwargs)
    return Certification.objects.create(resume=resume, **defaults)


def create_language(resume: Resume, **kwargs) -> Language:
    defaults = {
        "name": "English",
        "level": "C1",
        "display_order": 0,
    }
    defaults.update(kwargs)
    return Language.objects.create(resume=resume, **defaults)


def create_achievement(resume: Resume, **kwargs) -> Achievement:
    defaults = {
        "title": "Achievement",
        "description": "Desc",
        "date": date(2022, 1, 1),
        "display_order": 0,
    }
    defaults.update(kwargs)
    return Achievement.objects.create(resume=resume, **defaults)


def create_reference(resume: Resume, **kwargs) -> Reference:
    defaults = {
        "name": "Ref Person",
        "company": "Ref Co",
        "email": "ref@example.com",
        "display_order": 0,
    }
    defaults.update(kwargs)
    return Reference.objects.create(resume=resume, **defaults)


def create_social_link(resume: Resume, **kwargs) -> SocialLink:
    defaults = {
        "platform": "linkedin",
        "url": "https://linkedin.com/in/test",
        "display_order": 0,
    }
    defaults.update(kwargs)
    return SocialLink.objects.create(resume=resume, **defaults)


def create_custom_section(resume: Resume, **kwargs) -> CustomSection:
    defaults = {
        "title": "Section",
        "content": "Content",
        "display_order": 0,
    }
    defaults.update(kwargs)
    return CustomSection.objects.create(resume=resume, **defaults)


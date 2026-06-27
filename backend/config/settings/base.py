from pathlib import Path
from decouple import config
import cloudinary
from config.logging import LOGGING as DJANGO_LOGGING



RATELIMIT_VIEW = (
    "config.ratelimit.custom_ratelimit_view"
)

BASE_DIR = Path(__file__).resolve().parent.parent.parent

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "rest_framework",
    "corsheaders",
    "cloudinary",
    "cloudinary_storage",
    "django_filters",
    "drf_spectacular",

    "apps.accounts",
    "apps.profiles",
    "apps.skills",
    "apps.projects",
    "apps.resumes",
    "apps.ai_engine",
    "apps.roadmaps",
]

MIDDLEWARE = [
     "corsheaders.middleware.CorsMiddleware",
    
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config("DB_NAME"),
        "USER": config("DB_USER"),
        "PASSWORD": config("DB_PASSWORD"),
        "HOST": config("DB_HOST"),
        "PORT": config("DB_PORT"),
    }
}

SECRET_KEY = config("SECRET_KEY")

DEBUG = config("DEBUG", cast=bool, default=True)

ALLOWED_HOSTS = []

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

STATIC_URL = "static/"
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"
STATIC_ROOT = BASE_DIR / "staticfiles"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "accounts.User"

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    
    "DEFAULT_PAGINATION_CLASS": (

        "config.pagination.StandardResultsPagination"

    ),

    "PAGE_SIZE": 10,
    
    "DEFAULT_FILTER_BACKENDS": [

        "django_filters.rest_framework.DjangoFilterBackend",

        "rest_framework.filters.SearchFilter",

        "rest_framework.filters.OrderingFilter",

    ],
    
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    
    "EXCEPTION_HANDLER": "config.exception_handler.custom_exception_handler"
}

GOOGLE_CLIENT_ID = config(
    "GOOGLE_CLIENT_ID"
)

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = config("EMAIL_HOST", default="")
EMAIL_PORT = config("EMAIL_PORT", cast=int, default=587)
EMAIL_HOST_USER = config("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD", default="")
EMAIL_USE_TLS = config("EMAIL_USE_TLS", cast=bool, default=True)


CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",

        "LOCATION": "redis://redis:6379/1",

        "OPTIONS": {
            "CLIENT_CLASS":
            "django_redis.client.DefaultClient",
        },
    }
}

cloudinary.config(
    cloud_name=config(
        "CLOUDINARY_CLOUD_NAME"
    ),

    api_key=config(
        "CLOUDINARY_API_KEY"
    ),

    api_secret=config(
        "CLOUDINARY_API_SECRET"
    ),
)

SPECTACULAR_SETTINGS = {

    "TITLE": "AI Career Copilot API",

    "DESCRIPTION": """
Production-ready REST API for AI Career Copilot.

Features

- Authentication
- User Profile
- Resume Builder
- AI Resume Generator

""",

    "VERSION": "1.0.0",

    "SERVE_INCLUDE_SCHEMA": False,

    "COMPONENT_SPLIT_REQUEST": True,

    "SCHEMA_PATH_PREFIX": "/api/v1",

    "CONTACT": {

        "name": "Himanshu Kumar",

        "email": "rajh5343@example.com",

    },

    "LICENSE": {

        "name": "MIT",

    },

}

LOGGING = DJANGO_LOGGING

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
    "apps.project_lab",
    "apps.resumes",
    "apps.roadmaps",
    "apps.resume_ai",
    "apps.interview_prep",
    "apps.admin_panel",
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

import socket

def _get_db_host():
    host = config("DB_HOST", default="localhost")
    if host == "postgres":
        try:
            socket.gethostbyname("postgres")
            return "postgres"
        except socket.gaierror:
            return "localhost"
    return host

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config("DB_NAME"),
        "USER": config("DB_USER"),
        "PASSWORD": config("DB_PASSWORD"),
        "HOST": _get_db_host(),
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


def _get_redis_location():
    try:
        socket.gethostbyname("redis")
        return "redis://redis:6379/1"
    except socket.gaierror:
        return "redis://127.0.0.1:6379/1"

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",

        "LOCATION": _get_redis_location(),

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

GROQ_API_KEY = config("GROQ_API_KEY", default="")
LLM_PROVIDER = config("LLM_PROVIDER", default="groq")
LLM_MODEL = config(
    "LLM_MODEL",
    default="openai/gpt-oss-120b",
)

LLM_TEMPERATURE = config(
    "LLM_TEMPERATURE",
    default=0.2,
)

LLM_MAX_TOKENS = config(
    "LLM_MAX_TOKENS",
    default=4096,
)

LLM_TIMEOUT = config(
    "LLM_TIMEOUT",
    default=60,
)

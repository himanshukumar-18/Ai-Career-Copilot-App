import logging
import os

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

LOG_DIR = os.path.join(
    BASE_DIR,
    "logs",
)

os.makedirs(
    LOG_DIR,
    exist_ok=True,
)

APP_LOG_FILE = os.path.join(
    LOG_DIR,
    "app.log",
)

ERROR_LOG_FILE = os.path.join(
    LOG_DIR,
    "error.log",
)

project_logger = logging.getLogger(
    "ai_career_copilot"
)

LOGGING = {

    "version": 1,

    "disable_existing_loggers": False,

    "formatters": {

        "standard": {

            "format":
                "[{asctime}] [{levelname}] "
                "{name} | {message}",

            "style": "{",

        },

    },

    "handlers": {

        "console": {

            "class": "logging.StreamHandler",

            "formatter": "standard",

        },

        "app_file": {

            "class": "logging.FileHandler",

            "filename": APP_LOG_FILE,

            "formatter": "standard",

        },

        "error_file": {

            "class": "logging.FileHandler",

            "filename": ERROR_LOG_FILE,

            "formatter": "standard",

            "level": "ERROR",

        },

    },

    "loggers": {

        "django": {

            "handlers": [

                "console",

                "app_file",

                "error_file",

            ],

            "level": "INFO",

            "propagate": True,

        },

        "ai_career_copilot": {

            "handlers": [

                "console",

                "app_file",

                "error_file",

            ],

            "level": "INFO",

            "propagate": False,

        },

    },

}

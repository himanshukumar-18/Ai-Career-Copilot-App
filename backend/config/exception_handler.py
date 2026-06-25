from rest_framework import status
from rest_framework.exceptions import (
    APIException,
    AuthenticationFailed,
    MethodNotAllowed,
    NotAuthenticated,
    NotFound,
    ParseError,
    PermissionDenied,
    Throttled,
    ValidationError,
)
from rest_framework.views import exception_handler

from config.responses import ApiResponse


def _detail_message(data, default):

    if isinstance(data, dict):

        detail = data.get("detail")

        if detail:

            return str(detail)

    if isinstance(data, list) and data:

        return str(data[0])

    if isinstance(data, str):

        return data

    return default


def custom_exception_handler(
    exc,
    context,
):

    request = context.get("request")

    response = exception_handler(
        exc,
        context,
    )

    if response is None:

        return ApiResponse.server_error(
            request=request,
            message="Internal server error.",
        )

    errors = response.data

    if isinstance(exc, ValidationError):

        return ApiResponse.validation_error(
            request=request,
            errors=errors,
            message="Validation failed.",
        )

    if isinstance(exc, ParseError):

        return ApiResponse.error(
            request=request,
            errors=errors,
            message=_detail_message(
                errors,
                "Malformed request.",
            ),
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    if isinstance(
        exc,
        (
            AuthenticationFailed,
            NotAuthenticated,
        ),
    ):

        return ApiResponse.unauthorized(
            request=request,
            message=_detail_message(
                errors,
                "Authentication failed.",
            ),
        )

    if isinstance(exc, PermissionDenied):

        return ApiResponse.forbidden(
            request=request,
            message=_detail_message(
                errors,
                "Permission denied.",
            ),
        )

    if isinstance(exc, NotFound):

        return ApiResponse.not_found(
            request=request,
            message=_detail_message(
                errors,
                "Resource not found.",
            ),
        )

    if isinstance(exc, MethodNotAllowed):

        return ApiResponse.error(
            request=request,
            errors=errors,
            message=_detail_message(
                errors,
                "Method not allowed.",
            ),
            status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    if isinstance(exc, Throttled):

        return ApiResponse.too_many_requests(
            request=request,
            errors=errors,
            message=_detail_message(
                errors,
                "Too many requests.",
            ),
        )

    if isinstance(exc, APIException):

        return ApiResponse.error(
            request=request,
            errors=errors,
            message=_detail_message(
                errors,
                "Request failed.",
            ),
            status_code=response.status_code,
        )

    return ApiResponse.server_error(
        request=request,
        message="Internal server error.",
    )

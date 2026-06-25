from django.utils import timezone

from rest_framework import status
from rest_framework.response import Response


class ApiResponse:

    @staticmethod
    def _response(
        *,
        success,
        message,
        request=None,
        data=None,
        errors=None,
        status_code=status.HTTP_200_OK,
    ):

        payload = {

            "success": success,

            "message": message,

            "timestamp": timezone.now(),

            "path": (
                request.path
                if request
                else None
            ),

        }

        if data is not None:

            payload["data"] = data

        if errors is not None:

            payload["errors"] = errors

        return Response(
            payload,
            status=status_code,
        )

    @classmethod
    def success(
        cls,
        *,
        request=None,
        data=None,
        message="Success.",
    ):

        return cls._response(

            success=True,

            message=message,

            request=request,

            data=data,

            status_code=status.HTTP_200_OK,

        )

    @classmethod
    def created(
        cls,
        *,
        request=None,
        data=None,
        message="Created successfully.",
    ):

        return cls._response(

            success=True,

            message=message,

            request=request,

            data=data,

            status_code=status.HTTP_201_CREATED,

        )

    @classmethod
    def updated(
        cls,
        *,
        request=None,
        data=None,
        message="Updated successfully.",
    ):

        return cls._response(

            success=True,

            message=message,

            request=request,

            data=data,

            status_code=status.HTTP_200_OK,

        )

    @classmethod
    def deleted(
        cls,
        *,
        request=None,
        message="Deleted successfully.",
    ):

        return cls._response(

            success=True,

            message=message,

            request=request,

            status_code=status.HTTP_204_NO_CONTENT,

        )

    @classmethod
    def error(
        cls,
        *,
        request=None,
        errors=None,
        message="Request failed.",
        status_code=status.HTTP_400_BAD_REQUEST,
    ):

        return cls._response(

            success=False,

            message=message,

            request=request,

            errors=errors,

            status_code=status_code,

        )

    @classmethod
    def validation_error(
        cls,
        *,
        request=None,
        errors=None,
        message="Validation failed.",
    ):

        return cls._response(

            success=False,

            message=message,

            request=request,

            errors=errors,

            status_code=status.HTTP_400_BAD_REQUEST,

        )

    @classmethod
    def unauthorized(
        cls,
        *,
        request=None,
        message="Authentication credentials were not provided.",
    ):

        return cls._response(

            success=False,

            message=message,

            request=request,

            status_code=status.HTTP_401_UNAUTHORIZED,

        )

    @classmethod
    def forbidden(
        cls,
        *,
        request=None,
        message="Permission denied.",
    ):

        return cls._response(

            success=False,

            message=message,

            request=request,

            status_code=status.HTTP_403_FORBIDDEN,

        )

    @classmethod
    def not_found(
        cls,
        *,
        request=None,
        message="Resource not found.",
    ):

        return cls._response(

            success=False,

            message=message,

            request=request,

            status_code=status.HTTP_404_NOT_FOUND,

        )

    @classmethod
    def conflict(
        cls,
        *,
        request=None,
        errors=None,
        message="Conflict.",
    ):

        return cls._response(

            success=False,

            message=message,

            request=request,

            errors=errors,

            status_code=status.HTTP_409_CONFLICT,

        )

    @classmethod
    def too_many_requests(
        cls,
        *,
        request=None,
        message="Too many requests.",
        errors=None,
    ):

        return cls._response(

            success=False,

            message=message,

            request=request,

            errors=errors,

            status_code=status.HTTP_429_TOO_MANY_REQUESTS,

        )

    @classmethod
    def server_error(
        cls,
        *,
        request=None,
        message="Internal server error.",
    ):

        return cls._response(

            success=False,

            message=message,

            request=request,

            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,

        )


class ApiResponseMixin:

    def list(
        self,
        request,
        *args,
        **kwargs,
    ):

        queryset = self.filter_queryset(
            self.get_queryset()
        )

        page = self.paginate_queryset(
            queryset
        )

        if page is not None:

            serializer = self.get_serializer(
                page,
                many=True,
            )

            return self.get_paginated_response(
                serializer.data
            )

        serializer = self.get_serializer(
            queryset,
            many=True,
        )

        return ApiResponse.success(
            request=request,
            data=serializer.data,
            message="Data fetched successfully.",
        )

    def retrieve(
        self,
        request,
        *args,
        **kwargs,
    ):

        instance = self.get_object()

        serializer = self.get_serializer(
            instance
        )

        return ApiResponse.success(
            request=request,
            data=serializer.data,
            message="Data fetched successfully.",
        )

    def create(
        self,
        request,
        *args,
        **kwargs,
    ):

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        self.perform_create(
            serializer
        )

        return ApiResponse.created(
            request=request,
            data=serializer.data,
            message="Created successfully.",
        )

    def update(
        self,
        request,
        *args,
        **kwargs,
    ):

        partial = kwargs.pop(
            "partial",
            False,
        )

        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial,
        )

        serializer.is_valid(
            raise_exception=True
        )

        self.perform_update(
            serializer
        )

        if getattr(
            instance,
            "_prefetched_objects_cache",
            None,
        ):

            instance._prefetched_objects_cache = {}

        return ApiResponse.updated(
            request=request,
            data=serializer.data,
            message="Updated successfully.",
        )

    def partial_update(
        self,
        request,
        *args,
        **kwargs,
    ):

        kwargs["partial"] = True

        return self.update(
            request,
            *args,
            **kwargs,
        )

    def destroy(
        self,
        request,
        *args,
        **kwargs,
    ):

        instance = self.get_object()

        self.perform_destroy(
            instance
        )

        return ApiResponse.deleted(
            request=request,
            message="Deleted successfully.",
        )

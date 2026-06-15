from django.http import JsonResponse


def custom_ratelimit_view(
    request,
    exception
):

    return JsonResponse(
        {
            "detail":
            "Too many requests. Please try again later."
        },
        status=429,
    )
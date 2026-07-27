"""
API views for the Resume AI module.

Handles HTTP request validation, service orchestration,
and structured error response mapping.
"""

from __future__ import annotations

import logging

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from config.responses import ApiResponse, ApiResponseMixin

from apps.resumes.services import ResumeService

from apps.resume_ai.exceptions import (
    AIProviderException,
    AnalysisException,
    FormatterException,
    ParserException,
    PromptBuildException,
    ResumeAIException,
    ValidationException,
)
from apps.resume_ai.serializers import ResumeAnalysisRequestSerializer
from apps.resume_ai.services.analysis_service import AnalysisService

logger = logging.getLogger(__name__)


class ResumeAnalysisAPIView(ApiResponseMixin, APIView):
    """Analyses a resume using the AI pipeline.

    Endpoint:
        POST /api/v1/resume-ai/analyze/

    Authentication:
        JWT Bearer token required.

    Request Body:
        resume_id (int): ID of the authenticated user's resume to analyse.

    Returns:
        200: ResumeAnalysis result as JSON.
        400: Validation errors.
        404: Resume not found or not owned by user.
        503: AI provider unavailable.
        500: Unexpected internal server error.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = ResumeAnalysisRequestSerializer

    def post(self, request: Request) -> Response:
        """Handles POST requests for resume AI analysis.

        Args:
            request: DRF Request object with ``resume_id`` in body.

        Returns:
            DRF Response with analysis data or structured error.
        """
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        resume_id: int = serializer.validated_data["resume_id"]
        user = request.user

        logger.info(
            "Resume analysis requested | user_id=%s | resume_id=%s",
            user.id,
            resume_id,
        )

        # Ownership check: ResumeService.get_resume_by_id raises 404 if not found or not owned
        resume = ResumeService.get_resume_by_id(user, resume_id)

        try:
            analysis = AnalysisService().analyze(resume=resume)

        except ValidationException as exc:
            logger.warning(
                "Validation error during analysis | user_id=%s | resume_id=%s | error=%s",
                user.id,
                resume_id,
                str(exc),
            )
            return ApiResponse.error(
                request=request,
                message=str(exc),
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        except (ParserException, FormatterException, PromptBuildException) as exc:
            logger.error(
                "Pipeline error during analysis | user_id=%s | resume_id=%s | type=%s | error=%s",
                user.id,
                resume_id,
                type(exc).__name__,
                str(exc),
            )
            return ApiResponse.error(
                request=request,
                message="Resume processing failed. Please check your resume content and try again.",
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        except AIProviderException as exc:
            logger.error(
                "AI provider error | user_id=%s | resume_id=%s | error=%s",
                user.id,
                resume_id,
                str(exc),
            )
            return ApiResponse.error(
                request=request,
                message="The AI service is temporarily unavailable. Please try again in a moment.",
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        except AnalysisException as exc:
            logger.error(
                "Analysis error | user_id=%s | resume_id=%s | error=%s",
                user.id,
                resume_id,
                str(exc),
            )
            return ApiResponse.error(
                request=request,
                message="Analysis failed due to an unexpected AI response. Please try again.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        except ResumeAIException as exc:
            # Catch-all for any other resume AI exceptions
            logger.exception(
                "Unhandled ResumeAIException | user_id=%s | resume_id=%s",
                user.id,
                resume_id,
            )
            return ApiResponse.error(
                request=request,
                message="An unexpected error occurred. Please try again later.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        logger.info(
            "Resume analysis completed successfully | user_id=%s | resume_id=%s | overall_score=%d",
            user.id,
            resume_id,
            analysis.scores.overall_score,
        )

        return ApiResponse.success(
            request=request,
            message="Resume analysed successfully.",
            data=analysis.model_dump(),
            status_code=status.HTTP_200_OK,
        )
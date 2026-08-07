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

from apps.resume_ai.exceptions import (
    AnalysisException,
    ChainExecutionException,
    FormatterException,
    LLMConfigurationException,
    ParserException,
    ProviderException,
    ResumeAIException,
    ValidationException,
)
from apps.resume_ai.serializers import (
    ResumeAnalysisRequestSerializer,
    ResumeImproveRequestSerializer,
)
from apps.resume_ai.services.analysis_service import AnalysisService
from apps.resume_ai.services.improvement_service import ImprovementService
from apps.resume_ai.services.parser_service import ParserService

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

        try:
            resume = ParserService.get_optimized_resume(resume_id, user)
        except ParserException:
            # Keep ownership information private by returning the same response.
            return ApiResponse.error(
                request=request,
                message="Resume not found.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

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

        except (ParserException, FormatterException) as exc:
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

        except (LLMConfigurationException, ProviderException) as exc:
            logger.error(
                "AI service error | user_id=%s | resume_id=%s | error_type=%s",
                user.id,
                resume_id,
                type(exc).__name__,
            )
            return ApiResponse.error(
                request=request,
                message="The AI service is temporarily unavailable. Please try again shortly.",
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        except ChainExecutionException as exc:
            logger.warning(
                "Invalid AI response | user_id=%s | resume_id=%s | error_type=%s",
                user.id,
                resume_id,
                type(exc).__name__,
            )
            return ApiResponse.error(
                request=request,
                message="The AI returned an unusable response. Please try again.",
                status_code=status.HTTP_502_BAD_GATEWAY,
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
                message="The AI returned an unusable response. Please try again.",
                status_code=status.HTTP_502_BAD_GATEWAY,
            )

        except ResumeAIException as exc:
            logger.error(
                "Unhandled ResumeAIException | user_id=%s | resume_id=%s | error_type=%s",
                user.id,
                resume_id,
                type(exc).__name__,
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


class ResumeImproveAPIView(ApiResponseMixin, APIView):
    """Generates a reviewable improvement for an owned resume section."""

    permission_classes = [IsAuthenticated]
    serializer_class = ResumeImproveRequestSerializer

    def post(self, request: Request) -> Response:
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        resume_id = serializer.validated_data["resume_id"]
        section = serializer.validated_data["section"]

        try:
            resume = ParserService.get_optimized_resume(resume_id, request.user)
            content = ImprovementService().improve(resume, section)
        except ParserException:
            return ApiResponse.error(
                request=request,
                message="Resume not found.",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        except ValidationException as exc:
            return ApiResponse.error(
                request=request,
                message=str(exc),
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        except (LLMConfigurationException, ProviderException):
            return ApiResponse.error(
                request=request,
                message="The AI service is temporarily unavailable. Please try again shortly.",
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except ResumeAIException:
            logger.exception("Resume improvement failed | resume_id=%s | section=%s", resume_id, section)
            return ApiResponse.error(
                request=request,
                message="Unable to improve this section. Please try again.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return ApiResponse.success(
            request=request,
            message="Resume section improved successfully.",
            data={"section": section, "content": content},
            status_code=status.HTTP_200_OK,
        )

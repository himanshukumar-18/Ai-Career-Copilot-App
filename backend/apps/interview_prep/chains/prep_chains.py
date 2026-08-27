"""LangChain runnable chains for interview preparation AI operations."""

from __future__ import annotations

import logging
from langchain_core.exceptions import OutputParserException
from pydantic import ValidationError

from apps.interview_prep.exceptions import (
    AIGenerationError,
    LLMConfigurationException,
    LLMRequestFailedError,
    PrepGenerationParseError,
)
from apps.interview_prep.llm import LLMProvider
from apps.interview_prep.prompts import (
    build_answer_evaluation_prompt,
    build_mock_interview_prompt,
    build_prep_plan_prompt,
    build_question_generation_prompt,
    build_readiness_assessment_prompt,
    get_evaluation_parser,
    get_mock_parser,
    get_plan_parser,
    get_question_parser,
    get_readiness_parser,
)
from apps.interview_prep.schemas import (
    AIAnswerEvaluationSchema,
    AIInterviewPrepPlanSchema,
    AIInterviewReadinessSchema,
    AIMockInterviewTurnSchema,
    AIQuestionGenerationSchema,
)

logger = logging.getLogger(__name__)


def _to_pydantic(result: Any, schema_cls: Any) -> Any:
    """Safely convert raw dict output from JsonOutputParser into Pydantic schema instance."""
    if isinstance(result, schema_cls):
        return result
    if isinstance(result, dict):
        return schema_cls.model_validate(result)
    return result


def generate_ai_prep_plan(
    student_context: str,
    target_role: str,
    experience_level: str = "intermediate",
    company_name: str = "",
    job_description: str = "",
) -> AIInterviewPrepPlanSchema:
    """Invoke LLM chain to generate a personalized interview preparation plan."""
    llm = LLMProvider.get_llm()
    prompt = build_prep_plan_prompt()
    parser = get_plan_parser()
    full_chain = prompt | llm | parser

    try:
        raw_result = full_chain.invoke(
            {
                "student_context": student_context,
                "target_role": target_role,
                "experience_level": experience_level,
                "company_name": company_name or "Target Company",
                "job_description": job_description or "General Role Requirements",
            }
        )
        return _to_pydantic(raw_result, AIInterviewPrepPlanSchema)
    except (OutputParserException, ValidationError) as exc:
        logger.exception("Failed to parse LLM response for interview prep plan.")
        raise PrepGenerationParseError(
            "Failed to parse AI response into required prep plan format.",
            details={"error": str(exc)},
        ) from exc
    except (LLMConfigurationException, LLMRequestFailedError, PrepGenerationParseError):
        raise
    except Exception as exc:
        logger.exception("Unexpected error during AI prep plan generation.")
        raise AIGenerationError(
            "An error occurred while generating your interview preparation plan.",
            details={"error": str(exc)},
        ) from exc


def generate_ai_questions(
    student_context: str,
    target_role: str,
    topic_title: str = "General",
    question_count: int = 5,
    job_description: str = "",
) -> AIQuestionGenerationSchema:
    """Invoke LLM chain to generate targeted interview questions."""
    llm = LLMProvider.get_llm()
    prompt = build_question_generation_prompt()
    parser = get_question_parser()
    full_chain = prompt | llm | parser

    try:
        raw_result = full_chain.invoke(
            {
                "student_context": student_context,
                "target_role": target_role,
                "topic_title": topic_title,
                "question_count": question_count,
                "job_description": job_description or "General Role Requirements",
            }
        )
        return _to_pydantic(raw_result, AIQuestionGenerationSchema)
    except (OutputParserException, ValidationError) as exc:
        logger.exception("Failed to parse LLM questions response.")
        raise PrepGenerationParseError(
            "Failed to parse AI response into required question format.",
            details={"error": str(exc)},
        ) from exc
    except Exception as exc:
        logger.exception("Unexpected error during AI question generation.")
        raise AIGenerationError(
            "An error occurred while generating interview questions.",
            details={"error": str(exc)},
        ) from exc


def evaluate_ai_answer(
    target_role: str,
    category: str,
    question_text: str,
    user_answer: str,
    ideal_answer_outline: str = "",
    key_points: list = None,
) -> AIAnswerEvaluationSchema:
    """Invoke LLM chain to evaluate candidate answer submission."""
    llm = LLMProvider.get_llm()
    prompt = build_answer_evaluation_prompt()
    parser = get_evaluation_parser()
    full_chain = prompt | llm | parser

    try:
        raw_result = full_chain.invoke(
            {
                "target_role": target_role,
                "category": category,
                "question_text": question_text,
                "user_answer": user_answer,
                "ideal_answer_outline": ideal_answer_outline or "Standard industry answer",
                "key_points": ", ".join(key_points) if key_points else "General accuracy",
            }
        )
        return _to_pydantic(raw_result, AIAnswerEvaluationSchema)
    except (OutputParserException, ValidationError) as exc:
        logger.exception("Failed to parse answer evaluation response.")
        raise PrepGenerationParseError(
            "Failed to parse AI evaluation format.",
            details={"error": str(exc)},
        ) from exc
    except Exception as exc:
        logger.exception("Unexpected error during answer evaluation.")
        raise AIGenerationError(
            "An error occurred while evaluating your answer.",
            details={"error": str(exc)},
        ) from exc


def evaluate_mock_turn(
    target_role: str,
    category: str,
    turn_index: int,
    total_turns: int,
    question_text: str,
    user_answer: str,
) -> AIMockInterviewTurnSchema:
    """Invoke LLM chain for adaptive mock interview turn evaluation & follow-up."""
    llm = LLMProvider.get_llm()
    prompt = build_mock_interview_prompt()
    parser = get_mock_parser()
    full_chain = prompt | llm | parser

    try:
        raw_result = full_chain.invoke(
            {
                "target_role": target_role,
                "category": category,
                "turn_index": turn_index,
                "total_turns": total_turns,
                "question_text": question_text,
                "user_answer": user_answer,
            }
        )
        return _to_pydantic(raw_result, AIMockInterviewTurnSchema)
    except (OutputParserException, ValidationError) as exc:
        logger.exception("Failed to parse mock turn evaluation response.")
        raise PrepGenerationParseError(
            "Failed to parse AI mock turn response.",
            details={"error": str(exc)},
        ) from exc
    except Exception as exc:
        logger.exception("Unexpected error during mock turn evaluation.")
        raise AIGenerationError(
            "An error occurred during your mock interview turn.",
            details={"error": str(exc)},
        ) from exc


def assess_ai_readiness(
    target_role: str,
    prep_summary: str,
) -> AIInterviewReadinessSchema:
    """Invoke LLM chain for holistic interview readiness score and recommendations."""
    llm = LLMProvider.get_llm()
    prompt = build_readiness_assessment_prompt()
    parser = get_readiness_parser()
    full_chain = prompt | llm | parser

    try:
        raw_result = full_chain.invoke(
            {
                "target_role": target_role,
                "prep_summary": prep_summary,
            }
        )
        return _to_pydantic(raw_result, AIInterviewReadinessSchema)
    except (OutputParserException, ValidationError) as exc:
        logger.exception("Failed to parse readiness assessment response.")
        raise PrepGenerationParseError(
            "Failed to parse AI readiness format.",
            details={"error": str(exc)},
        ) from exc
    except Exception as exc:
        logger.exception("Unexpected error during readiness assessment.")
        raise AIGenerationError(
            "An error occurred during readiness assessment.",
            details={"error": str(exc)},
        ) from exc

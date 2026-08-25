"""Core business logic & atomic persistence services for interview preparation."""

import logging
from typing import Any, Dict, List, Optional
from django.db import transaction
from django.db.models import Avg

from apps.interview_prep.chains import (
    assess_ai_readiness,
    evaluate_ai_answer,
    evaluate_mock_turn,
    generate_ai_prep_plan,
    generate_ai_questions,
)
from apps.interview_prep.constants import (
    DifficultyLevel,
    InterviewCategory,
    ProficiencyStatus,
    QuestionSourceType,
    SessionStatus,
)
from apps.interview_prep.exceptions import (
    InvalidSessionStateError,
    MockSessionNotFoundError,
    PrepPlanNotFoundError,
    QuestionNotFoundError,
)
from apps.interview_prep.models import (
    InterviewPrepPlan,
    InterviewQuestion,
    InterviewReadiness,
    MockInterviewSession,
    MockInterviewTurn,
    PrepResource,
    PrepTopic,
    QuestionAttempt,
)
from apps.interview_prep.services.context_service import build_student_context

logger = logging.getLogger(__name__)


def _get_val(obj: Any, field_name: str, default: Any = None) -> Any:
    """Safely extract field from either a Pydantic object or a Python dict."""
    if obj is None:
        return default
    if isinstance(obj, dict):
        return obj.get(field_name, default)
    return getattr(obj, field_name, default)


@transaction.atomic
def generate_and_save_prep_plan(
    user: Any,
    target_role: str,
    experience_level: str = "intermediate",
    company_name: str = "",
    job_description: str = "",
    force_regenerate: bool = False,
) -> InterviewPrepPlan:
    """Generate an AI interview prep plan and persist topics & resources in PostgreSQL."""
    cleaned_role = target_role.strip()

    existing_plan = InterviewPrepPlan.objects.filter(
        user=user,
        target_role__iexact=cleaned_role,
        is_active=True,
    ).first()

    if existing_plan and not force_regenerate:
        logger.info("Returning existing active interview prep plan | plan_id=%s", existing_plan.id)
        return existing_plan

    student_context = build_student_context(user)

    ai_plan = generate_ai_prep_plan(
        student_context=student_context,
        target_role=cleaned_role,
        experience_level=experience_level,
        company_name=company_name,
        job_description=job_description,
    )

    if existing_plan:
        existing_plan.is_active = False
        existing_plan.save(update_fields=["is_active"])

    target_role_val = _get_val(ai_plan, "target_role", cleaned_role) or cleaned_role
    exp_level_val = _get_val(ai_plan, "experience_level", experience_level) or experience_level
    summary_val = _get_val(ai_plan, "summary", "") or ""
    readiness_val = _get_val(ai_plan, "overall_readiness_score", 50) or 50

    plan = InterviewPrepPlan.objects.create(
        user=user,
        target_role=target_role_val,
        experience_level=exp_level_val,
        company_name=company_name,
        job_description=job_description,
        summary=summary_val,
        overall_readiness_score=readiness_val,
        is_active=True,
    )

    topics_list = _get_val(ai_plan, "topics", []) or []
    for idx, t_data in enumerate(topics_list, start=1):
        t_title = _get_val(t_data, "title", f"Topic #{idx}")
        t_category = _get_val(t_data, "category", InterviewCategory.TECHNICAL) or InterviewCategory.TECHNICAL
        t_difficulty = _get_val(t_data, "difficulty", DifficultyLevel.INTERMEDIATE) or DifficultyLevel.INTERMEDIATE
        t_priority = _get_val(t_data, "priority", idx) or idx
        t_status = _get_val(t_data, "proficiency_status", ProficiencyStatus.PRIORITY) or ProficiencyStatus.PRIORITY
        t_study = _get_val(t_data, "what_to_study", []) or []
        t_practice = _get_val(t_data, "what_to_practice", []) or []

        topic = PrepTopic.objects.create(
            plan=plan,
            title=t_title,
            category=t_category,
            difficulty=t_difficulty,
            priority=t_priority,
            proficiency_status=t_status,
            what_to_study=t_study,
            what_to_practice=t_practice,
        )

        resources_list = _get_val(t_data, "resources", []) or []
        for r_data in resources_list:
            r_title = _get_val(r_data, "title", "Resource")
            r_url = _get_val(r_data, "url", "") or ""
            r_provider = _get_val(r_data, "provider", "") or ""
            r_type = _get_val(r_data, "resource_type", "documentation") or "documentation"
            r_free = _get_val(r_data, "is_free", True)
            r_diff = _get_val(r_data, "difficulty", "intermediate") or "intermediate"

            PrepResource.objects.create(
                topic=topic,
                title=r_title,
                url=r_url,
                provider=r_provider,
                resource_type=r_type,
                is_free=r_free,
                difficulty=r_diff,
            )

    logger.info("Successfully generated & persisted InterviewPrepPlan | plan_id=%s", plan.id)
    return plan


@transaction.atomic
def generate_questions_for_plan(
    user: Any,
    plan_id: str,
    topic_id: Optional[str] = None,
    question_count: int = 5,
) -> List[InterviewQuestion]:
    """Generate dynamic questions for a specific plan or topic using LLM."""
    plan = InterviewPrepPlan.objects.filter(id=plan_id, user=user).first()
    if not plan:
        raise PrepPlanNotFoundError(f"Interview prep plan '{plan_id}' not found.")

    topic = None
    topic_title = "General Practice & Core Concepts"
    if topic_id:
        topic = PrepTopic.objects.filter(id=topic_id, plan=plan).first()
        if topic:
            topic_title = topic.title

    student_context = build_student_context(user)

    ai_q_set = generate_ai_questions(
        student_context=student_context,
        target_role=plan.target_role,
        topic_title=topic_title,
        question_count=question_count,
        job_description=plan.job_description,
    )

    created_questions = []
    for q in ai_q_set.questions:
        q_obj = InterviewQuestion.objects.create(
            plan=plan,
            topic=topic,
            question_text=q.question_text,
            category=q.category or InterviewCategory.TECHNICAL,
            difficulty=q.difficulty or DifficultyLevel.INTERMEDIATE,
            source_type=q.source_type or QuestionSourceType.TECHNICAL,
            ideal_answer_outline=q.ideal_answer_outline,
            key_points=q.key_points,
        )
        created_questions.append(q_obj)

    logger.info("Generated %d questions for plan_id=%s", len(created_questions), plan.id)
    return created_questions


@transaction.atomic
def submit_question_answer(
    user: Any,
    question_id: str,
    user_answer: str,
) -> QuestionAttempt:
    """Evaluate candidate's answer submission via AI and store attempt result."""
    question = InterviewQuestion.objects.filter(id=question_id, plan__user=user).first()
    if not question:
        raise QuestionNotFoundError(f"Interview question '{question_id}' not found.")

    cleaned_answer = user_answer.strip()

    eval_result = evaluate_ai_answer(
        target_role=question.plan.target_role,
        category=question.category,
        question_text=question.question_text,
        user_answer=cleaned_answer,
        ideal_answer_outline=question.ideal_answer_outline,
        key_points=question.key_points,
    )

    attempt = QuestionAttempt.objects.create(
        question=question,
        user=user,
        user_answer=cleaned_answer,
        score=eval_result.score,
        is_correct=eval_result.is_correct,
        strengths=eval_result.strengths,
        weaknesses=eval_result.weaknesses,
        missing_points=eval_result.missing_points,
        ideal_answer=eval_result.ideal_answer,
        improvement_tips=eval_result.improvement_tips,
    )

    logger.info("Answer evaluated | question_id=%s | score=%d", question.id, attempt.score)
    return attempt


@transaction.atomic
def start_mock_interview_session(
    user: Any,
    plan_id: str,
    category: str = InterviewCategory.TECHNICAL,
    total_questions: int = 5,
) -> MockInterviewSession:
    """Start a new interactive mock interview session."""
    plan = InterviewPrepPlan.objects.filter(id=plan_id, user=user).first()
    if not plan:
        raise PrepPlanNotFoundError(f"Interview prep plan '{plan_id}' not found.")

    # Abandon any lingering in_progress session for this plan
    MockInterviewSession.objects.filter(
        user=user, plan=plan, status=SessionStatus.IN_PROGRESS
    ).update(status=SessionStatus.ABANDONED)

    session = MockInterviewSession.objects.create(
        user=user,
        plan=plan,
        title=f"Mock Interview: {category.title()} ({plan.target_role})",
        category=category,
        total_questions=total_questions,
        current_question_index=1,
        status=SessionStatus.IN_PROGRESS,
    )

    # Generate initial Turn #1 question
    student_context = build_student_context(user)
    initial_q_set = generate_ai_questions(
        student_context=student_context,
        target_role=plan.target_role,
        topic_title=f"{category.title()} Core Interview",
        question_count=1,
        job_description=plan.job_description,
    )

    first_q_text = (
        initial_q_set.questions[0].question_text
        if initial_q_set.questions
        else f"Tell me about your background and core technical experience relevant to {plan.target_role}."
    )

    MockInterviewTurn.objects.create(
        session=session,
        turn_index=1,
        question_text=first_q_text,
        category=category,
        difficulty=DifficultyLevel.INTERMEDIATE,
    )

    logger.info("Started MockInterviewSession | session_id=%s", session.id)
    return session


@transaction.atomic
def submit_mock_turn_answer(
    user: Any,
    session_id: str,
    user_answer: str,
) -> Dict[str, Any]:
    """Submit candidate answer for current turn, evaluate, and generate adaptive follow-up."""
    session = MockInterviewSession.objects.filter(id=session_id, user=user).first()
    if not session:
        raise MockSessionNotFoundError(f"Mock session '{session_id}' not found.")

    if session.status != SessionStatus.IN_PROGRESS:
        raise InvalidSessionStateError(f"Session is already {session.status}.")

    current_turn = MockInterviewTurn.objects.filter(
        session=session, turn_index=session.current_question_index
    ).first()

    if not current_turn:
        raise InvalidSessionStateError("Current turn question not found.")

    current_turn.user_answer = user_answer.strip()

    # Evaluate turn and get adaptive follow-up
    turn_eval = evaluate_mock_turn(
        target_role=session.plan.target_role,
        category=session.category,
        turn_index=session.current_question_index,
        total_turns=session.total_questions,
        question_text=current_turn.question_text,
        user_answer=current_turn.user_answer,
    )

    current_turn.score = turn_eval.score
    current_turn.evaluation = turn_eval.evaluation
    current_turn.follow_up_hint = turn_eval.follow_up_hint
    current_turn.save()

    # Check if more turns remain
    if session.current_question_index < session.total_questions:
        next_turn_index = session.current_question_index + 1
        session.current_question_index = next_turn_index
        session.save(update_fields=["current_question_index", "updated_at"])

        next_turn = MockInterviewTurn.objects.create(
            session=session,
            turn_index=next_turn_index,
            question_text=turn_eval.follow_up_question,
            category=turn_eval.category or session.category,
            difficulty=turn_eval.difficulty or DifficultyLevel.INTERMEDIATE,
        )

        return {
            "completed_turn": current_turn,
            "next_turn": next_turn,
            "is_finished": False,
        }

    # Final turn finished
    return finish_mock_interview_session(user, session_id)


@transaction.atomic
def finish_mock_interview_session(user: Any, session_id: str) -> Dict[str, Any]:
    """Complete a mock interview session and calculate overall performance report."""
    session = MockInterviewSession.objects.filter(id=session_id, user=user).first()
    if not session:
        raise MockSessionNotFoundError(f"Mock session '{session_id}' not found.")

    turns = list(MockInterviewTurn.objects.filter(session=session))
    scores = [t.score for t in turns if t.user_answer]
    avg_score = int(sum(scores) / len(scores)) if scores else 0

    session.status = SessionStatus.COMPLETED
    session.overall_score = avg_score
    session.feedback = f"Completed mock interview session with an average score of {avg_score}% across {len(scores)} questions."
    session.save(update_fields=["status", "overall_score", "feedback", "updated_at"])

    logger.info("Completed MockInterviewSession | session_id=%s | score=%d", session.id, avg_score)
    return {
        "session": session,
        "turns": turns,
        "is_finished": True,
    }


def calculate_interview_readiness(user: Any, plan_id: str) -> InterviewReadiness:
    """Calculate holistic interview readiness analytics for a student prep plan."""
    plan = InterviewPrepPlan.objects.filter(id=plan_id, user=user).first()
    if not plan:
        raise PrepPlanNotFoundError(f"Interview prep plan '{plan_id}' not found.")

    attempts = QuestionAttempt.objects.filter(question__plan=plan, user=user)
    tech_avg = (
        attempts.filter(question__category=InterviewCategory.TECHNICAL).aggregate(
            Avg("score")
        )["score__avg"]
        or 50
    )
    beh_avg = (
        attempts.filter(question__category=InterviewCategory.BEHAVIORAL).aggregate(
            Avg("score")
        )["score__avg"]
        or 50
    )
    proj_avg = (
        attempts.filter(question__source_type=QuestionSourceType.PROJECT_BASED).aggregate(
            Avg("score")
        )["score__avg"]
        or 50
    )

    overall = int((tech_avg * 0.4) + (beh_avg * 0.3) + (proj_avg * 0.3))

    prep_summary = (
        f"Target Role: {plan.target_role}\n"
        f"Technical Average Score: {tech_avg:.1f}%\n"
        f"Behavioral Average Score: {beh_avg:.1f}%\n"
        f"Project Confidence Average Score: {proj_avg:.1f}%\n"
        f"Total Questions Practiced: {attempts.count()}\n"
    )

    ai_readiness = assess_ai_readiness(
        target_role=plan.target_role,
        prep_summary=prep_summary,
    )

    readiness = InterviewReadiness.objects.create(
        user=user,
        plan=plan,
        technical_score=ai_readiness.technical_score or int(tech_avg),
        behavioral_score=ai_readiness.behavioral_score or int(beh_avg),
        project_score=ai_readiness.project_score or int(proj_avg),
        overall_score=ai_readiness.overall_score or overall,
        weak_areas=ai_readiness.weak_areas,
        recommendation=ai_readiness.recommendation,
    )

    # Update master plan score
    plan.overall_readiness_score = readiness.overall_score
    plan.save(update_fields=["overall_readiness_score", "updated_at"])

    return readiness


def get_study_today_recommendation(user: Any) -> Dict[str, Any]:
    """Retrieve focused daily study recommendation for student."""
    plan = InterviewPrepPlan.objects.filter(user=user, is_active=True).first()
    if not plan:
        return {
            "has_plan": False,
            "message": "No active interview preparation plan found. Generate a plan to start preparing.",
        }

    priority_topic = PrepTopic.objects.filter(
        plan=plan, proficiency_status=ProficiencyStatus.PRIORITY
    ).first()

    if not priority_topic:
        priority_topic = PrepTopic.objects.filter(plan=plan).first()

    resources = list(priority_topic.resources.all()) if priority_topic else []

    return {
        "has_plan": True,
        "plan_id": str(plan.id),
        "target_role": plan.target_role,
        "priority_topic": priority_topic.title if priority_topic else "General Practice",
        "category": priority_topic.category if priority_topic else "technical",
        "what_to_study": priority_topic.what_to_study if priority_topic else [],
        "what_to_practice": priority_topic.what_to_practice if priority_topic else [],
        "resources": [
            {
                "title": r.title,
                "url": r.url,
                "provider": r.provider,
                "resource_type": r.resource_type,
            }
            for r in resources
        ],
    }

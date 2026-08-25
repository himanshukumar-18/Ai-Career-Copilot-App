"""Unit and integration test suite for the interview_prep app."""

from unittest.mock import MagicMock, patch
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.interview_prep.constants import (
    DifficultyLevel,
    InterviewCategory,
    QuestionSourceType,
    SessionStatus,
)
from apps.interview_prep.models import (
    InterviewPrepPlan,
    InterviewQuestion,
    InterviewReadiness,
    MockInterviewSession,
    MockInterviewTurn,
    PrepTopic,
    QuestionAttempt,
)
from apps.interview_prep.schemas import (
    AIAnswerEvaluationSchema,
    AIInterviewPrepPlanSchema,
    AIInterviewReadinessSchema,
    AIMockInterviewTurnSchema,
    AIQuestionGenerationSchema,
    AIQuestionSchema,
    AITopicSchema,
)
from apps.interview_prep.services import (
    build_student_context,
    calculate_interview_readiness,
    generate_and_save_prep_plan,
    generate_questions_for_plan,
    get_study_today_recommendation,
    start_mock_interview_session,
    submit_mock_turn_answer,
    submit_question_answer,
)

User = get_user_model()


class ContextAggregatorTests(APITestCase):
    """Test student context aggregator build_student_context."""

    def setUp(self):
        self.user = User.objects.create(
            email="context_student@example.com",
            is_active=True,
        )
        self.user.set_password("Password123!")
        self.user.save()

    def test_build_student_context_default(self):
        context = build_student_context(self.user)
        self.assertIn("Student Candidate Context", context)


class MockAIServiceTests(APITestCase):
    """Test AI persistence services with mocked LLM chains."""

    def setUp(self):
        self.user = User.objects.create(
            email="ai_prep_user@example.com",
            is_active=True,
        )
        self.user.set_password("Password123!")
        self.user.save()

    @patch("apps.interview_prep.services.ai_prep_service.generate_ai_prep_plan")
    def test_generate_and_save_prep_plan_service(self, mock_gen_plan):
        mock_gen_plan.return_value = AIInterviewPrepPlanSchema(
            target_role="Backend Developer",
            experience_level="intermediate",
            summary="Strong candidate in Python with room for SQL optimization.",
            overall_readiness_score=65,
            topics=[
                AITopicSchema(
                    title="SQL & Database Performance",
                    category="technical",
                    difficulty="intermediate",
                    priority=1,
                    proficiency_status="priority",
                    what_to_study=["Indexing B-Trees", "EXPLAIN ANALYZE"],
                    what_to_practice=["Optimize 5 slow queries"],
                    resources=[],
                )
            ],
        )

        plan = generate_and_save_prep_plan(
            user=self.user,
            target_role="Backend Developer",
        )

        self.assertEqual(plan.target_role, "Backend Developer")
        self.assertEqual(plan.overall_readiness_score, 65)
        self.assertEqual(plan.topics.count(), 1)
        topic = plan.topics.first()
        self.assertEqual(topic.title, "SQL & Database Performance")

    @patch("apps.interview_prep.services.ai_prep_service.generate_ai_questions")
    def test_generate_questions_service(self, mock_gen_q):
        plan = InterviewPrepPlan.objects.create(
            user=self.user,
            target_role="Backend Developer",
        )
        mock_gen_q.return_value = AIQuestionGenerationSchema(
            questions=[
                AIQuestionSchema(
                    question_text="Explain ACID properties in PostgreSQL.",
                    category="technical",
                    difficulty="intermediate",
                    source_type="technical",
                    ideal_answer_outline="Atomicity, Consistency, Isolation, Durability...",
                    key_points=["Atomicity", "Isolation levels"],
                )
            ]
        )

        questions = generate_questions_for_plan(
            user=self.user,
            plan_id=str(plan.id),
        )

        self.assertEqual(len(questions), 1)
        self.assertEqual(questions[0].category, "technical")
        self.assertIn("ACID", questions[0].question_text)

    @patch("apps.interview_prep.services.ai_prep_service.evaluate_ai_answer")
    def test_submit_question_answer_service(self, mock_eval):
        plan = InterviewPrepPlan.objects.create(
            user=self.user,
            target_role="Backend Developer",
        )
        q = InterviewQuestion.objects.create(
            plan=plan,
            question_text="What is JWT?",
            category="technical",
        )
        mock_eval.return_value = AIAnswerEvaluationSchema(
            score=85,
            is_correct=True,
            strengths=["Clear explanation of header, payload, and signature"],
            weaknesses=["Did not mention secret key rotation"],
            missing_points=["Token expiration practice"],
            ideal_answer="JWT stands for JSON Web Token...",
            improvement_tips=["Mention key rotation"],
        )

        attempt = submit_question_answer(
            user=self.user,
            question_id=str(q.id),
            user_answer="JWT is a stateless bearer token consisting of 3 parts.",
        )

        self.assertEqual(attempt.score, 85)
        self.assertTrue(attempt.is_correct)

    @patch("apps.interview_prep.services.ai_prep_service.generate_ai_questions")
    def test_start_mock_interview_session_service(self, mock_gen_q):
        plan = InterviewPrepPlan.objects.create(
            user=self.user,
            target_role="Backend Developer",
        )
        mock_gen_q.return_value = AIQuestionGenerationSchema(
            questions=[
                AIQuestionSchema(
                    question_text="Describe how Django ORM executes queries.",
                    category="technical",
                )
            ]
        )

        session = start_mock_interview_session(
            user=self.user,
            plan_id=str(plan.id),
            total_questions=3,
        )

        self.assertEqual(session.total_questions, 3)
        self.assertEqual(session.status, SessionStatus.IN_PROGRESS)
        self.assertEqual(session.turns.count(), 1)


class InterviewPrepAPITests(APITestCase):
    """Integration API tests for Interview Preparation endpoints."""

    def setUp(self):
        self.user = User.objects.create(
            email="api_student@example.com",
            is_active=True,
        )
        self.user.set_password("Password123!")
        self.user.save()
        self.client.force_authenticate(user=self.user)

    @patch("apps.interview_prep.views.generate_and_save_prep_plan")
    def test_generate_prep_plan_api(self, mock_gen):
        plan = InterviewPrepPlan.objects.create(
            user=self.user,
            target_role="Full Stack Developer",
        )
        mock_gen.return_value = plan

        url = reverse("interview_prep:generate-plan")
        response = self.client.post(
            url,
            {
                "target_role": "Full Stack Developer",
                "experience_level": "intermediate",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["data"]["target_role"], "Full Stack Developer")

    def test_list_and_retrieve_prep_plans_api(self):
        plan = InterviewPrepPlan.objects.create(
            user=self.user,
            target_role="DevOps Engineer",
        )

        list_url = reverse("interview_prep:prep-plan-list")
        res_list = self.client.get(list_url)
        self.assertEqual(res_list.status_code, status.HTTP_200_OK)

        detail_url = reverse("interview_prep:prep-plan-detail", kwargs={"pk": plan.id})
        res_detail = self.client.get(detail_url)
        self.assertEqual(res_detail.status_code, status.HTTP_200_OK)
        self.assertEqual(res_detail.data["data"]["target_role"], "DevOps Engineer")

    @patch("apps.interview_prep.views.get_study_today_recommendation")
    def test_study_today_api(self, mock_rec):
        mock_rec.return_value = {
            "has_plan": True,
            "target_role": "Backend Developer",
            "priority_topic": "REST API Security",
        }

        url = reverse("interview_prep:study-today")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["data"]["has_plan"])

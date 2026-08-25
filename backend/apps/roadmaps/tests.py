from decimal import Decimal
from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.roadmaps.constants import DifficultyLevel, RoadmapStatus, StepStatus
from apps.roadmaps.models import (
    CareerRole,
    Roadmap,
    RoadmapPhase,
    RoadmapStep,
    UserRoadmapProgress,
    UserStepProgress,
)

User = get_user_model()


def _create_test_user(email, password="Password123!"):
    user = User.objects.create(email=email)
    user.set_password(password)
    user.save()
    return user


class RoadmapsBaseTestCase(TestCase):
    def setUp(self):
        self.user1 = _create_test_user("student1@example.com")
        self.user2 = _create_test_user("student2@example.com")

        self.client1 = APIClient()
        self.client1.force_authenticate(user=self.user1)

        self.client2 = APIClient()
        self.client2.force_authenticate(user=self.user2)

        # Create test career role and roadmap
        self.role = CareerRole.objects.create(
            title="Python Backend Developer",
            slug="python-backend-developer",
            description="Master Python, Django, REST APIs, and databases.",
            category="Web Development",
            difficulty=DifficultyLevel.INTERMEDIATE,
            estimated_duration_weeks=12,
            is_active=True,
        )

        self.roadmap = Roadmap.objects.create(
            career_role=self.role,
            title="Backend Learning Path",
            description="Step by step backend developer path",
            version="1.0.0",
            total_phases=2,
            is_published=True,
        )

        # Phase 1
        self.phase1 = RoadmapPhase.objects.create(
            roadmap=self.roadmap,
            order=1,
            title="Phase 1: Fundamentals",
            description="Language basics",
            estimated_hours=10,
        )

        self.step1 = RoadmapStep.objects.create(
            phase=self.phase1,
            order=1,
            title="Step 1: Core Syntax",
            description="Learn loops & variables",
            learning_objective="Write basic functions",
            what_to_learn=["Variables", "Loops"],
            what_to_practice=["Write functions"],
            what_to_build=["CLI App"],
            completion_criteria="Bug-free code",
            estimated_hours=5,
            difficulty=DifficultyLevel.BEGINNER,
        )

        self.step2 = RoadmapStep.objects.create(
            phase=self.phase1,
            order=2,
            title="Step 2: OOP Principles",
            description="Classes and inheritance",
            learning_objective="Understand OOP",
            what_to_learn=["Classes", "Inheritance"],
            what_to_practice=["Design classes"],
            what_to_build=["Bank Simulator"],
            completion_criteria="Modular classes",
            estimated_hours=5,
            difficulty=DifficultyLevel.INTERMEDIATE,
            prerequisite_step=self.step1,
        )

        # Phase 2
        self.phase2 = RoadmapPhase.objects.create(
            roadmap=self.roadmap,
            order=2,
            title="Phase 2: REST APIs",
            description="Build REST APIs",
            estimated_hours=15,
        )

        self.step3 = RoadmapStep.objects.create(
            phase=self.phase2,
            order=1,
            title="Step 3: DRF Views & Serializers",
            description="Expose JSON endpoints",
            learning_objective="Build REST endpoints",
            what_to_learn=["Serializers", "APIView"],
            what_to_practice=["Build endpoints"],
            what_to_build=["Portfolio REST API"],
            completion_criteria="Validated REST API",
            estimated_hours=10,
            difficulty=DifficultyLevel.INTERMEDIATE,
            prerequisite_step=self.step2,
        )


class CareerRoleApiTests(RoadmapsBaseTestCase):
    def test_list_active_career_roles(self):
        url = "/api/v1/roadmaps/roles/"
        response = self.client1.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        roles_data = response.data["data"]
        roles = roles_data["results"] if isinstance(roles_data, dict) and "results" in roles_data else roles_data
        self.assertGreaterEqual(len(roles), 1)
        self.assertTrue(any(r["slug"] == self.role.slug for r in roles))

    def test_get_full_roadmap_tree(self):
        url = f"/api/v1/roadmaps/roles/{self.role.slug}/full/"
        response = self.client1.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        tree = response.data["data"]
        self.assertEqual(tree["title"], self.roadmap.title)
        self.assertEqual(len(tree["phases"]), 2)
        self.assertEqual(len(tree["phases"][0]["steps"]), 2)


class RoadmapEnrollmentAndProgressTests(RoadmapsBaseTestCase):
    def test_enroll_and_initialize_progress(self):
        url = f"/api/v1/roadmaps/roles/{self.role.slug}/enroll/"
        response = self.client1.post(url)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        progress_data = response.data["data"]
        self.assertEqual(progress_data["status"], RoadmapStatus.NOT_STARTED)
        self.assertEqual(Decimal(str(progress_data["completion_percentage"])), Decimal("0.00"))

        # Verify step progress entries initialized
        user_prog = UserRoadmapProgress.objects.get(user=self.user1, career_role=self.role)
        self.assertEqual(user_prog.step_progresses.count(), 3)

    def test_duplicate_enrollment_fails(self):
        url = f"/api/v1/roadmaps/roles/{self.role.slug}/enroll/"
        self.client1.post(url)
        response = self.client1.post(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("already enrolled", response.data["message"])

    def test_prerequisite_enforcement(self):
        # Enroll user
        enroll_url = f"/api/v1/roadmaps/roles/{self.role.slug}/enroll/"
        self.client1.post(enroll_url)

        # Attempt to complete step 2 (requires step 1) directly
        complete_url = f"/api/v1/roadmaps/steps/{self.step2.id}/complete/"
        response = self.client1.post(complete_url, {"notes": "Skipping step 1"})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Prerequisite step", response.data["message"])

    def test_step_completion_and_next_step_engine(self):
        # Enroll user
        enroll_url = f"/api/v1/roadmaps/roles/{self.role.slug}/enroll/"
        self.client1.post(enroll_url)

        # 1. Complete Step 1
        complete_url1 = f"/api/v1/roadmaps/steps/{self.step1.id}/complete/"
        resp1 = self.client1.post(complete_url1, {"notes": "Completed Python syntax"})

        self.assertEqual(resp1.status_code, status.HTTP_200_OK)
        next_data1 = resp1.data["data"]
        self.assertEqual(next_data1["next_step"]["id"], str(self.step2.id))
        self.assertEqual(Decimal(str(next_data1["completion_percentage"])), Decimal("33.33"))

        # 2. Complete Step 2
        complete_url2 = f"/api/v1/roadmaps/steps/{self.step2.id}/complete/"
        resp2 = self.client1.post(complete_url2, {"notes": "Completed OOP"})

        self.assertEqual(resp2.status_code, status.HTTP_200_OK)
        next_data2 = resp2.data["data"]
        self.assertEqual(next_data2["next_step"]["id"], str(self.step3.id))
        self.assertEqual(Decimal(str(next_data2["completion_percentage"])), Decimal("66.67"))

        # 3. Complete Step 3 (Final step)
        complete_url3 = f"/api/v1/roadmaps/steps/{self.step3.id}/complete/"
        resp3 = self.client1.post(complete_url3, {"notes": "Completed DRF"})

        self.assertEqual(resp3.status_code, status.HTTP_200_OK)
        next_data3 = resp3.data["data"]
        self.assertIsNone(next_data3["next_step"])
        self.assertEqual(Decimal(str(next_data3["completion_percentage"])), Decimal("100.00"))

        # Verify UserRoadmapProgress status updated to COMPLETED
        user_prog = UserRoadmapProgress.objects.get(user=self.user1, career_role=self.role)
        self.assertEqual(user_prog.status, RoadmapStatus.COMPLETED)
        self.assertIsNotNone(user_prog.completed_at)

    def test_idor_protection(self):
        # User 1 enrolls and completes step 1
        enroll_url = f"/api/v1/roadmaps/roles/{self.role.slug}/enroll/"
        self.client1.post(enroll_url)

        # User 2 attempts to view User 1's progress
        user1_prog_url = f"/api/v1/roadmaps/roles/{self.role.slug}/my-progress/"
        response_user2 = self.client2.get(user1_prog_url)

        # User 2 has not enrolled, returns 404
        self.assertEqual(response_user2.status_code, status.HTTP_404_NOT_FOUND)


class AIRoadmapGenerationTests(RoadmapsBaseTestCase):
    def test_build_student_context(self):
        from apps.roadmaps.services.context_service import build_student_context

        context = build_student_context(self.user1)
        self.assertIsInstance(context, str)

    def test_ai_roadmap_generation_endpoint(self):
        from unittest.mock import patch
        from apps.roadmaps.schemas import (
            AIRoadmapPhaseSchema,
            AIRoadmapResourceSchema,
            AIRoadmapResponseSchema,
            AIRoadmapSkillGapSchema,
            AIRoadmapStepSchema,
        )

        mock_ai_output = AIRoadmapResponseSchema(
            career_role=self.role.title,
            summary="Personalized AI roadmap summary",
            estimated_duration_weeks=12,
            skill_gap_analysis=AIRoadmapSkillGapSchema(
                strong_skills=["Python"],
                missing_skills=["Docker", "Celery"],
                weak_skills=["SQL"],
                priority_skills=["Django REST Framework"],
            ),
            phases=[
                AIRoadmapPhaseSchema(
                    order=1,
                    title="Phase 1: Master DRF",
                    description="Deep dive into DRF serializers",
                    estimated_hours=20,
                    learning_objective="Build REST APIs",
                    prerequisites_summary="Python basics",
                    steps=[
                        AIRoadmapStepSchema(
                            order=1,
                            title="Step 1: DRF Serializers",
                            description="Learn Serializers",
                            learning_objective="Validate JSON",
                            what_to_learn=["Serializers"],
                            what_to_practice=["Write validation"],
                            what_to_build=["Task API"],
                            completion_criteria="Bug-free API",
                            estimated_hours=5,
                            difficulty="intermediate",
                            resources=[
                                AIRoadmapResourceSchema(
                                    title="DRF Docs",
                                    url="https://www.django-rest-framework.org/",
                                    resource_type="documentation",
                                    provider="DRF",
                                    is_free=True,
                                )
                            ],
                        )
                    ],
                )
            ],
        )

        with patch("apps.roadmaps.services.ai_roadmap_service.generate_ai_roadmap", return_value=mock_ai_output):
            url = "/api/v1/roadmaps/generate/"
            payload = {
                "career_role_slug": self.role.slug,
                "force_regenerate": True,
            }
            response = self.client1.post(url, payload, format="json")

            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            data = response.data["data"]
            self.assertIn("skill_gap_analysis", data)
            self.assertEqual(data["skill_gap_analysis"]["strong_skills"], ["Python"])
            self.assertEqual(len(data["roadmap"]["phases"]), 1)


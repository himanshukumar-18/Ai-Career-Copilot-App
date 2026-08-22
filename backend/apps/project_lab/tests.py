"""Comprehensive unit and integration tests for the project_lab module."""

from unittest.mock import patch
from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.project_lab.constants import Difficulty, ProjectStatus
from apps.project_lab.exceptions import (
    LLMConfigurationException,
    LLMRequestFailedError,
    ProjectGenerationParseError,
)
from apps.project_lab.models import GeneratedProject, UserProject
from apps.project_lab.schemas import GeneratedProjectSchema

User = get_user_model()


def _create_test_user(email, password):
    user = User.objects.create(email=email)
    user.set_password(password)
    user.save()
    return user


class ProjectLabBaseTestCase(TestCase):
    def setUp(self):
        self.user1 = _create_test_user("student1@example.com", "Password123!")
        self.user2 = _create_test_user("student2@example.com", "Password123!")

        self.client1 = APIClient()
        self.client1.force_authenticate(user=self.user1)

        self.client2 = APIClient()
        self.client2.force_authenticate(user=self.user2)

        self.unauthenticated_client = APIClient()


class AuthenticationAndSecurityTests(ProjectLabBaseTestCase):
    def test_unauthenticated_requests_blocked(self):
        url_generate = "/api/v1/project-lab/generate/"
        url_projects = "/api/v1/project-lab/my-projects/"

        resp1 = self.unauthenticated_client.post(url_generate, {})
        self.assertEqual(resp1.status_code, status.HTTP_401_UNAUTHORIZED)

        resp2 = self.unauthenticated_client.get(url_projects)
        self.assertEqual(resp2.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_idor_isolation(self):
        # Create a user project for User 2
        user2_project = UserProject.objects.create(
            user=self.user2,
            title="User 2 Secret App",
            description="Private data",
            difficulty=Difficulty.MEDIUM,
            tech_stack=["Python", "Django"],
            estimated_hours=40,
            status=ProjectStatus.NOT_STARTED,
        )

        # User 1 attempts to view User 2's project
        url = f"/api/v1/project-lab/my-projects/{user2_project.id}/"
        resp_get = self.client1.get(url)
        self.assertEqual(resp_get.status_code, status.HTTP_404_NOT_FOUND)

        # User 1 attempts to update User 2's project status
        resp_patch = self.client1.patch(
            f"{url}status/",
            {"status": ProjectStatus.IN_PROGRESS},
            format="json",
        )
        self.assertEqual(resp_patch.status_code, status.HTTP_404_NOT_FOUND)

        # User 1 attempts to delete User 2's project
        resp_delete = self.client1.delete(url)
        self.assertEqual(resp_delete.status_code, status.HTTP_404_NOT_FOUND)

        # Confirm User 2's project remains untouched
        user2_project.refresh_from_db()
        self.assertEqual(user2_project.status, ProjectStatus.NOT_STARTED)

    def test_cannot_save_other_user_generated_project(self):
        # Create a GeneratedProject owned by User 2
        gen_project_user2 = GeneratedProject.objects.create(
            user=self.user2,
            tech_stack=["React"],
            difficulty=Difficulty.EASY,
            requested_count=1,
            title="User 2 Gen Idea",
            short_description="Description",
            description="Full long description here for testing",
            features=["Feature 1"],
            learning_outcomes=["Outcome 1"],
            estimated_hours=20,
        )

        # User 1 tries to snapshot User 2's GeneratedProject
        url = "/api/v1/project-lab/my-projects/"
        response = self.client1.post(
            url,
            {"generated_project_id": str(gen_project_user2.id)},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class ProjectGenerationAPITests(ProjectLabBaseTestCase):
    @patch("apps.project_lab.services.project_generation_service.generate_projects")
    def test_generate_projects_success(self, mock_generate):
        mock_generate.return_value = [
            GeneratedProjectSchema(
                title="AI Portfolio Copilot",
                short_description="A cool AI assistant for developer portfolios.",
                description="This project helps developers showcase projects using AI summarization.",
                difficulty=Difficulty.MEDIUM,
                tech_stack=["Python", "Django", "React"],
                estimated_hours=50,
                features=["Resume Parsing", "Project Generation"],
                learning_outcomes=["LLM Prompting", "Django REST Framework"],
            )
        ]

        url = "/api/v1/project-lab/generate/"
        payload = {
            "tech_stack": ["Python", "Django", "React"],
            "difficulty": Difficulty.MEDIUM,
            "count": 1,
        }

        response = self.client1.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(response.data["data"]), 1)
        self.assertEqual(response.data["data"][0]["title"], "AI Portfolio Copilot")

        # Verify persisted GeneratedProject row
        self.assertEqual(GeneratedProject.objects.filter(user=self.user1).count(), 1)

    def test_generate_projects_invalid_input(self):
        url = "/api/v1/project-lab/generate/"

        # Empty tech stack
        resp1 = self.client1.post(
            url,
            {"tech_stack": [], "difficulty": Difficulty.EASY, "count": 1},
            format="json",
        )
        self.assertEqual(resp1.status_code, status.HTTP_400_BAD_REQUEST)

        # Invalid difficulty
        resp2 = self.client1.post(
            url,
            {"tech_stack": ["Python"], "difficulty": "ultra_hard", "count": 1},
            format="json",
        )
        self.assertEqual(resp2.status_code, status.HTTP_400_BAD_REQUEST)

        # Count out of bounds (> 5)
        resp3 = self.client1.post(
            url,
            {"tech_stack": ["Python"], "difficulty": Difficulty.EASY, "count": 10},
            format="json",
        )
        self.assertEqual(resp3.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("apps.project_lab.services.project_generation_service.generate_projects")
    def test_generate_projects_error_handling(self, mock_generate):
        url = "/api/v1/project-lab/generate/"
        payload = {
            "tech_stack": ["Python"],
            "difficulty": Difficulty.EASY,
            "count": 1,
        }

        # LLM misconfigured
        mock_generate.side_effect = LLMConfigurationException("Missing API key")
        resp1 = self.client1.post(url, payload, format="json")
        self.assertEqual(resp1.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

        # LLM request failed / timeout
        mock_generate.side_effect = LLMRequestFailedError("Timeout connecting to Groq")
        resp2 = self.client1.post(url, payload, format="json")
        self.assertEqual(resp2.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)

        # Parse error
        mock_generate.side_effect = ProjectGenerationParseError("Invalid JSON from LLM")
        resp3 = self.client1.post(url, payload, format="json")
        self.assertEqual(resp3.status_code, status.HTTP_502_BAD_GATEWAY)


class UserProjectWorkflowTests(ProjectLabBaseTestCase):
    def setUp(self):
        super().setUp()
        self.generated_project = GeneratedProject.objects.create(
            user=self.user1,
            tech_stack=["Python", "PostgreSQL"],
            difficulty=Difficulty.MEDIUM,
            requested_count=1,
            title="Database Analyzer Tool",
            short_description="Analyzes DB queries and indexes.",
            description="A tool that checks PostgreSQL tables for missing indexes and N+1 queries.",
            features=["Query Analysis", "Index Recommendation"],
            learning_outcomes=["PostgreSQL Internals", "Django ORM"],
            estimated_hours=35,
        )

    def test_save_and_duplicate_prevention(self):
        url = "/api/v1/project-lab/my-projects/"

        # Save project
        resp1 = self.client1.post(
            url,
            {"generated_project_id": str(self.generated_project.id)},
            format="json",
        )
        self.assertEqual(resp1.status_code, status.HTTP_201_CREATED)
        user_project_id = resp1.data["data"]["id"]

        # Attempt to save the exact same project again
        resp2 = self.client1.post(
            url,
            {"generated_project_id": str(self.generated_project.id)},
            format="json",
        )
        self.assertEqual(resp2.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("already been saved", resp2.data["message"])

        return user_project_id

    def test_list_and_filter_user_projects(self):
        p1 = UserProject.objects.create(
            user=self.user1,
            title="Alpha Project",
            description="Desc A",
            difficulty=Difficulty.EASY,
            tech_stack=["Python"],
            estimated_hours=10,
            status=ProjectStatus.NOT_STARTED,
        )
        p2 = UserProject.objects.create(
            user=self.user1,
            title="Beta Project",
            description="Desc B",
            difficulty=Difficulty.HARD,
            tech_stack=["Go"],
            estimated_hours=60,
            status=ProjectStatus.IN_PROGRESS,
        )

        url = "/api/v1/project-lab/my-projects/"

        # List all for user1
        resp_all = self.client1.get(url)
        self.assertEqual(resp_all.status_code, status.HTTP_200_OK)
        results_all = resp_all.data["data"]["results"] if "results" in resp_all.data["data"] else resp_all.data["data"]
        self.assertEqual(len(results_all), 2)

        # Filter by status = in_progress
        resp_filter = self.client1.get(f"{url}?status={ProjectStatus.IN_PROGRESS}")
        self.assertEqual(resp_filter.status_code, status.HTTP_200_OK)
        results_filter = resp_filter.data["data"]["results"] if "results" in resp_filter.data["data"] else resp_filter.data["data"]
        self.assertEqual(len(results_filter), 1)
        self.assertEqual(results_filter[0]["id"], str(p2.id))

        # Search query = "Alpha"
        resp_search = self.client1.get(f"{url}?search=Alpha")
        self.assertEqual(resp_search.status_code, status.HTTP_200_OK)
        results_search = resp_search.data["data"]["results"] if "results" in resp_search.data["data"] else resp_search.data["data"]
        self.assertEqual(len(results_search), 1)
        self.assertEqual(results_search[0]["id"], str(p1.id))

    def test_status_transitions_and_timestamps(self):
        user_project = UserProject.objects.create(
            user=self.user1,
            source_generation=self.generated_project,
            title=self.generated_project.title,
            description=self.generated_project.description,
            difficulty=self.generated_project.difficulty,
            tech_stack=self.generated_project.tech_stack,
            estimated_hours=self.generated_project.estimated_hours,
            status=ProjectStatus.NOT_STARTED,
        )

        url = f"/api/v1/project-lab/my-projects/{user_project.id}/status/"

        # Transition to IN_PROGRESS
        resp1 = self.client1.patch(
            url,
            {
                "status": ProjectStatus.IN_PROGRESS,
                "notes": "Started working on initial DB schemas.",
            },
            format="json",
        )
        self.assertEqual(resp1.status_code, status.HTTP_200_OK)
        self.assertEqual(resp1.data["data"]["status"], ProjectStatus.IN_PROGRESS)
        self.assertIsNotNone(resp1.data["data"]["started_at"])
        self.assertIsNone(resp1.data["data"]["completed_at"])

        # Transition to COMPLETED with repo link
        resp2 = self.client1.patch(
            url,
            {
                "status": ProjectStatus.COMPLETED,
                "repo_link": "https://github.com/student1/db-analyzer",
                "notes": "Finished and tested all features.",
            },
            format="json",
        )
        self.assertEqual(resp2.status_code, status.HTTP_200_OK)
        self.assertEqual(resp2.data["data"]["status"], ProjectStatus.COMPLETED)
        self.assertIsNotNone(resp2.data["data"]["completed_at"])

        # Invalid transition: COMPLETED -> IN_PROGRESS is disallowed
        resp3 = self.client1.patch(
            url,
            {"status": ProjectStatus.IN_PROGRESS},
            format="json",
        )
        self.assertEqual(resp3.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_user_project(self):
        user_project = UserProject.objects.create(
            user=self.user1,
            title="To Be Deleted",
            description="Short lived",
            difficulty=Difficulty.EASY,
            tech_stack=["JS"],
            estimated_hours=5,
            status=ProjectStatus.NOT_STARTED,
        )

        url = f"/api/v1/project-lab/my-projects/{user_project.id}/"

        response = self.client1.delete(url)
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_204_NO_CONTENT])
        self.assertFalse(UserProject.objects.filter(id=user_project.id).exists())

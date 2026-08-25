"""Management command to seed production-grade career roles and roadmap learning trees."""

import logging
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.roadmaps.constants import DifficultyLevel, ResourceType
from apps.roadmaps.models import (
    CareerRole,
    Roadmap,
    RoadmapPhase,
    RoadmapResource,
    RoadmapStep,
)

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Seeds initial production-grade career roles, roadmap templates, phases, steps, and resources."

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding Career Roadmaps..."))

        # ----------------------------------------------------
        # 1. Backend Developer Roadmap
        # ----------------------------------------------------
        backend_role, _ = CareerRole.objects.get_or_create(
            slug="backend-developer",
            defaults={
                "title": "Backend Developer",
                "description": "Master server-side programming, databases, RESTful APIs, authentication, testing, and deployment to build scalable backend systems.",
                "category": "Web Development",
                "difficulty": DifficultyLevel.INTERMEDIATE,
                "estimated_duration_weeks": 16,
                "icon_name": "server",
                "is_active": True,
            },
        )

        backend_roadmap, _ = Roadmap.objects.get_or_create(
            career_role=backend_role,
            defaults={
                "title": "Production Backend Developer Learning Journey",
                "description": "A step-by-step guided roadmap to become a professional software backend engineer.",
                "version": "1.0.0",
                "total_phases": 9,
                "is_published": True,
            },
        )

        # Clear existing phases for re-seeding cleanly if needed
        RoadmapPhase.objects.filter(roadmap=backend_roadmap).delete()

        phases_data = [
            {
                "order": 1,
                "title": "Programming Fundamentals & Data Structures",
                "description": "Build a strong foundation in core language syntax, control flow, object-oriented programming, and essential data structures.",
                "estimated_hours": 30,
                "learning_objective": "Write clean, modular, object-oriented Python/language code with algorithmic problem solving.",
                "steps": [
                    {
                        "order": 1,
                        "title": "Core Syntax, Control Flow & Data Types",
                        "description": "Understand variables, primitive data types, loops, conditionals, and functions.",
                        "learning_objective": "Master basic programming building blocks and algorithmic logic.",
                        "what_to_learn": ["Variables & Data Types", "Conditionals & Loops", "Function definition & scoping"],
                        "what_to_practice": ["Solve 15 basic logic problems on LeetCode/HackerRank", "Write modular utility scripts"],
                        "what_to_build": ["CLI Student Grade Calculator"],
                        "completion_criteria": "Able to write clean, bug-free Python functions handling arrays, strings, and loops.",
                        "estimated_hours": 10,
                        "difficulty": DifficultyLevel.BEGINNER,
                        "resources": [
                            {"title": "Python Official Tutorial", "url": "https://docs.python.org/3/tutorial/", "resource_type": ResourceType.DOCUMENTATION, "provider": "Python Docs", "is_free": True},
                        ],
                    },
                    {
                        "order": 2,
                        "title": "Object-Oriented Programming (OOP)",
                        "description": "Learn classes, objects, inheritance, encapsulation, polymorphism, and magic methods.",
                        "learning_objective": "Structure complex codebases using object-oriented principles.",
                        "what_to_learn": ["Classes & Instances", "Inheritance & Composition", "Encapsulation & Access Modifiers", "Polymorphism"],
                        "what_to_practice": ["Design a Bank Account class hierarchy", "Implement custom dunder methods"],
                        "what_to_build": ["CLI Library Management System"],
                        "completion_criteria": "Successfully model real-world domain entities using OOP classes and inheritance.",
                        "estimated_hours": 12,
                        "difficulty": DifficultyLevel.INTERMEDIATE,
                        "resources": [
                            {"title": "Real Python OOP Guide", "url": "https://realpython.com/python3-object-oriented-programming/", "resource_type": ResourceType.ARTICLE, "provider": "Real Python", "is_free": True},
                        ],
                    },
                ],
            },
            {
                "order": 2,
                "title": "Git & Development Workflow",
                "description": "Learn version control, branching strategies, commit discipline, and GitHub collaboration.",
                "estimated_hours": 15,
                "learning_objective": "Use Git fluently for daily software engineering workflows.",
                "steps": [
                    {
                        "order": 1,
                        "title": "Git Fundamentals & Branching",
                        "description": "Master init, clone, add, commit, push, pull, branch, checkout, and merge.",
                        "learning_objective": "Manage code history safely using local and remote repositories.",
                        "what_to_learn": ["Git Object Model", "Branching & Merging", "Resolving Merge Conflicts", "Git Stash & Rebase"],
                        "what_to_practice": ["Create feature branches and resolve simulated merge conflicts"],
                        "what_to_build": ["Open Source Pull Request on GitHub"],
                        "completion_criteria": "Comfortably work with feature branches, PRs, and merge conflict resolutions.",
                        "estimated_hours": 8,
                        "difficulty": DifficultyLevel.BEGINNER,
                        "resources": [
                            {"title": "Pro Git Book", "url": "https://git-scm.com/book/en/v2", "resource_type": ResourceType.BOOK, "provider": "Git Official", "is_free": True},
                        ],
                    },
                ],
            },
            {
                "order": 3,
                "title": "Backend Fundamentals & Web Protocols",
                "description": "Understand Client-Server architecture, HTTP/HTTPS protocols, headers, status codes, and Web Servers.",
                "estimated_hours": 25,
                "learning_objective": "Comprehend how the web works at the protocol level.",
                "steps": [
                    {
                        "order": 1,
                        "title": "HTTP Protocol & Request-Response Cycle",
                        "description": "Deep dive into HTTP methods (GET, POST, PUT, DELETE, PATCH), status codes, headers, and payload formats.",
                        "learning_objective": "Analyze HTTP request/response traffic using cURL and DevTools.",
                        "what_to_learn": ["HTTP Request Methods", "HTTP Status Code Families (2xx, 3xx, 4xx, 5xx)", "Headers & Cookies", "JSON & Form Payloads"],
                        "what_to_practice": ["Execute cURL requests against public APIs"],
                        "what_to_build": ["Raw HTTP Socket Server in Python"],
                        "completion_criteria": "Explain the full lifecycle of an HTTP request from browser to server and back.",
                        "estimated_hours": 10,
                        "difficulty": DifficultyLevel.INTERMEDIATE,
                        "resources": [
                            {"title": "MDN HTTP Overview", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview", "resource_type": ResourceType.DOCUMENTATION, "provider": "MDN Web Docs", "is_free": True},
                        ],
                    },
                ],
            },
            {
                "order": 4,
                "title": "Databases & Relational Modeling",
                "description": "Master SQL, PostgreSQL, database normalization, indexing, joins, and Django ORM.",
                "estimated_hours": 35,
                "learning_objective": "Design normalized database schemas and execute optimized SQL queries.",
                "steps": [
                    {
                        "order": 1,
                        "title": "Relational Database Design & SQL",
                        "description": "Learn DDL, DML, Foreign Keys, JOINs, Indexes, and ACID transactions.",
                        "learning_objective": "Write complex SQL queries and design normalized database schemas.",
                        "what_to_learn": ["Entity-Relationship (ER) Diagrams", "Normalization (1NF to 3NF)", "INNER/LEFT/RIGHT JOINs", "Database Indexing & B-Trees"],
                        "what_to_practice": ["Write 20 complex SQL queries joining multiple tables"],
                        "what_to_build": ["E-Commerce Relational Database Schema"],
                        "completion_criteria": "Design a 3NF normalized database schema with appropriate foreign keys and indexes.",
                        "estimated_hours": 15,
                        "difficulty": DifficultyLevel.INTERMEDIATE,
                        "resources": [
                            {"title": "PostgreSQL Tutorial", "url": "https://www.postgresqltutorial.com/", "resource_type": ResourceType.DOCUMENTATION, "provider": "PostgreSQL", "is_free": True},
                        ],
                    },
                    {
                        "order": 2,
                        "title": "Django ORM & Migrations",
                        "description": "Master Django Model definitions, Field types, QuerySets, Migrations, select_related, and prefetch_related.",
                        "learning_objective": "Interact with relational databases fluently through Django's ORM.",
                        "what_to_learn": ["Django Model Classes & Fields", "OneToOne, ForeignKey, ManyToMany", "QuerySet API & Chaining", "N+1 Query Problem & prefetch_related"],
                        "what_to_practice": ["Optimize slow ORM queries using select_related"],
                        "what_to_build": ["Blog Data Engine with Custom QuerySet Managers"],
                        "completion_criteria": "Build a Django ORM data layer that executes 0 unnecessary N+1 queries.",
                        "estimated_hours": 15,
                        "difficulty": DifficultyLevel.INTERMEDIATE,
                        "resources": [
                            {"title": "Django Models & Database Documentation", "url": "https://docs.djangoproject.com/en/stable/topics/db/models/", "resource_type": ResourceType.DOCUMENTATION, "provider": "Django Docs", "is_free": True},
                        ],
                    },
                ],
            },
            {
                "order": 5,
                "title": "REST API Development",
                "description": "Design and build production RESTful Web APIs using Django REST Framework.",
                "estimated_hours": 30,
                "learning_objective": "Build RESTful APIs following industry standards, status codes, and serialization.",
                "steps": [
                    {
                        "order": 1,
                        "title": "Django REST Framework (DRF) & Serializers",
                        "description": "Learn APIView, GenericAPIView, ModelViewSet, Serializers, and validation logic.",
                        "learning_objective": "Expose JSON REST endpoints backed by Django models.",
                        "what_to_learn": ["DRF Architecture & Request/Response", "ModelSerializer & Field Validation", "ViewSets & Routers", "Pagination & Filtering"],
                        "what_to_practice": ["Build CRUD APIView for managing portfolio projects"],
                        "what_to_build": ["Product Catalog REST API with Filtering & Search"],
                        "completion_criteria": "Expose fully functional, validated RESTful endpoints returning JSON.",
                        "estimated_hours": 15,
                        "difficulty": DifficultyLevel.INTERMEDIATE,
                        "resources": [
                            {"title": "Django REST Framework Guide", "url": "https://www.django-rest-framework.org/", "resource_type": ResourceType.DOCUMENTATION, "provider": "DRF Official", "is_free": True},
                        ],
                    },
                ],
            },
            {
                "order": 6,
                "title": "Authentication, Security & Authorization",
                "description": "Implement secure authentication (JWT, OAuth2), password hashing, permission classes, CORS, and IDOR prevention.",
                "estimated_hours": 25,
                "learning_objective": "Secure backend APIs against common web vulnerabilities (OWASP Top 10).",
                "steps": [
                    {
                        "order": 1,
                        "title": "JWT Authentication & Object-Level Permissions",
                        "description": "Implement SimpleJWT, access/refresh tokens, custom permission classes, and IDOR protection.",
                        "learning_objective": "Protect API endpoints so users can only access authorized resources.",
                        "what_to_learn": ["JWT Claims & Signature Verification", "Refresh Token Rotation", "DRF Custom Permissions", "IDOR & Scoped QuerySets"],
                        "what_to_practice": ["Write a custom IsOwner permission class"],
                        "what_to_build": ["Secure Auth API with JWT & OTP Verification"],
                        "completion_criteria": "Build an authentication flow resistant to IDOR and unauthorized token reuse.",
                        "estimated_hours": 12,
                        "difficulty": DifficultyLevel.ADVANCED,
                        "resources": [
                            {"title": "OWASP Top 10 Security Risks", "url": "https://owasp.org/www-project-top-ten/", "resource_type": ResourceType.DOCUMENTATION, "provider": "OWASP", "is_free": True},
                        ],
                    },
                ],
            },
            {
                "order": 7,
                "title": "Automated Testing & Quality Assurance",
                "description": "Write automated unit tests, integration tests, API client tests, and mocks using Pytest and Django TestCase.",
                "estimated_hours": 20,
                "learning_objective": "Achieve high test coverage and enforce software reliability.",
                "steps": [
                    {
                        "order": 1,
                        "title": "Unit & Integration Testing in Django",
                        "description": "Learn TestCase, APIClient, Fixtures, Mocking external APIs, and code coverage tools.",
                        "learning_objective": "Write clean automated tests verifying API contracts and database integrity.",
                        "what_to_learn": ["Django TestCase & APIClient", "Pytest & Markers", "Mocking external services (unittest.mock)", "Coverage.py"],
                        "what_to_practice": ["Write 15 unit tests covering edge cases"],
                        "what_to_build": ["Automated Test Suite for E-Commerce API"],
                        "completion_criteria": "Maintain 90%+ branch test coverage across views, serializers, and service layers.",
                        "estimated_hours": 10,
                        "difficulty": DifficultyLevel.INTERMEDIATE,
                        "resources": [
                            {"title": "Django Testing Documentation", "url": "https://docs.djangoproject.com/en/stable/topics/testing/", "resource_type": ResourceType.DOCUMENTATION, "provider": "Django Docs", "is_free": True},
                        ],
                    },
                ],
            },
            {
                "order": 8,
                "title": "Containerization & Cloud Deployment",
                "description": "Package applications with Docker & Docker Compose, configure Gunicorn/Nginx, environment secrets, and CI/CD.",
                "estimated_hours": 25,
                "learning_objective": "Deploy backend applications to cloud infrastructure reliably.",
                "steps": [
                    {
                        "order": 1,
                        "title": "Docker, Docker Compose & Production Deployment",
                        "description": "Write Dockerfiles, docker-compose.yml, environment variables management, and production WSGI servers.",
                        "learning_objective": "Run containerized Django applications in production environments.",
                        "what_to_learn": ["Dockerfile multi-stage builds", "Docker Compose services (App, Postgres, Redis)", "Gunicorn & Nginx configuration", "Environment Secrets Management"],
                        "what_to_practice": ["Containerize Django app with Postgres DB using Docker Compose"],
                        "what_to_build": ["Production Cloud Deployment on AWS/DigitalOcean"],
                        "completion_criteria": "Deploy a containerized production Django application accessible over HTTPS.",
                        "estimated_hours": 12,
                        "difficulty": DifficultyLevel.ADVANCED,
                        "resources": [
                            {"title": "Docker Get Started Guide", "url": "https://docs.docker.com/get-started/", "resource_type": ResourceType.DOCUMENTATION, "provider": "Docker", "is_free": True},
                        ],
                    },
                ],
            },
            {
                "order": 9,
                "title": "Interview Preparation & Capstone Projects",
                "description": "Build capstone portfolio projects, practice System Design fundamentals, and conquer technical interviews.",
                "estimated_hours": 30,
                "learning_objective": "Prepare for technical backend engineering interviews and present a portfolio.",
                "steps": [
                    {
                        "order": 1,
                        "title": "System Design Basics & Portfolio Capstone",
                        "description": "Learn caching (Redis), task queues (Celery), database scaling, and present a polished capstone project.",
                        "learning_objective": "Architect scalable backend systems and explain technical decisions.",
                        "what_to_learn": ["Caching Strategies (Redis)", "Background Tasks (Celery)", "System Design Principles", "Portfolio Polish"],
                        "what_to_practice": ["Design a high-throughput notification system"],
                        "what_to_build": ["Full-Stack AI Career Copilot Capstone Application"],
                        "completion_criteria": "Complete and showcase a full-stack production capstone project on GitHub.",
                        "estimated_hours": 15,
                        "difficulty": DifficultyLevel.ADVANCED,
                        "resources": [
                            {"title": "System Design Primer", "url": "https://github.com/donnemartin/system-design-primer", "resource_type": ResourceType.DOCUMENTATION, "provider": "GitHub", "is_free": True},
                        ],
                    },
                ],
            },
        ]

        previous_step = None
        for p_data in phases_data:
            steps_data = p_data.pop("steps")
            phase = RoadmapPhase.objects.create(
                roadmap=backend_roadmap,
                **p_data
            )

            for s_data in steps_data:
                resources_data = s_data.pop("resources", [])
                s_data["prerequisite_step"] = previous_step

                step = RoadmapStep.objects.create(
                    phase=phase,
                    **s_data
                )
                previous_step = step

                for r_data in resources_data:
                    RoadmapResource.objects.create(
                        step=step,
                        **r_data
                    )

        # ----------------------------------------------------
        # 2. Frontend Developer Roadmap (Summary Seed)
        # ----------------------------------------------------
        frontend_role, _ = CareerRole.objects.get_or_create(
            slug="frontend-developer",
            defaults={
                "title": "Frontend Developer",
                "description": "Master HTML5, modern CSS, JavaScript (ES6+), React 19, Redux Toolkit, Tailwind CSS, and web performance.",
                "category": "Web Development",
                "difficulty": DifficultyLevel.BEGINNER,
                "estimated_duration_weeks": 14,
                "icon_name": "layout",
                "is_active": True,
            },
        )

        frontend_roadmap, _ = Roadmap.objects.get_or_create(
            career_role=frontend_role,
            defaults={
                "title": "Modern Frontend Developer (React & TypeScript) Journey",
                "description": "Become a skilled frontend engineer building reactive, accessible, high-performance web applications.",
                "version": "1.0.0",
                "total_phases": 4,
                "is_published": True,
            },
        )

        RoadmapPhase.objects.filter(roadmap=frontend_roadmap).delete()

        fe_phases = [
            {
                "order": 1,
                "title": "HTML5, CSS3 & Responsive UI Design",
                "description": "Master semantic markup, Flexbox, CSS Grid, Tailwind CSS, and mobile-first responsive layouts.",
                "estimated_hours": 20,
                "learning_objective": "Build modern responsive web layouts with Tailwind CSS.",
                "steps": [
                    {
                        "order": 1,
                        "title": "Semantic HTML5 & Responsive Tailwind Layouts",
                        "description": "Learn semantic elements, accessibility (a11y), CSS Flexbox/Grid, and Tailwind CSS utility classes.",
                        "learning_objective": "Create responsive web pages that adapt cleanly across mobile and desktop devices.",
                        "what_to_learn": ["Semantic HTML Tags", "Flexbox & Grid Layouts", "Tailwind CSS Utility Classes", "Responsive Breakpoints"],
                        "what_to_practice": ["Replicate a modern SaaS landing page layout"],
                        "what_to_build": ["Responsive Portfolio Landing Page"],
                        "completion_criteria": "Build a responsive web layout that passes mobile Google Lighthouse audits.",
                        "estimated_hours": 10,
                        "difficulty": DifficultyLevel.BEGINNER,
                        "resources": [
                            {"title": "Tailwind CSS Documentation", "url": "https://tailwindcss.com/docs", "resource_type": ResourceType.DOCUMENTATION, "provider": "Tailwind", "is_free": True},
                        ],
                    },
                ],
            },
            {
                "order": 2,
                "title": "Modern JavaScript & Async Programming",
                "description": "Master ES6+ features, DOM manipulation, promises, async/await, and Fetch/Axios API integration.",
                "estimated_hours": 25,
                "learning_objective": "Write asynchronous JavaScript communicating with backend REST APIs.",
                "steps": [
                    {
                        "order": 1,
                        "title": "JavaScript ES6+ & Fetch API",
                        "description": "Learn arrow functions, destructuring, modules, promises, async/await, and Axios.",
                        "learning_objective": "Fetch data asynchronously from REST APIs and update the DOM dynamically.",
                        "what_to_learn": ["ES6+ Syntax", "Promises & Async/Await", "Axios Interceptors & Error Handling", "DOM Manipulation"],
                        "what_to_practice": ["Build a weather dashboard using public APIs"],
                        "what_to_build": ["Interactive Movie Search Web Application"],
                        "completion_criteria": "Successfully fetch and display dynamic API data with error states.",
                        "estimated_hours": 12,
                        "difficulty": DifficultyLevel.INTERMEDIATE,
                        "resources": [
                            {"title": "MDN JavaScript Guide", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", "resource_type": ResourceType.DOCUMENTATION, "provider": "MDN", "is_free": True},
                        ],
                    },
                ],
            },
            {
                "order": 3,
                "title": "React 19 & State Management",
                "description": "Master React components, hooks (useState, useEffect, useMemo), Redux Toolkit, and React Router.",
                "estimated_hours": 35,
                "learning_objective": "Build single page applications with React and Redux Toolkit.",
                "steps": [
                    {
                        "order": 1,
                        "title": "React 19 Architecture & Redux Toolkit",
                        "description": "Learn functional components, props, hooks, custom hooks, Redux Toolkit slices/thunks, and React Router v6.",
                        "learning_objective": "Manage complex global state and application routing cleanly.",
                        "what_to_learn": ["React Components & Props", "Hooks (useState, useEffect, useCallback)", "Redux Toolkit Slices & Async Thunks", "React Router Navigation"],
                        "what_to_practice": ["Convert a stateful component to use Redux Toolkit"],
                        "what_to_build": ["AI Career Copilot Dashboard Frontend"],
                        "completion_criteria": "Build a multi-page React single page application powered by Redux Toolkit.",
                        "estimated_hours": 18,
                        "difficulty": DifficultyLevel.INTERMEDIATE,
                        "resources": [
                            {"title": "React Documentation", "url": "https://react.dev/", "resource_type": ResourceType.DOCUMENTATION, "provider": "React Team", "is_free": True},
                        ],
                    },
                ],
            },
            {
                "order": 4,
                "title": "Testing, Build Tools & Deployment",
                "description": "Learn Vite, Vitest, React Testing Library, bundle optimization, and Vercel/Netlify deployment.",
                "estimated_hours": 20,
                "learning_objective": "Test and deploy modern frontend applications to production.",
                "steps": [
                    {
                        "order": 1,
                        "title": "Frontend Testing & Cloud Deployment",
                        "description": "Write component tests using React Testing Library and deploy built assets to production CDNs.",
                        "learning_objective": "Verify component UI rendering and deploy built production bundles.",
                        "what_to_learn": ["Vite Build Tools", "React Testing Library", "Lighthouse CWV Optimization", "Vercel / Cloudflare Pages"],
                        "what_to_practice": ["Write 10 component tests for form validation"],
                        "what_to_build": ["Production Ready Web Application Deployed on Vercel"],
                        "completion_criteria": "Deploy a tested React web application with automated continuous deployment.",
                        "estimated_hours": 10,
                        "difficulty": DifficultyLevel.INTERMEDIATE,
                        "resources": [
                            {"title": "Vite Guide", "url": "https://vitejs.dev/guide/", "resource_type": ResourceType.DOCUMENTATION, "provider": "Vite", "is_free": True},
                        ],
                    },
                ],
            },
        ]

        prev_fe_step = None
        for p_data in fe_phases:
            steps_data = p_data.pop("steps")
            phase = RoadmapPhase.objects.create(
                roadmap=frontend_roadmap,
                **p_data
            )
            for s_data in steps_data:
                resources_data = s_data.pop("resources", [])
                s_data["prerequisite_step"] = prev_fe_step
                step = RoadmapStep.objects.create(
                    phase=phase,
                    **s_data
                )
                prev_fe_step = step
                for r_data in resources_data:
                    RoadmapResource.objects.create(step=step, **r_data)

        # ----------------------------------------------------
        # Additional Quick Featured Roles
        # ----------------------------------------------------
        additional_roles = [
            {
                "title": "Full Stack Developer",
                "slug": "full-stack-developer",
                "description": "Master end-to-end web engineering from React/Next.js frontend user interfaces to Django/Node.js REST APIs and database design.",
                "category": "Web Development",
                "difficulty": DifficultyLevel.ADVANCED,
                "estimated_duration_weeks": 20,
                "icon_name": "cpu",
                "is_active": True,
            },
            {
                "title": "DevOps & Cloud Engineer",
                "slug": "devops-engineer",
                "description": "Master CI/CD pipelines, Docker containerization, Kubernetes orchestration, Terraform IaC, AWS/GCP cloud architectures, and monitoring.",
                "category": "Cloud & Infrastructure",
                "difficulty": DifficultyLevel.ADVANCED,
                "estimated_duration_weeks": 18,
                "icon_name": "server",
                "is_active": True,
            },
            {
                "title": "Data Scientist & AI Engineer",
                "slug": "data-scientist-ai-engineer",
                "description": "Master Python data science (NumPy, Pandas), Machine Learning (Scikit-Learn), Deep Learning (PyTorch), LLM orchestration (LangChain), and RAG.",
                "category": "Artificial Intelligence",
                "difficulty": DifficultyLevel.ADVANCED,
                "estimated_duration_weeks": 22,
                "icon_name": "cpu",
                "is_active": True,
            },
            {
                "title": "Mobile App Developer",
                "slug": "mobile-app-developer",
                "description": "Master cross-platform mobile app development with React Native or Flutter, native device APIs, state management, and App Store deployments.",
                "category": "Mobile Development",
                "difficulty": DifficultyLevel.INTERMEDIATE,
                "estimated_duration_weeks": 16,
                "icon_name": "layout",
                "is_active": True,
            },
        ]

        for r_info in additional_roles:
            CareerRole.objects.get_or_create(
                slug=r_info["slug"],
                defaults=r_info,
            )

        self.stdout.write(self.style.SUCCESS("Successfully seeded Career Roadmaps!"))

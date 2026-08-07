<div align="center">

# 🚀 AI Career Copilot

### *Your intelligent career companion — built to get you hired.*

**A full-stack AI-powered SaaS platform that helps you build, analyse, and optimise your resume using advanced LangChain pipelines, structured LLM output, and a live resume editor — all in one place.**

<br/>

![Python](https://img.shields.io/badge/Python-3.12+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-6.0-092E20?style=for-the-badge&logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![LangChain](https://img.shields.io/badge/LangChain-0.3-1C3C3C?style=for-the-badge&logo=chainlink&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-F55036?style=for-the-badge&logo=groq&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<br/>

[📖 Documentation](#-installation) · [🤖 AI Pipeline](#-resume-ai-pipeline) · [🛠️ API Reference](#-api-overview) · [🗺️ Roadmap](#-future-roadmap)

</div>

---

## 📌 Overview

**AI Career Copilot** is a production-grade, full-stack SaaS platform designed to help job seekers build, manage, and AI-analyse their resumes — all within a single, unified interface.

### The Problem

Crafting a great resume is hard. Most candidates:
- Don't know how to pass ATS (Applicant Tracking Systems)
- Use generic templates with no personalisation
- Lack feedback on grammar, impact, and keyword coverage
- Struggle to translate their real experience into compelling content

### The Solution

AI Career Copilot provides:
- A **visual, section-based resume builder** with live preview
- An **AI analysis engine** powered by LangChain + Groq (LLaMA 3.3 70B) that scores every section
- Structured, Pydantic-validated AI output — not hallucinations, but evidence-based feedback
- **ATS compatibility scoring**, grammar scoring, readability scoring, and impact scoring
- A **per-section breakdown** with strengths, weaknesses, missing keywords, and prioritised suggestions

### Who Is It For?

- 🎓 Students and fresh graduates entering the job market
- 💼 Professionals updating their resumes
- 🔄 Career switchers needing targeted feedback
- 🏢 Developers showcasing technical portfolios

---

## ✨ Key Features

### ✅ Currently Implemented

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Email/password login + Google OAuth 2.0 + OTP email verification |
| 🛡️ **Rate Limiting** | IP-based rate limiting on all auth endpoints via `django-ratelimit` |
| ⚡ **Redis Caching** | User data cached in Redis to reduce database load |
| 📄 **Resume Builder** | Create and manage multiple resumes with title, template, theme, and font settings |
| 🎨 **4 Resume Templates** | Classic, Modern, Minimal, Developer |
| 👤 **Resume Profile** | Full personal info — name, headline, photo, phone, address, city, state, country |
| 📸 **Profile Image Upload** | Photo upload with Cloudinary integration |
| 📝 **Professional Summary** | Dedicated summary section per resume |
| 💼 **Work Experience** | Multi-entry experience with employment type, location, dates, and descriptions |
| 🎓 **Education** | Multi-entry education with institution, degree, field of study, and grade |
| 🛠️ **Skills** | Skills with category (Frontend, Backend, AI/ML, etc.) and proficiency level |
| 📁 **Projects** | Projects with title, role, technologies, descriptions, GitHub and live demo URLs |
| 🏅 **Certifications** | Certifications with issuer, credential ID, URL, and expiry |
| 🌍 **Languages** | Languages with proficiency levels |
| 🔗 **Social Links** | Links to GitHub, LinkedIn, portfolio, and other platforms |
| 📖 **Achievements** | Dedicated achievement entries |
| 📋 **References** | Professional references section |
| 🗂️ **Custom Sections** | Custom, user-defined resume sections |
| 🤖 **AI Resume Analysis** | Full AI-powered resume scoring via LangChain + ChatGroq |
| 📊 **Multi-Dimensional Scoring** | ATS score, grammar score, readability score, impact score, and overall score |
| 🔬 **Section-Level Feedback** | Per-section strengths, weaknesses, missing keywords, and improvement suggestions |
| 🎯 **Structured AI Output** | Pydantic v2-validated, schema-enforced LLM responses — no hallucinations |
| 📑 **Score Normalisation** | Deterministic score clamping and recalculation — independent of LLM's self-report |
| 🔄 **Resume Actions** | Create, update, delete, duplicate, publish/unpublish, and set default resume |
| 🔒 **Ownership Permissions** | Per-object permission enforcement on every resume and section |
| 🐳 **Docker Compose** | Full containerised stack — backend, frontend, Postgres 17, Redis 7 |
| 📚 **OpenAPI / Swagger** | Auto-generated API docs via drf-spectacular (Swagger UI + ReDoc) |
| 📋 **Structured Logging** | Per-module Python logging with `app.log` and `error.log` |
| 🧪 **Test Suite** | Unit and integration tests for auth, resume API, and services |
| 📐 **Form Validation** | Zod schema validation on all frontend resume section forms |

### 🔮 Upcoming Features

> These features are **planned** and are **not yet implemented** in the codebase.

| Feature | Status |
|---|---|
| 🎙️ **Interview Copilot** | `Planned` |
| 🗺️ **AI Career Roadmap** | `Planned` |
| 🔍 **Job Match Engine** | `Planned` |
| 🧠 **Skill Gap Analysis** | `Planned` |
| 🔬 **AI Project Lab** | `Planned` (page stub exists) |
| 🤖 **LangGraph Agentic Workflows** | `Planned` |

---

## 🤖 AI Architecture

The Resume AI module is a self-contained bounded context inside `backend/apps/resume_ai/`. It is built around a clean, layered architecture where every component has one job.

### Core Components

```
backend/apps/resume_ai/
├── chains/
│   └── resume_analysis_chain.py   # LangChain LCEL chain: prompt | LLM.with_structured_output()
├── llm/
│   └── provider.py                # Provider-neutral LLM factory (Groq, extensible to OpenAI etc.)
├── prompts/
│   ├── ats_prompt.py              # System prompt — defines AI reviewer persona
│   ├── resume_analysis.py         # Human prompt — analysis instructions + resume input
│   ├── improve_summary.py         # Prompt for rewriting professional summaries
│   ├── improve_experience.py      # Prompt for improving work experience bullets
│   ├── improve_project.py         # Prompt for rewriting project descriptions
│   └── improve_skills.py          # Prompt for skills analysis
├── schemas/
│   ├── analysis_schema.py         # ResumeAnalysis + ResumeScores (Pydantic v2 BaseModel)
│   ├── section_schema.py          # SectionAnalysis + Suggestion (per-section result)
│   └── score_schema.py            # Score + ResumeScore + SectionScore
├── services/
│   ├── parser_service.py          # ORM → plain dict extraction (select_related + prefetch_related)
│   ├── formatter_service.py       # Dict → structured Markdown (LLM context prep)
│   ├── prompt_service.py          # Template rendering + token estimation + size guards
│   ├── ai_service.py              # Application boundary — wraps ResumeAnalysisChain
│   ├── analysis_service.py        # Orchestrator — coordinates all pipeline stages
│   └── score_service.py           # Clamp + recalculate + grade + level + color
└── exceptions.py                  # Typed exception hierarchy
```

### LLM Provider

`LLMProvider` uses `@lru_cache` to reuse a single `ChatGroq` instance per application process. It validates all numeric settings (temperature, max tokens, timeout) before constructing the client, and will raise `LLMConfigurationException` if any setting is missing or out of range.

The provider is designed to be **extensible** — adding OpenAI, Anthropic, or Gemini requires only a new branch in `LLMProvider.get_llm()`, with zero changes to chains or services.

**Default Model:** `llama-3.3-70b-versatile` via Groq

### Structured Output

The chain uses LangChain's `.with_structured_output(ResumeAnalysis, include_raw=True)` to force the LLM into returning a Pydantic-validated payload. The `include_raw=True` flag enables extraction of `usage_metadata` for token logging, and explicit `parsing_error` detection. If the LLM returns invalid structure, a `ChainExecutionException` is raised — never a silent failure.

### Prompt Safety

- Resume content is wrapped in `<resume>` XML tags and explicitly marked as **untrusted input** in the system prompt to prevent prompt injection.
- The formatter enforces a **16,000-character hard limit** on resume content before sending to the LLM.
- The prompt service enforces a **20,000-character total prompt limit**.
- Both limits are defined as `Final` typed constants in `constants.py`.

### Score Engine

`ScoreService` performs **deterministic post-processing** after the LLM returns:
1. **Clamps** all scores to `[0, 100]` — rejecting any out-of-range LLM values
2. **Recalculates** the overall score as `mean(ats, grammar, readability, impact)` — never trusting the LLM's self-reported overall score
3. **Derives** letter grade (A+ through F), performance level label, and UI color token for every score

---

## 🔄 Resume AI Pipeline

The complete data flow from HTTP request to structured frontend response:

```
POST /api/v1/resume-ai/analyze/
        │
        ▼
┌─────────────────────┐
│  ResumeAnalysisAPIView  │  ← JWT auth guard + request serializer validation
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│   ParserService      │  ← Loads Resume via ORM with select_related + prefetch_related
│   .get_optimized_   │    Extracts: profile, summary, experience, education,
│   resume()          │    projects, skills, certifications, languages
│   .build_resume_    │    Returns: plain Python dict (provider-safe, no PII leakage)
│   data()            │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│  FormatterService   │  ← Converts parsed dict → structured Markdown document
│  .to_markdown()     │    Enforces 16,000-char context window safety limit
│                     │    Truncates with clear marker if limit exceeded
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│  AnalysisService    │  ← Validates markdown has actual content before LLM call
│  .analyze()         │    Raises ValidationException if resume is empty
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│    AIService        │  ← Thin adapter — delegates to ResumeAnalysisChain
│  .analyze()         │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ ResumeAnalysisChain │  ← LangChain LCEL: ChatPromptTemplate | ChatGroq
│  .invoke()          │    .with_structured_output(ResumeAnalysis, include_raw=True)
│                     │    LLM: llama-3.3-70b-versatile (Groq)
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│  ScoreService       │  ← Normalise → Clamp → Recalculate overall score
│  .normalize_scores()│    Assigns grade, level, and color token per score
│  .calculate_overall │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│  API Response       │  ← ResumeAnalysis.model_dump() → JSON
│  (HTTP 200)         │    Sections: scores, strengths, weaknesses,
│                     │    recommendations, missing_keywords, per-section analysis
└─────────────────────┘
        │
        ▼
    Frontend (React)
```

---

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI library |
| Vite | 8 | Build tool and dev server |
| Redux Toolkit | 2.12 | Global state management |
| Redux Persist | 6.0 | Auth state persistence |
| React Router DOM | 7.17 | Client-side routing |
| Tailwind CSS | 4.3 | Utility-first styling |
| Framer Motion | 12.42 | Animations and transitions |
| Axios | 1.17 | HTTP client |
| React Hook Form | 7.80 | Form state management |
| Zod | 4.4 | Schema validation |
| Lucide React | 1.18 | Icon library |
| Radix UI | 1.5 | Accessible UI primitives |
| Sonner | 2.0 | Toast notifications |
| Google OAuth | 0.13 | Google sign-in |
| Geist Font | – | Primary typeface |
| Inter Font | – | Secondary typeface |
| IBM Plex Mono | – | Code/mono typeface |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Python | 3.12+ | Runtime |
| Django | 6.0.6 | Web framework |
| Django REST Framework | 3.17.1 | API framework |
| SimpleJWT | 5.5.1 | JWT authentication |
| drf-spectacular | 0.29.0 | OpenAPI schema generation |
| django-cors-headers | 4.9.0 | CORS handling |
| django-filter | 25.2 | Queryset filtering |
| django-ratelimit | 4.1.0 | IP-based rate limiting |
| django-redis | 7.0.0 | Redis cache backend |
| Gunicorn | 26.0.0 | WSGI production server |
| python-decouple | 3.8 | Environment variable management |
| Pillow | 12.2.0 | Image processing |

### AI / LLM

| Technology | Version | Purpose |
|---|---|---|
| LangChain | 0.3+ | LLM orchestration framework |
| langchain-core | 0.3+ | LCEL primitives and interfaces |
| langchain-groq | 0.2+ | Groq-specific LangChain integration |
| Groq SDK | 0.31+ | Groq API client |
| Pydantic | 2.11+ | Structured output validation |
| LangSmith | 0.1+ | LLM observability and tracing |
| LLaMA 3.3 70B | – | Default LLM model (via Groq) |

### Database & Infrastructure

| Technology | Version | Purpose |
|---|---|---|
| PostgreSQL | 17 | Primary relational database |
| Redis | 7 | Cache backend + session store |
| Cloudinary | – | Profile image storage (CDN) |
| Docker | – | Containerisation |
| Docker Compose | – | Multi-service orchestration |

---

## 📁 Folder Structure

```
ai-career-copilot/
│
├── 📄 docker-compose.yml          # Orchestrates: frontend, backend, postgres, redis
├── 📄 README.md
│
├── 🖥️ frontend/                   # React + Vite SPA
│   ├── 📄 package.json
│   ├── 📄 vite.config.js          # Path alias: @ → ./src
│   ├── 📄 Dockerfile
│   └── src/
│       ├── 📄 main.jsx            # App root — Redux Provider + Google OAuth Provider
│       ├── 📄 App.jsx
│       ├── app/
│       │   └── store.js           # Redux store configuration with redux-persist
│       ├── features/              # Redux Toolkit slices (one per domain)
│       │   ├── auth/              # authSlice, authThunk, authService
│       │   ├── resume/            # resumeSlice, resumeThunk (CRUD, duplicate, publish)
│       │   ├── resumeProfile/     # Profile section Redux state
│       │   ├── summary/           # Summary section Redux state
│       │   ├── experience/        # Experience section Redux state
│       │   ├── education/         # Education section Redux state
│       │   ├── projects/          # Projects section Redux state
│       │   ├── skills/            # Skills section Redux state
│       │   ├── certification/     # Certification section Redux state
│       │   ├── language/          # Language section Redux state
│       │   ├── socialLinks/       # Social links section Redux state
│       │   └── profile/           # User profile Redux state
│       ├── pages/
│       │   ├── auth/              # Login, Register, VerifyOTP pages
│       │   ├── student/           # Dashboard, Profile, Resume, ResumeEditor,
│       │   │                      # ProjectLab (stub), Roadmap (stub)
│       │   └── admin/             # Admin Dashboard
│       ├── layouts/
│       │   ├── AuthLayout.jsx     # Wrapper for auth pages
│       │   ├── DashboardLayout.jsx
│       │   └── ResumeEditorLayout.jsx
│       ├── routes/
│       │   ├── AppRoutes.jsx      # All route declarations
│       │   └── ProtectedRoute.jsx # JWT guard for protected routes
│       ├── hooks/
│       │   └── useDebounce.js     # Debounce hook for auto-save
│       ├── lib/
│       │   ├── utils.js
│       │   └── validations/       # Zod schemas per resume section
│       │       ├── resumeSchema.js
│       │       ├── personalInfoSchema.js
│       │       ├── summarySchema.js
│       │       ├── experienceSchema.js
│       │       ├── educationSchema.js
│       │       ├── projectsSchema.js
│       │       ├── skillsSchema.js
│       │       ├── certificationSchema.js
│       │       ├── languageSchema.js
│       │       └── socialLinksSchema.js
│       └── utils/
│
└── 🔧 backend/                    # Django + DRF API
    ├── 📄 manage.py
    ├── 📄 requirements.txt
    ├── 📄 Dockerfile
    ├── config/                    # Project-level configuration
    │   ├── settings/
    │   │   ├── base.py            # Shared settings — DB, JWT, Cloudinary, LLM, Redis
    │   │   ├── development.py     # DEBUG=True, CORS_ALLOW_ALL_ORIGINS=True
    │   │   └── production.py      # Production overrides
    │   ├── urls.py                # Root URL config — auth, resumes, resume_ai, docs
    │   ├── exception_handler.py   # Global DRF exception handler
    │   ├── exceptions.py          # Shared exception types
    │   ├── responses.py           # Standardised ApiResponse + ApiResponseMixin
    │   ├── pagination.py          # StandardResultsPagination (10 per page)
    │   ├── logging.py             # LOGGING config — app.log + error.log
    │   └── ratelimit.py           # Custom 429 JSON response handler
    ├── apps/
    │   ├── accounts/              # User auth (email/password + Google OAuth + OTP)
    │   │   ├── models/
    │   │   │   ├── user.py        # Custom User — email-based, no username, role field
    │   │   │   └── otp.py         # OTPVerification model with expiry
    │   │   ├── api/
    │   │   │   ├── views.py       # Register, Login, Me, GoogleLogin, VerifyOTP
    │   │   │   ├── urls.py
    │   │   │   └── serializers.py
    │   │   └── services/
    │   │       ├── google_auth.py # Google token verification
    │   │       ├── otp_service.py # OTP generation and expiry
    │   │       └── email_service.py
    │   ├── profiles/              # User profile (separate from resume profile)
    │   │   └── api/
    │   ├── resumes/               # Resume builder core
    │   │   ├── model/             # All resume data models
    │   │   │   ├── resume.py      # Resume (template, theme_color, font, is_default, is_public)
    │   │   │   ├── resume_profile.py  # ResumeProfile (personal info + photo)
    │   │   │   ├── summary.py     # ResumeSummary
    │   │   │   ├── experience.py  # Experience (employment_type, dates, description)
    │   │   │   ├── education.py   # Education (degree, field, grade)
    │   │   │   ├── skill.py       # Skill (category, level, years_of_experience)
    │   │   │   ├── project.py     # Project (role, technologies, github/live URLs)
    │   │   │   ├── certification.py  # Certification (issuer, credential_id, expiry)
    │   │   │   ├── language.py    # Language (proficiency)
    │   │   │   ├── social_link.py # SocialLink
    │   │   │   ├── achievement.py # Achievement
    │   │   │   ├── reference.py   # Reference
    │   │   │   └── custom_section.py  # CustomSection
    │   │   ├── serializers/       # Per-model DRF serializers
    │   │   ├── views/             # Per-model ViewSets
    │   │   ├── services/          # Business logic layer
    │   │   ├── permissions/       # Per-object ownership permissions
    │   │   ├── tests/             # Test suite
    │   │   └── urls.py            # Router registration for all ViewSets
    │   ├── resume_ai/             # AI analysis bounded context
    │   │   ├── chains/            # LangChain LCEL chains
    │   │   ├── llm/               # LLM provider factory (Groq, extensible)
    │   │   ├── prompts/           # All prompt templates
    │   │   ├── schemas/           # Pydantic v2 output schemas
    │   │   ├── services/          # Parser, Formatter, Prompt, AI, Analysis, Score
    │   │   ├── views.py           # ResumeAnalysisAPIView
    │   │   ├── urls.py
    │   │   ├── constants.py       # Hard limits (16k chars, 20k prompt, 2 retries)
    │   │   └── exceptions.py      # Typed exception hierarchy
    │   └── roadmaps/              # Roadmap app (models defined, views stub)
    ├── logs/
    │   ├── app.log                # General application log
    │   └── error.log              # Error-only log
    └── media/
        └── resume/profile/        # Local profile photo storage (dev)
```

---

## ⚙️ Installation

### Prerequisites

- Python 3.12+
- Node.js 20+
- Docker Desktop (for Docker setup)
- PostgreSQL 17 (if running without Docker)
- Redis 7 (if running without Docker)
- A [Groq API key](https://console.groq.com/) (free tier available)
- A Cloudinary account (for profile image uploads)

---

### 🐳 Docker Setup (Recommended)

The fastest way to run the full stack — backend, frontend, Postgres, and Redis — with a single command.

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/ai-career-copilot.git
cd ai-career-copilot

# 2. Create the backend environment file
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials (see Environment Variables section)

# 3. Build and start all services
docker compose up --build

# 4. In a new terminal, run database migrations
docker compose exec backend python manage.py migrate

# 5. Create a superuser (optional)
docker compose exec backend python manage.py createsuperuser
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/api/docs/ |
| API Docs (ReDoc) | http://localhost:8000/api/redoc/ |
| Django Admin | http://localhost:8000/admin/ |

---

### 🔧 Manual Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate    # macOS/Linux
venv\Scripts\activate       # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create your environment file
cp .env.example .env
# Edit .env with your credentials

# 5. Run database migrations
python manage.py migrate

# 6. Create a superuser
python manage.py createsuperuser

# 7. Start the development server
python manage.py runserver
```

---

### 🎨 Manual Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create the frontend environment file
cp .env.example .env.local
# Add: VITE_GOOGLE_CLIENT_ID=your_google_client_id
#      VITE_API_BASE_URL=http://localhost:8000

# 4. Start the development server
npm run dev
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Example | Description |
|---|---|---|---|
| `SECRET_KEY` | ✅ | `django-insecure-...` | Django secret key — use a long random string in production |
| `DEBUG` | ✅ | `True` | `True` for development, `False` for production |
| `DB_NAME` | ✅ | `career_copilot_db` | PostgreSQL database name |
| `DB_USER` | ✅ | `postgres` | PostgreSQL username |
| `DB_PASSWORD` | ✅ | `yourpassword` | PostgreSQL password |
| `DB_HOST` | ✅ | `postgres` (Docker) / `localhost` (local) | PostgreSQL host |
| `DB_PORT` | ✅ | `5432` | PostgreSQL port |
| `GROQ_API_KEY` | ✅ | `gsk_...` | Groq API key — get from [console.groq.com](https://console.groq.com) |
| `LLM_PROVIDER` | ✅ | `groq` | LLM provider identifier (`groq` currently supported) |
| `LLM_MODEL` | ✅ | `llama-3.3-70b-versatile` | Groq model name |
| `LLM_TEMPERATURE` | ➖ | `0.2` | LLM temperature (`0.0`–`2.0`, default `0.2`) |
| `LLM_MAX_TOKENS` | ➖ | `4096` | Max output tokens (default `4096`) |
| `LLM_TIMEOUT` | ➖ | `60` | LLM request timeout in seconds (default `60`) |
| `CLOUDINARY_CLOUD_NAME` | ✅ | `your_cloud_name` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | `123456789012345` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | `abc123...` | Cloudinary API secret |
| `GOOGLE_CLIENT_ID` | ✅ | `xxx.apps.googleusercontent.com` | Google OAuth client ID |
| `EMAIL_HOST` | ➖ | `smtp.gmail.com` | SMTP host for OTP emails |
| `EMAIL_PORT` | ➖ | `587` | SMTP port |
| `EMAIL_HOST_USER` | ➖ | `you@gmail.com` | SMTP sender email |
| `EMAIL_HOST_PASSWORD` | ➖ | `your_app_password` | SMTP password / app password |
| `EMAIL_USE_TLS` | ➖ | `True` | Enable TLS for SMTP |

> ⚠️ **Never commit your `.env` file to version control.** Add it to `.gitignore`.

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | ✅ | Backend API base URL, e.g. `http://localhost:8000` |
| `VITE_GOOGLE_CLIENT_ID` | ✅ | Google OAuth client ID (same as backend) |

---

## 📡 API Overview

All API endpoints are prefixed with `/api/v1/`.  
Interactive documentation is available at `/api/docs/` (Swagger) and `/api/redoc/` (ReDoc).

### 🔐 Authentication — `/api/v1/auth/`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register/` | Public | Register a new user (email + password). Sends OTP email. Rate limited: 3/min. |
| `POST` | `/auth/login/` | Public | Login with email + password. Returns JWT access + refresh tokens. Rate limited: 5/min. |
| `POST` | `/auth/token/refresh/` | Public | Refresh JWT access token using refresh token. |
| `GET` | `/auth/me/` | JWT | Get the authenticated user's profile. Redis-cached for 5 minutes. |
| `POST` | `/auth/google/` | Public | Login or register via Google OAuth token. Rate limited: 10/min. |
| `POST` | `/auth/verify-otp/` | Public | Verify email address using OTP code. Rate limited: 5/min. |

### 📄 Resume Builder — `/api/v1/`

All resume endpoints require JWT authentication. Every object is scoped to the authenticated user.

| Method | Endpoint | Description |
|---|---|---|
| `GET / POST` | `/resumes/` | List user's resumes / Create new resume |
| `GET / PUT / PATCH / DELETE` | `/resumes/{id}/` | Retrieve, update, or delete a specific resume |
| `POST` | `/resumes/{id}/duplicate/` | Duplicate a resume |
| `POST` | `/resumes/{id}/publish/` | Make a resume public |
| `POST` | `/resumes/{id}/unpublish/` | Make a resume private |
| `POST` | `/resumes/{id}/set_default/` | Set as default resume |
| `GET / PUT / PATCH` | `/resumes/{id}/profile/` | Get or update the resume profile (personal info, photo) |
| `GET / PUT / PATCH` | `/resumes/{id}/summary/` | Get or update the professional summary |
| `GET / POST` | `/experiences/` | List / create experience entries |
| `GET / PUT / PATCH / DELETE` | `/experiences/{id}/` | Manage a single experience entry |
| `GET / POST` | `/educations/` | List / create education entries |
| `GET / PUT / PATCH / DELETE` | `/educations/{id}/` | Manage a single education entry |
| `GET / POST` | `/skills/` | List / create skills |
| `GET / PUT / PATCH / DELETE` | `/skills/{id}/` | Manage a single skill |
| `GET / POST` | `/projects/` | List / create projects |
| `GET / PUT / PATCH / DELETE` | `/projects/{id}/` | Manage a single project |
| `GET / POST` | `/certifications/` | List / create certifications |
| `GET / PUT / PATCH / DELETE` | `/certifications/{id}/` | Manage a single certification |
| `GET / POST` | `/languages/` | List / create languages |
| `GET / PUT / PATCH / DELETE` | `/languages/{id}/` | Manage a single language |
| `GET / POST` | `/social-links/` | List / create social links |
| `GET / PUT / PATCH / DELETE` | `/social-links/{id}/` | Manage a single social link |
| `GET / POST` | `/achievements/` | List / create achievements |
| `GET / PUT / PATCH / DELETE` | `/achievements/{id}/` | Manage a single achievement |
| `GET / POST` | `/references/` | List / create references |
| `GET / PUT / PATCH / DELETE` | `/references/{id}/` | Manage a single reference |
| `GET / POST` | `/custom-sections/` | List / create custom sections |
| `GET / PUT / PATCH / DELETE` | `/custom-sections/{id}/` | Manage a single custom section |

### 🤖 Resume AI — `/api/v1/`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/resume-ai/analyze/` | JWT | Submit a `resume_id` to trigger the full AI analysis pipeline. Returns structured scores, section analysis, strengths, weaknesses, recommendations, and missing keywords. |

**Request Body:**
```json
{
  "resume_id": 42
}
```

**Response (200):**
```json
{
  "scores": {
    "overall_score": 74,
    "ats_score": 78,
    "grammar_score": 82,
    "readability_score": 71,
    "impact_score": 65
  },
  "strengths": ["..."],
  "weaknesses": ["..."],
  "recommendations": ["..."],
  "missing_keywords": ["..."],
  "missing_sections": ["..."],
  "profile": { "score": 80, "feedback": "...", "strengths": [], "weaknesses": [], "missing_keywords": [], "suggestions": [] },
  "summary": { "score": 70, ... },
  "experience": { "score": 75, ... },
  "education": { "score": 85, ... },
  "projects": { "score": 72, ... },
  "skills": { "score": 68, ... },
  "certifications": { "score": 60, ... },
  "languages": { "score": 55, ... },
  "final_feedback": "Overall executive summary from the AI..."
}
```

---

## 🧠 Resume AI — Deep Dive

### ParserService

**Purpose:** Convert a Django ORM `Resume` instance into a provider-safe Python dictionary.

- Loads the resume using `select_related("profile", "summary", "user")` and `prefetch_related("experiences", "educations", "projects", "skills", "certifications", "languages")` — a **single optimised database query**.
- Strips all whitespace from text fields.
- Returns only analysis-relevant fields — no raw PII passthrough.
- Raises `ValidationException` for invalid input, `ParserException` if the resume doesn't exist.

---

### FormatterService

**Purpose:** Convert the parsed dictionary into a **structured Markdown document** suitable for the LLM context window.

- Deterministic — never calls the LLM.
- Formats all sections: Personal Info, Professional Summary, Experience, Education, Projects, Skills, Languages, Certifications.
- Enforces a **16,000-character hard limit** (`ANALYSIS_MAX_RESUME_CHARS`). If exceeded, content is truncated with a visible `[Content Truncated For Token Safety]` marker.
- All string values are safely normalised before inclusion.

---

### PromptService

**Purpose:** Fill prompt templates with sanitised inputs and enforce size constraints.

- Builds analysis, summary improvement, experience improvement, project improvement, and skills improvement prompts.
- Estimates token count using a character-based approximation (4 chars/token).
- Raises `PromptBuildException` if the prompt exceeds the `MAX_PROMPT_CHARS` limit (`20,000` chars).
- Validates that all inputs are non-empty before template rendering.

---

### AnalysisService

**Purpose:** Orchestrate the full pipeline — parse → format → AI → normalise.

- Injects `AIService` (swappable for testing).
- Validates that formatted markdown has actual content before invoking the LLM.
- Raises specific, typed exceptions at each stage — never swallows errors silently.
- Logs total pipeline latency and overall score on success.

---

### ScoreService

**Purpose:** Post-process AI scores deterministically.

| Method | Description |
|---|---|
| `clamp(score)` | Clamps any value to `[0, 100]` |
| `normalize_scores(analysis)` | Applies clamp to all 5 score dimensions |
| `calculate_overall_score(analysis)` | Recalculates overall as `mean(ats, grammar, readability, impact)` |
| `grade(score)` | Returns letter grade: `A+` (≥90), `A` (≥80), `B` (≥70), `C` (≥60), `D` (≥50), `F` |
| `level(score)` | Returns label: `Excellent`, `Very Good`, `Good`, `Average`, `Needs Improvement`, `Poor` |
| `color(score)` | Returns UI token: `emerald`, `green`, `yellow`, `orange`, `red` |
| `build_score_summary(analysis)` | Returns `{score, grade, level, color}` dict for API responses |

---

### ResumeAnalysisChain

**Purpose:** Compose the LangChain LCEL chain and invoke structured AI output.

```python
self.chain = ChatPromptTemplate.from_messages([
    ("system", ATS_SYSTEM_PROMPT),
    ("human", RESUME_ANALYSIS_PROMPT),
]) | LLMProvider.get_llm().with_structured_output(ResumeAnalysis, include_raw=True)
```

- `include_raw=True` enables extraction of `usage_metadata` for input/output token logging.
- Validates Pydantic schema on every response — raises `ChainExecutionException` on schema mismatch or parse error.
- Logs provider, model, prompt chars, latency (ms), and token usage on every successful invocation.

---

### LLMProvider

**Purpose:** Build a reusable, cached LangChain model instance.

- Uses `@lru_cache(maxsize=1)` — one client instance per process.
- Validates API key, model name, temperature, max tokens, and timeout before constructing the client.
- Currently supports `groq` as the provider. Extend with an `openai` or `anthropic` branch without touching any other code.
- Default model: `llama-3.3-70b-versatile`, temperature `0.2`, max tokens `4096`, timeout `60s`.

---

### Pydantic Output Schemas

The AI response is validated against three nested Pydantic v2 models:

```python
# Per-section result
class Suggestion(BaseModel):
    title: str           # max 160 chars
    description: str     # max 1000 chars
    priority: Literal["low", "medium", "high"]

class SectionAnalysis(BaseModel):
    score: int           # 0–100
    feedback: str        # max 2000 chars
    strengths: list[str]
    weaknesses: list[str]
    missing_keywords: list[str]
    suggestions: list[Suggestion]
    improved_content: str | None

# Overall resume scores
class ResumeScores(BaseModel):
    overall_score: int   # 0–100
    ats_score: int
    grammar_score: int
    readability_score: int
    impact_score: int

# Top-level analysis result
class ResumeAnalysis(BaseModel):
    scores: ResumeScores
    strengths: list[str]
    weaknesses: list[str]
    recommendations: list[str]
    missing_keywords: list[str]
    missing_sections: list[str]
    profile: SectionAnalysis
    summary: SectionAnalysis
    experience: SectionAnalysis
    education: SectionAnalysis
    projects: SectionAnalysis
    skills: SectionAnalysis
    certifications: SectionAnalysis
    languages: SectionAnalysis
    final_feedback: str  # max 3000 chars
```

All models use `ConfigDict(extra="forbid")` — any extra keys from the LLM are rejected and trigger a `ChainExecutionException`.

---

## 📸 Screenshots

> Screenshots will be added here once the application UI is complete.

| Screen | Description |
|---|---|
| `[Login Page]` | Email/password login with Google OAuth button |
| `[Register Page]` | Registration form with OTP verification flow |
| `[Dashboard]` | Resume card grid with create/delete/duplicate actions |
| `[Resume Editor]` | Split-pane editor with section navigation and live preview |
| `[AI Analysis]` | Score breakdown with section-level feedback cards |

---

## 🗺️ Future Roadmap

### ✅ Completed

- [x] JWT Authentication (email + Google OAuth + OTP)
- [x] Full Resume Builder (all sections)
- [x] Profile image upload (Cloudinary)
- [x] AI Resume Analysis (LangChain + Groq + Pydantic)
- [x] Multi-dimensional scoring engine
- [x] Section-level AI feedback
- [x] Docker Compose setup
- [x] OpenAPI documentation (Swagger + ReDoc)
- [x] Redis caching
- [x] Rate limiting

### 🔄 In Progress

- [ ] Resume Live Preview (section-by-section in editor)
- [ ] Resume PDF Export
- [ ] Roadmap page (backend model seeded, frontend page is a stub)

### 📋 Planned

- [ ] **Job Match Engine** — paste a job description, get match score and keyword gaps
- [ ] **Interview Copilot** — AI-generated practice interview questions per role
- [ ] **AI Career Roadmap** — personalised skill and learning roadmap generator
- [ ] **AI Project Lab** — AI-suggested project ideas based on skill gaps
- [ ] **Skill Gap Analysis** — compare your skills against target job requirements
- [ ] **LangGraph Agentic Workflows** — multi-step agentic pipelines for career planning
- [ ] **Multi-Provider LLM Support** — OpenAI and Anthropic alongside Groq
- [ ] **Resume Version History** — track changes across resume edits

---

## 🤝 Contributing

Contributions are welcome! Please read through this guide before opening a pull request.

### Getting Started

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/your-username/ai-career-copilot.git
cd ai-career-copilot

# 3. Create a feature branch
git checkout -b feature/your-feature-name
```

### Development Guidelines

**Backend**
- Follow the existing layered architecture: `models → serializers → services → views`
- Add tests for any new service or API endpoint in the corresponding `tests/` directory
- Keep views thin — business logic belongs in `services/`
- Use the `ApiResponse` mixin for all API responses
- Document all public methods with docstrings

**Frontend**
- Each new data domain gets its own Redux slice in `src/features/`
- Use React Hook Form + Zod for all form validation
- Keep components focused and reusable

**AI Module**
- All LLM interaction goes through `ResumeAnalysisChain`
- New prompts belong in `apps/resume_ai/prompts/`
- New output schemas belong in `apps/resume_ai/schemas/`
- Never call the LLM directly from a view or service — always go through `AIService`

### Pull Request Checklist

- [ ] Code follows existing project conventions
- [ ] New features include tests
- [ ] Environment variables are documented in this README
- [ ] No secrets, keys, or credentials committed
- [ ] PR description explains the change clearly

---

## 📜 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Himanshu Kumar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 👨‍💻 Author

<div align="center">

**Himanshu Kumar**

*Full Stack Developer & AI Engineer*

[![GitHub](https://img.shields.io/badge/GitHub-@yourusername-181717?style=for-the-badge&logo=github)](https://github.com/yourusername)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/yourprofile)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-FF6B6B?style=for-the-badge&logo=vercel)](https://yourportfolio.dev)
[![Email](https://img.shields.io/badge/Email-Contact-EA4335?style=for-the-badge&logo=gmail)](mailto:your@email.com)

</div>

---

## 🙏 Acknowledgements

This project is built on top of exceptional open-source work. Thank you to:

| Library | What it powers |
|---|---|
| [LangChain](https://github.com/langchain-ai/langchain) | LLM orchestration, LCEL pipeline, and structured output |
| [Groq](https://groq.com/) | Lightning-fast LLM inference with LLaMA 3.3 70B |
| [Pydantic](https://docs.pydantic.dev/) | Type-safe, schema-enforced AI output validation |
| [Django](https://www.djangoproject.com/) | Robust, production-grade web framework |
| [Django REST Framework](https://www.django-rest-framework.org/) | Clean, powerful API construction |
| [React](https://react.dev/) | Component-based UI rendering |
| [Redux Toolkit](https://redux-toolkit.js.org/) | Predictable, scalable frontend state management |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling system |
| [Framer Motion](https://www.framer.com/motion/) | Fluid animations and transitions |
| [drf-spectacular](https://github.com/tfranzel/drf-spectacular) | Auto-generated OpenAPI schema and Swagger UI |
| [LangSmith](https://smith.langchain.com/) | LLM observability and tracing |

---

<div align="center">

**⭐ If AI Career Copilot helped you, give it a star on GitHub!**

Made with ❤️ by Himanshu Kumar

</div>
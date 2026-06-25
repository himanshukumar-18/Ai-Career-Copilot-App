# 🚀 AI Career Copilot

> **AI Career Copilot** is a full-stack AI-powered career development platform designed to help students and professionals build their careers with intelligent guidance. The platform provides profile management, resume building, skill tracking, AI-powered recommendations, career roadmaps, interview preparation, and much more.

---

# 📖 Overview

AI Career Copilot aims to become an all-in-one career companion that helps users throughout their professional journey—from creating a complete profile to generating resumes, tracking skills, receiving AI career suggestions, and preparing for interviews.

This project is being built using a modern, scalable architecture with React, Django REST Framework, PostgreSQL, Docker, Redis, and Cloudinary.

---

# ✨ Current Features

## ✅ Authentication Module

* User Registration
* Secure Login
* JWT Authentication
* Access Token Authentication
* Refresh Token Support
* Auto Login
* Protected Routes
* Logout
* Email Verification Structure
* Google Authentication (Backend Structure Ready)

---

## ✅ Profile Module

### Profile Management

* Create Profile
* View Profile
* Update Profile
* Individual Field Updates
* Real-time Profile Updates
* Dynamic Profile Completion Percentage

### Professional Information

* Headline
* Bio
* Phone Number
* Location
* Career Goal

### Social Links

* GitHub

* LinkedIn

* Portfolio Website

* Automatic URL Validation

* Clickable Links

* Opens Links in New Tab

### Profile Picture

* Cloudinary Integration
* Image Upload
* Instant Preview
* Automatic Fetch After Login

---

## ✅ Dashboard

Modern responsive dashboard with:

* Premium Sidebar
* Dynamic User Information
* Dynamic Avatar
* Dynamic Profile Completion
* Navigation
* Settings Shortcut
* Logout
* Mobile Responsive Layout

---

## ✅ UI Components

Reusable Components

* Button
* Input
* Panel
* Skeleton Loader
* Responsive Layout
* Border-Based Design System

---

---
# Resume-builder
Database Structure --
        User
        │
        └── Resume
            │
            ├── ResumeProfile 
            ├── Education 
            ├── Experience
            ├── Skill 
            ├── Project 
            ├── Certification 
            ├── Language 
            ├── Achievement 
            └── Reference 
            |__ Social
            |__ custom
* user create a modern cv for job
---

# 🛠 Tech Stack

## Frontend

* React 19
* Redux Toolkit
* React Router DOM
* React Hook Form
* Axios
* Tailwind CSS
* Lucide React
* Framer Motion

---

## Backend

* Python
* Django
* Django REST Framework
* Simple JWT
* PostgreSQL
* Redis
* Cloudinary

---

## DevOps

* Docker
* Docker Compose
* Git
* GitHub

---

# 🔐 Authentication

Implemented

* JWT Login
* JWT Access Token
* Refresh Token
* Protected Routes
* Auto Authentication
* Logout
* Secure Password Hashing

Upcoming

* Google OAuth
* OTP Verification
* Forgot Password
* Reset Password

---

# 🐳 Docker Support

Project is fully Dockerized.

Containers

* Django Backend
* PostgreSQL Database
* Redis
* Frontend (Development)

Features

* Environment Variables
* Volume Mapping
* Persistent Database
* Container Networking

---

# 🗄 Database

Database: PostgreSQL

Models Implemented

* Custom User
* User Profile

---

# ☁ Cloudinary Integration

Implemented

* Profile Image Upload
* Image Storage
* Automatic URL Management

---

# 📂 Project Structure

```
AI-Career-Copilot
│
├── backend
│   ├── apps
│   │   ├── accounts
│   │   ├── profiles
│   │   ├── resumes
│   │   ├── skills
│   │   ├── ai_engine
│   │   └── roadmaps
│   │
│   ├── config
│   ├── media
│   └── manage.py
│
├── frontend
│   ├── src
│   │   ├── app
│   │   ├── components
│   │   ├── features
│   │   ├── layouts
│   │   ├── pages
│   │   ├── routes
│   │   ├── services
│   │   └── utils
│
└── docker-compose.yml
```

---

---
# system design
[docs/system_design]
---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/ai-career-copilot.git

cd ai-career-copilot
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Backend

```bash
cd backend

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

---

## Docker

```bash
docker compose up --build
```

---

# 🔌 API Endpoints

## Authentication

```
POST /api/v1/auth/register/

POST /api/v1/auth/login/

POST /api/v1/auth/token/refresh/

GET /api/v1/auth/me/

POST /api/v1/auth/google/

POST /api/v1/auth/verify-otp/
```

---

## Profile

```
GET /api/v1/profile/me/

PATCH /api/v1/profile/me/
```

---

---
## Resume-builder


---

# 📸 Screenshots
[docs/README_IMAGES]

---

# 📈 Development Progress

| Module                   | Status         |
| ------------------------ | -------------- |
| Authentication           | ✅ Completed    |
| Docker Setup             | ✅ Completed    |
| PostgreSQL Integration   | ✅ Completed    |
| Redis Integration        | ✅ Completed    |
| Profile Module           | ✅ Completed    |
| Cloudinary Upload        | ✅ Completed    |
| Dashboard UI             | ✅ Completed    |
| Responsive Design        | ✅ Completed    |
| Resume Builder           | 🚧 In Progress |
| Skills Module            | ⏳ Planned      |
| AI Recommendation Engine | ⏳ Planned      |
| Career Roadmap           | ⏳ Planned      |
| Interview Preparation    | ⏳ Planned      |

---

# 🎯 Upcoming Features

* Resume Builder
* Multiple Resume Templates
* Resume PDF Export
* ATS Resume Checker
* Skill Assessment
* AI Career Recommendations
* AI Resume Analyzer
* AI Career Roadmap
* Learning Path Generator
* Interview Preparation
* Mock Interviews
* Analytics Dashboard
* Admin Dashboard

---

# 📌 Challenges Solved During Development

* Docker container networking
* PostgreSQL authentication issues
* Database migration conflicts
* JWT access & refresh token handling
* Automatic token refresh
* Cloudinary image upload integration
* Profile synchronization after login
* Dynamic profile completion calculation
* Responsive dashboard sidebar
* Redux state management optimization
* Protected route implementation
* Environment variable configuration
* Redis integration for rate limiting
* Professional reusable component architecture

---

# 🚀 Future Vision

AI Career Copilot aims to become a complete AI-powered platform where users can:

* Build professional resumes
* Analyze resumes using AI
* Track skills
* Receive personalized career guidance
* Generate learning roadmaps
* Prepare for interviews
* Discover job opportunities
* Monitor career growth with analytics

---

# 👨‍💻 Author

**Himanshu Kumar**

Full Stack Developer

**Tech Stack**

* MERN Stack
* Python
* Django
* PostgreSQL
* Docker
* AI & LLM Integration

---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.

Contributions, suggestions, and feedback are always welcome!
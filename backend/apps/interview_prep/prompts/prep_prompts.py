"""LangChain ChatPromptTemplates for AI Interview Preparation."""

from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate

from apps.interview_prep.schemas import (
    AIAnswerEvaluationSchema,
    AIInterviewPrepPlanSchema,
    AIInterviewReadinessSchema,
    AIMockInterviewTurnSchema,
    AIQuestionGenerationSchema,
)


def build_prep_plan_prompt() -> ChatPromptTemplate:
    """Build prompt template for personalized interview preparation plan generation."""
    parser = JsonOutputParser(pydantic_object=AIInterviewPrepPlanSchema)
    formatting_instructions = parser.get_format_instructions()

    system_message = (
        "You are an expert AI Career Mentor and Senior Technical Recruiter.\n"
        "Your task is to analyze the candidate's profile, resume claims, portfolio projects, skill background, "
        "target role, experience level, and optional job description to synthesize a personalized, highly practical "
        "interview preparation plan.\n\n"
        "CRITICAL INSTRUCTIONS:\n"
        "1. Personalize topics based on candidate's actual background and gap analysis relative to the target role.\n"
        "2. Identify Strong, Weak, Missing, and Priority study topics.\n"
        "3. Include high-quality, verified learning resource recommendations (documentation, tutorials, courses).\n"
        "4. Adapt to candidate's field (Software Engineering, Data Science, AI/ML, DevOps, Cybersecurity, Mobile, Product Management, Finance, etc.).\n"
        "5. Output MUST strictly follow the JSON schema format instructions below.\n\n"
        "{format_instructions}"
    )

    human_message = (
        "Candidate Target Role: {target_role}\n"
        "Target Experience Level: {experience_level}\n"
        "Target Company: {company_name}\n\n"
        "Job Description / Requirements:\n"
        "\"\"\"\n{job_description}\n\"\"\"\n\n"
        "Candidate Comprehensive Profile & Background:\n"
        "\"\"\"\n{student_context}\n\"\"\"\n\n"
        "Generate a structured interview preparation plan now."
    )

    return ChatPromptTemplate.from_messages(
        [
            ("system", system_message),
            ("human", human_message),
        ]
    ).partial(format_instructions=formatting_instructions)


def build_question_generation_prompt() -> ChatPromptTemplate:
    """Build prompt template for generating dynamic role, resume, project, and JD-specific questions."""
    parser = JsonOutputParser(pydantic_object=AIQuestionGenerationSchema)
    formatting_instructions = parser.get_format_instructions()

    system_message = (
        "You are a Lead Interviewer and Subject Matter Specialist.\n"
        "Generate a targeted set of interview questions for the candidate.\n"
        "Include a mix of:\n"
        "- Conceptual & Technical Questions\n"
        "- Resume-based Questions (probing actual claims, achievements, and tech stack mentioned)\n"
        "- Project-based Questions (architecture, trade-offs, scaling, choices made in their portfolio projects)\n"
        "- Job Description Specific Questions (addressing key requirements)\n"
        "- Behavioral & Scenario Questions\n\n"
        "INSTRUCTIONS:\n"
        "1. Never invent fake candidate experiences.\n"
        "2. Tailor question difficulty to the candidate's target role and experience level.\n"
        "3. Provide ideal answer outlines and key points for each question.\n"
        "4. Output MUST strictly follow the JSON schema format instructions below.\n\n"
        "{format_instructions}"
    )

    human_message = (
        "Target Role: {target_role}\n"
        "Topic / Focus Area: {topic_title}\n"
        "Question Count Required: {question_count}\n\n"
        "Job Description:\n\"\"\"\n{job_description}\n\"\"\"\n\n"
        "Candidate Resume & Project Context:\n\"\"\"\n{student_context}\n\"\"\"\n\n"
        "Generate the interview questions set now."
    )

    return ChatPromptTemplate.from_messages(
        [
            ("system", system_message),
            ("human", human_message),
        ]
    ).partial(format_instructions=formatting_instructions)


def build_answer_evaluation_prompt() -> ChatPromptTemplate:
    """Build prompt template for evaluating candidate answer submissions."""
    parser = JsonOutputParser(pydantic_object=AIAnswerEvaluationSchema)
    formatting_instructions = parser.get_format_instructions()

    system_message = (
        "You are an expert AI Interview Examiner evaluating a candidate's answer.\n"
        "Evaluate the answer constructively based on question category (Technical correctness, System Design trade-offs, Coding efficiency, Behavioral STAR structure, Communication clarity).\n\n"
        "INSTRUCTIONS:\n"
        "1. Assign a fair score from 0 to 100.\n"
        "2. Identify clear strengths, weaknesses, and missing key points.\n"
        "3. Provide a model ideal answer guiding the student.\n"
        "4. Provide actionable improvement tips.\n"
        "5. Output MUST strictly follow the JSON schema format instructions below.\n\n"
        "{format_instructions}"
    )

    human_message = (
        "Target Role: {target_role}\n"
        "Interview Category: {category}\n"
        "Question: {question_text}\n"
        "Ideal Answer Outline: {ideal_answer_outline}\n"
        "Key Points Required: {key_points}\n\n"
        "Candidate Submitted Answer:\n\"\"\"\n{user_answer}\n\"\"\"\n\n"
        "Evaluate the candidate's answer now."
    )

    return ChatPromptTemplate.from_messages(
        [
            ("system", system_message),
            ("human", human_message),
        ]
    ).partial(format_instructions=formatting_instructions)


def build_mock_interview_prompt() -> ChatPromptTemplate:
    """Build prompt template for adaptive mock interview turns."""
    parser = JsonOutputParser(pydantic_object=AIMockInterviewTurnSchema)
    formatting_instructions = parser.get_format_instructions()

    system_message = (
        "You are an interactive AI Mock Interviewer conducting a real-time interview.\n"
        "Evaluate the candidate's previous response and generate an adaptive follow-up question.\n"
        "ADAPTABILITY RULES:\n"
        "- If the candidate answered strongly (Score >= 80), increase difficulty or ask a deeper architectural/edge-case question.\n"
        "- If the candidate answered poorly (Score < 50), ask a foundational follow-up or provide a gentle hint.\n"
        "- Output MUST strictly follow the JSON schema format instructions below.\n\n"
        "{format_instructions}"
    )

    human_message = (
        "Target Role: {target_role}\n"
        "Interview Category: {category}\n"
        "Turn Index: {turn_index} of {total_turns}\n"
        "Current Question: {question_text}\n\n"
        "Candidate Answer:\n\"\"\"\n{user_answer}\n\"\"\"\n\n"
        "Evaluate this turn and generate the adaptive follow-up question now."
    )

    return ChatPromptTemplate.from_messages(
        [
            ("system", system_message),
            ("human", human_message),
        ]
    ).partial(format_instructions=formatting_instructions)


def build_readiness_assessment_prompt() -> ChatPromptTemplate:
    """Build prompt template for holistic interview readiness assessment."""
    parser = JsonOutputParser(pydantic_object=AIInterviewReadinessSchema)
    formatting_instructions = parser.get_format_instructions()

    system_message = (
        "You are a Chief Talent Officer assessing candidate interview readiness.\n"
        "Analyze the candidate's performance across practice questions, mock turns, and topic coverage to compute technical score, behavioral score, project confidence score, overall readiness score (0-100), weak areas, and executive recommendations.\n\n"
        "Output MUST strictly follow the JSON schema format instructions below.\n\n"
        "{format_instructions}"
    )

    human_message = (
        "Target Role: {target_role}\n"
        "Preparation Summary & Attempts Log:\n\"\"\"\n{prep_summary}\n\"\"\"\n\n"
        "Assess interview readiness now."
    )

    return ChatPromptTemplate.from_messages(
        [
            ("system", system_message),
            ("human", human_message),
        ]
    ).partial(format_instructions=formatting_instructions)


def get_plan_parser():
    return JsonOutputParser(pydantic_object=AIInterviewPrepPlanSchema)


def get_question_parser():
    return JsonOutputParser(pydantic_object=AIQuestionGenerationSchema)


def get_evaluation_parser():
    return JsonOutputParser(pydantic_object=AIAnswerEvaluationSchema)


def get_mock_parser():
    return JsonOutputParser(pydantic_object=AIMockInterviewTurnSchema)


def get_readiness_parser():
    return JsonOutputParser(pydantic_object=AIInterviewReadinessSchema)

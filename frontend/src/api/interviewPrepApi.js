import api from "./axios";

const BASE_URL = "/interview-prep";

export const interviewPrepApi = {
    /**
     * Trigger AI personalized interview plan generation.
     * @param {Object} data - { target_role: string, experience_level?: string, company_name?: string, job_description?: string, force_regenerate?: boolean }
     */
    generatePrepPlan: (data) =>
        api.post(`${BASE_URL}/generate/`, data),

    /**
     * Fetch student's saved interview preparation plans.
     */
    fetchPrepPlans: () =>
        api.get(`${BASE_URL}/plans/`),

    /**
     * Get detail of a specific interview prep plan with topics & resources.
     * @param {string} planId - UUID of the plan
     */
    fetchPrepPlanById: (planId) =>
        api.get(`${BASE_URL}/plans/${planId}/`),

    /**
     * Generate dynamic AI practice questions for a plan/topic.
     * @param {string} planId - UUID of the plan
     * @param {Object} data - { topic_id?: string, question_count?: number }
     */
    generateQuestions: (planId, data = {}) =>
        api.post(`${BASE_URL}/plans/${planId}/questions/generate/`, data),

    /**
     * Submit candidate answer for AI multi-dimensional evaluation.
     * @param {string} questionId - UUID of the question
     * @param {Object} data - { user_answer: string }
     */
    submitAnswer: (questionId, data) =>
        api.post(`${BASE_URL}/questions/${questionId}/submit/`, data),

    /**
     * Start an interactive mock interview session.
     * @param {string} planId - UUID of the plan
     * @param {Object} data - { category?: string, total_questions?: number }
     */
    startMockSession: (planId, data = {}) =>
        api.post(`${BASE_URL}/plans/${planId}/mock/start/`, data),

    /**
     * Submit candidate answer for current turn and retrieve adaptive follow-up.
     * @param {string} sessionId - UUID of the mock session
     * @param {Object} data - { user_answer: string }
     */
    submitMockTurn: (sessionId, data) =>
        api.post(`${BASE_URL}/mock/${sessionId}/turn/`, data),

    /**
     * Fetch interview readiness analytics for a plan.
     * @param {string} planId - UUID of the plan
     */
    fetchReadiness: (planId) =>
        api.get(`${BASE_URL}/plans/${planId}/readiness/`),

    /**
     * Fetch daily recommended focus study topic and resources.
     */
    fetchStudyToday: () =>
        api.get(`${BASE_URL}/study-today/`),
};

export default interviewPrepApi;

import api from "./axios";

const BASE_URL = "/roadmaps";

export const careerRoadmapApi = {
    /**
     * Fetch list of active career roles available in the platform.
     */
    fetchRoles: () =>
        api.get(`${BASE_URL}/roles/`),

    /**
     * Trigger AI personalized roadmap generation and skill gap analysis.
     * @param {Object} data - { career_role_slug: string, force_regenerate?: boolean }
     */
    generateAIRoadmap: (data) =>
        api.post(`${BASE_URL}/generate/`, data),

    /**
     * Get full structured roadmap tree for a role.
     * @param {string} slug - Career role slug
     */
    getFullRoadmap: (slug) =>
        api.get(`${BASE_URL}/roles/${slug}/full/`),

    /**
     * Enroll authenticated user in a career roadmap.
     * @param {string} slug - Career role slug
     */
    enrollRoadmap: (slug) =>
        api.post(`${BASE_URL}/roles/${slug}/enroll/`),

    /**
     * Get detailed student roadmap progress and skill gap analysis.
     * @param {string} slug - Career role slug
     */
    getUserProgress: (slug) =>
        api.get(`${BASE_URL}/roles/${slug}/my-progress/`),

    /**
     * Complete a roadmap step and recalculate progress & next step.
     * @param {string} stepId - Roadmap step UUID
     * @param {Object} data - { notes?: string }
     */
    completeStep: (stepId, data = {}) =>
        api.post(`${BASE_URL}/steps/${stepId}/complete/`, data),

    /**
     * Query next recommended step for student.
     * @param {string} slug - Career role slug
     */
    getNextStep: (slug) =>
        api.get(`${BASE_URL}/roles/${slug}/next-step/`),

    /**
     * List all enrolled career roadmaps for authenticated student.
     */
    getMyEnrolledRoadmaps: () =>
        api.get(`${BASE_URL}/my-progress/`),
};

export default careerRoadmapApi;

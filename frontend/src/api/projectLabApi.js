import api from "./axios";

const BASE_URL = "/project-lab";

export const projectLabApi = {
    /**
     * Request AI-generated project suggestions.
     * @param {Object} data - { tech_stack: string[], difficulty: string, count: number }
     */
    generateProjects: (data) =>
        api.post(`${BASE_URL}/generate/`, data),

    /**
     * Fetch user's saved/working projects list with pagination, search, & filters.
     * @param {Object} params - { status, difficulty, search, ordering, page }
     */
    getMyProjects: (params = {}) =>
        api.get(`${BASE_URL}/my-projects/`, { params }),

    /**
     * Snapshot an AI-generated project idea into user's saved list.
     * @param {Object} data - { generated_project_id: string }
     */
    saveGeneratedProject: (data) =>
        api.post(`${BASE_URL}/my-projects/`, data),

    /**
     * Retrieve single user project detail.
     * @param {string} id - UserProject UUID
     */
    getProjectById: (id) =>
        api.get(`${BASE_URL}/my-projects/${id}/`),

    /**
     * Update a user project's status, repo link, or notes.
     * @param {string} id - UserProject UUID
     * @param {Object} data - { status: string, repo_link?: string, notes?: string }
     */
    updateProjectStatus: (id, data) =>
        api.patch(`${BASE_URL}/my-projects/${id}/status/`, data),

    /**
     * Delete a user project entry.
     * @param {string} id - UserProject UUID
     */
    deleteProject: (id) =>
        api.delete(`${BASE_URL}/my-projects/${id}/`),
};

export default projectLabApi;

import api from "@/api/axios";

const unwrap = (response) => response.data?.data ?? response.data;

const normalizeApiError = (error) => {
    if (error.response?.data) return error.response.data;
    return { message: error.message || "Network error. Please try again." };
};

export const getProjects = async () => {
    try {
        const response = await api.get("/projects/");
        return unwrap(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

export const createProject = async (projectData) => {
    try {
        const response = await api.post("/projects/", projectData);
        return unwrap(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

export const updateProject = async (id, projectData) => {
    try {
        const response = await api.patch(`/projects/${id}/`, projectData);
        return unwrap(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

export const deleteProject = async (id) => {
    try {
        await api.delete(`/projects/${id}/`);
        return id;
    } catch (error) {
        throw normalizeApiError(error);
    }
};

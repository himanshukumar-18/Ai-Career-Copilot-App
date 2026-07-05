import api from "@/api/axios";

const unwrap = (response) => response.data?.data ?? response.data?.results ?? response.data;

const normalizeApiError = (error) => {
    if (error.response?.data) return error.response.data;
    return { message: error.message || "Network error. Please try again." };
};

export const getSkills = async () => {
    try {
        const response = await api.get("/skills/");
        return unwrap(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

export const createSkill = async (skillData) => {
    try {
        const response = await api.post("/skills/", skillData);
        return unwrap(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

export const updateSkill = async (id, skillData) => {
    try {
        const response = await api.patch(`/skills/${id}/`, skillData);
        return unwrap(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

export const deleteSkill = async (id) => {
    try {
        await api.delete(`/skills/${id}/`);
        return id;
    } catch (error) {
        throw normalizeApiError(error);
    }
};

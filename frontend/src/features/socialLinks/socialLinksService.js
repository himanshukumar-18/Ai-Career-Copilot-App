import api from "@/api/axios";

const unwrap = (response) => {
    const body = response.data?.data ?? response.data;
    return Array.isArray(body?.results) ? body.results : body;
};

const normalizeApiError = (error) => {
    if (error.response?.data) return error.response.data;
    return { message: error.message || "Network error. Please try again." };
};

export const getSocialLinks = async (resumeId) => {
    try {
        const response = await api.get("/social-links/", { params: { resume: resumeId } });
        return unwrap(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

export const createSocialLink = async (resumeId, linkData) => {
    try {
        const response = await api.post("/social-links/", { ...linkData, resume: resumeId });
        return unwrap(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

export const updateSocialLink = async (id, linkData) => {
    try {
        const response = await api.patch(`/social-links/${id}/`, linkData);
        return unwrap(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

export const deleteSocialLink = async (id) => {
    try {
        await api.delete(`/social-links/${id}/`);
        return id;
    } catch (error) {
        throw normalizeApiError(error);
    }
};

import api from "@/api/axios";

const unwrap = (response) => response.data?.data ?? response.data;

const normalizeApiError = (error) => {
    if (error.response?.data) return error.response.data;
    return { message: error.message || "Network error. Please try again." };
};

export const getSocialLinks = async () => {
    try {
        const response = await api.get("/social-links/");
        return unwrap(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

export const updateSocialLinks = async (id, linksData) => {
    try {
        const response = await api.patch(`/social-links/${id}/`, linksData);
        return unwrap(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

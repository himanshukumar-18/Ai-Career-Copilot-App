import api from "../../api/axios";

const unwrapApiResponse = (response) => response.data?.data ?? response.data;


const normalizeApiError = (error) => {
    if (error.response?.data) {
        return error.response.data;
    }
    return { message: error.message || "Network error. Please try again." };
};

export const getCertifications = async (resumeId) => {
    try {
        const response = await api.get(`/resumes/${resumeId}/certifications/`);
        return unwrapApiResponse(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

export const updateCertifications = async (resumeId, certifications) => {
    try {
        const response = await api.put(`/resumes/${resumeId}/certifications/`, {
            certifications,
        });
        return unwrapApiResponse(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};
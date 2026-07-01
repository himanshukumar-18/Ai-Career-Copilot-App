import api from "@/api/axios";

const unwrap = (response) => response.data?.data ?? response.data;

const normalizeApiError = (error) => {
    if (error.response?.data) return error.response.data;
    return { message: error.message || "Network error. Please try again." };
};

export const getSummary = async () => {
    try {
        const response = await api.get("/summary/");
        return unwrap(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

export const updateSummary = async (id, summaryData) => {
    try {
        const response = await api.patch(`/summary/${id}/`, summaryData);
        return unwrap(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

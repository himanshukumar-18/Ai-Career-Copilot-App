import api from "../../api/axios";

const unwrapResponse = (response) =>
    response?.data?.data ?? response?.data?.results ?? response?.data;

const normalizeApiError = (error) => {
    const data = error?.response?.data;

    if (typeof data === "string") {
        return { message: data };
    }

    if (data && typeof data === "object") {
        return data;
    }

    return {
        message: error?.message || "Network error. Please try again.",
    };
};

const getSummary = async (resumeId) => {
    try {
        const response = await api.get(`/resumes/${resumeId}/summary/`);
        return unwrapResponse(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

const updateSummary = async ({ resumeId, content }) => {
    try {
        const response = await api.patch(
            `/resumes/${resumeId}/summary/`,
            { content }
        );

        return unwrapResponse(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

const summaryService = {
    getSummary,
    updateSummary,
};

export default summaryService;
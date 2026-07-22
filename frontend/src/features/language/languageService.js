import api from "@/api/axios";

const unwrap = (response) => {
    const body = response.data?.data ?? response.data;
    return Array.isArray(body?.results) ? body.results : body;
};

const normalizeApiError = (error) => {
    if (error.response?.data) {
        return error.response.data;
    }
    return { message: error.message || "Network error. Please try again." };
};

export const getLanguages = async (resumeId) => {
    try {
        const response = await api.get("/languages/", { params: { resume: resumeId } });
        return unwrap(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

export const createLanguage = async (resumeId, languageData) => {
    try {
        const response = await api.post("/languages/", { ...languageData, resume: resumeId });
        return unwrap(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

export const updateLanguage = async (id, languageData) => {
    try {
        const response = await api.patch(`/languages/${id}/`, languageData);
        return unwrap(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

export const deleteLanguage = async (id) => {
    try {
        await api.delete(`/languages/${id}/`);
        return id;
    } catch (error) {
        throw normalizeApiError(error);
    }
};

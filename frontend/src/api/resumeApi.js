import axiosInstance from "./axios";

const BASE_URL = "/api/v1/resumes";

export const resumeApi = {
    getResumes: (params = {}) =>
        axiosInstance.get(`${BASE_URL}/`, { params }),

    getResumeById: (id) =>
        axiosInstance.get(`${BASE_URL}/${id}/`),

    createResume: (data) =>
        axiosInstance.post(`${BASE_URL}/`, data),

    updateResume: (id, data) =>
        axiosInstance.patch(`${BASE_URL}/${id}/`, data),

    deleteResume: (id) =>
        axiosInstance.delete(`${BASE_URL}/${id}/`),

    duplicateResume: (id) =>
        axiosInstance.post(`${BASE_URL}/${id}/duplicate/`),

    publishResume: (id) =>
        axiosInstance.post(`${BASE_URL}/${id}/publish/`),

    unpublishResume: (id) =>
        axiosInstance.post(`${BASE_URL}/${id}/unpublish/`),

    setDefaultResume: (id) =>
        axiosInstance.post(`${BASE_URL}/${id}/set-default/`),
};

export default resumeApi;
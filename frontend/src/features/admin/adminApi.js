import api from "../../api/axios";

export const getAdminDashboardStats = async () => {
    const response = await api.get("/admin/dashboard/stats/");
    return response.data;
};

export const getAdminStudents = async (params = {}) => {
    const response = await api.get("/admin/students/", { params });
    return response.data;
};

export const getAdminStudentDetail = async (studentId) => {
    const response = await api.get(`/admin/students/${studentId}/`);
    return response.data;
};

export const toggleAdminStudentActive = async (studentId) => {
    const response = await api.patch(`/admin/students/${studentId}/toggle-active/`);
    return response.data;
};

export const getAdminCareerRoles = async (params = {}) => {
    const response = await api.get("/admin/career-roles/", { params });
    return response.data;
};

export const createAdminCareerRole = async (data) => {
    const response = await api.post("/admin/career-roles/", data);
    return response.data;
};

export const updateAdminCareerRole = async ({ id, data }) => {
    const response = await api.put(`/admin/career-roles/${id}/`, data);
    return response.data;
};

export const deleteAdminCareerRole = async (id) => {
    const response = await api.delete(`/admin/career-roles/${id}/`);
    return response.data;
};

export const getAdminResources = async () => {
    const response = await api.get("/admin/resources/");
    return response.data;
};

export const getAdminResumes = async () => {
    const response = await api.get("/admin/resumes/");
    return response.data;
};

export const getAdminAIMonitoring = async () => {
    const response = await api.get("/admin/ai-monitoring/");
    return response.data;
};

export const getAdminAnalytics = async () => {
    const response = await api.get("/admin/analytics/");
    return response.data;
};

export const getAdminHealth = async () => {
    const response = await api.get("/admin/health/");
    return response.data;
};

export const getAdminSettings = async () => {
    const response = await api.get("/admin/settings/");
    return response.data;
};

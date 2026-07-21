import api from "@/api/axios";

const requireResumeId = (resumeId) => {
    const numericResumeId = Number(resumeId);

    if (
        resumeId === undefined ||
        resumeId === null ||
        resumeId === "" ||
        Number.isNaN(numericResumeId)
    ) {
        throw {
            message: "Resume ID is missing or invalid.",
        };
    }

    return numericResumeId;
};

const unwrap = (response) => {
    const body = response.data?.data ?? response.data;

    if (
        body &&
        typeof body === "object" &&
        Array.isArray(body.results)
    ) {
        return body.results;
    }

    return body;
};

const normalizeApiError = (error) => {
    if (error.response?.data) return error.response.data;
    return { message: error.message || "Network error. Please try again." };
};

export const getProjects = async (resumeId) => {
    try {
        const validResumeId = requireResumeId(resumeId);

        const response = await api.get("/projects/", {
            params: {
                resume: validResumeId,
            },
        });

        return unwrap(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

export const createProject = async (
    resumeId,
    projectData
) => {
    try {
        const validResumeId = requireResumeId(resumeId);

        const payload = {
            ...projectData,
            resume: validResumeId,
        };

        const response = await api.post(
            "/projects/",
            payload
        );

        return unwrap(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

export const updateProject = async (
    id,
    projectData
) => {
    try {
        const response = await api.patch(
            `/projects/${id}/`,
            projectData
        );

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

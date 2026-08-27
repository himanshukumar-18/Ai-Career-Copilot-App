import api from "../../api/axios";

const unwrap = (response) => {
    const body = response.data?.data ?? response.data;

    // Paginated list responses look like:
    // { data: { pagination: {...}, results: [...] } }
    // Plain create/update responses look like:
    // { data: { id, name, ... } }
    if (body && typeof body === "object" && Array.isArray(body.results)) {
        return body.results;
    }

    return body;
};

const normalizeApiError = (error) => {
    if (error.response?.data) return error.response.data;
    return { message: error.message || "Network error. Please try again." };
};

/**
 * Validates a resume id and returns it as a clean number, or throws a
 * clear error. Catching a bad id here means it never silently becomes
 * `NaN` in a request payload and fails on the server with a confusing
 * 400 — the same bug this app hit in Experience and Education.
 */
const requireResumeId = (resumeId) => {
    const numericResumeId = Number(resumeId);

    if (
        resumeId === undefined ||
        resumeId === null ||
        resumeId === "" ||
        Number.isNaN(numericResumeId)
    ) {
        throw { message: "Resume ID is missing or invalid." };
    }

    return numericResumeId;
};

export const getSkills = async (resumeId) => {
    try {
        const validResumeId = requireResumeId(resumeId);

        const response = await api.get("/skills/", {
            params: { resume: validResumeId },
        });

        return unwrap(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

export const createSkill = async (resumeId, skillData) => {
    try {
        const validResumeId = requireResumeId(resumeId);

        const payload = {
            ...skillData,
            resume: validResumeId,
        };

        const response = await api.post("/skills/", payload);
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
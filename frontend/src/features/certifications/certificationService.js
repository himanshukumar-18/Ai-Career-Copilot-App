import api from "../../api/axios";

const unwrapApiResponse = (response) => {
    const body = response.data?.data ?? response.data;

    // Paginated list responses look like:
    // { data: { pagination: {...}, results: [...] } }
    if (body && typeof body === "object" && Array.isArray(body.results)) {
        return body.results;
    }

    return body;
};

const normalizeApiError = (error) => {
    if (error.response?.data) {
        return error.response.data;
    }
    return { message: error.message || "Network error. Please try again." };
};

/**
 * Validates a resume id and returns it as a clean number, or throws a
 * clear error, so a missing/broken id never silently turns into `NaN`
 * in a request.
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

export const getCertifications = async (resumeId) => {
    try {
        const validResumeId = requireResumeId(resumeId);

        const response = await api.get("/certifications/", {
            params: { resume: validResumeId },
        });

        return unwrapApiResponse(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

export const createCertification = async (resumeId, certificationData) => {
    try {
        const validResumeId = requireResumeId(resumeId);

        const payload = {
            ...certificationData,
            resume: validResumeId,
        };

        const response = await api.post("/certifications/", payload);
        return unwrapApiResponse(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

export const updateCertification = async (id, certificationData) => {
    try {
        const response = await api.patch(
            `/certifications/${id}/`,
            certificationData
        );
        return unwrapApiResponse(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

export const deleteCertification = async (id) => {
    try {
        await api.delete(`/certifications/${id}/`);
        return id;
    } catch (error) {
        throw normalizeApiError(error);
    }
};
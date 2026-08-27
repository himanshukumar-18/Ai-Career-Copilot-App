import api from "../../api/axios";

const unwrap = (response) => {
    const body = response.data?.data ?? response.data;

    // Paginated list responses look like:
    // { data: { pagination: {...}, results: [...] } }
    // Plain create/update responses look like:
    // { data: { id, degree, ... } }
    if (body && typeof body === "object" && Array.isArray(body.results)) {
        return body.results;
    }

    return body;
};

const normalizeApiError = (error) => {
    if (error.response?.data) {
        throw error.response.data;
    }

    throw {
        detail: error.message || "Something went wrong.",
    };
};

/**
 * Validates a resume id and returns it as a clean number, or throws a
 * clear error. Using this everywhere a resumeId is required means a
 * missing/broken id is caught here — as a readable error — instead of
 * silently becoming `NaN` in a request payload and failing on the server
 * with a confusing 400.
 */
const requireResumeId = (resumeId) => {
    const numericResumeId = Number(resumeId);

    if (
        resumeId === undefined ||
        resumeId === null ||
        resumeId === "" ||
        Number.isNaN(numericResumeId)
    ) {
        throw { detail: "Resume ID is missing or invalid." };
    }

    return numericResumeId;
};

/*
|--------------------------------------------------------------------------
| GET
|--------------------------------------------------------------------------
*/

export const getEducations = async (resumeId) => {
    try {
        const validResumeId = requireResumeId(resumeId);

        const response = await api.get("/educations/", {
            params: { resume: validResumeId },
        });

        return unwrap(response);
    } catch (error) {
        normalizeApiError(error);
    }
};

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

export const createEducation = async (resumeId, educationData) => {
    try {
        const validResumeId = requireResumeId(resumeId);

        const payload = {
            ...educationData,
            resume: validResumeId,
        };

        const response = await api.post("/educations/", payload);

        return unwrap(response);
    } catch (error) {
        normalizeApiError(error);
    }
};

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

export const updateEducation = async (id, resumeId, educationData) => {
    try {
        const validResumeId = requireResumeId(resumeId);

        const payload = {
            ...educationData,
            resume: validResumeId,
        };

        const response = await api.patch(`/educations/${id}/`, payload);

        return unwrap(response);
    } catch (error) {
        normalizeApiError(error);
    }
};

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

export const deleteEducation = async (id) => {
    try {
        await api.delete(`/educations/${id}/`);
        return id;
    } catch (error) {
        normalizeApiError(error);
    }
};
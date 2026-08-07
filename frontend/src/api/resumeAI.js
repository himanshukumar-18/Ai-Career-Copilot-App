import api from "./axios";

/**
 * ----------------------------------------
 * Resume AI API Service
 * ----------------------------------------
 * Responsibilities:
 * - Call Resume AI endpoints
 * - Normalize API responses
 * - Normalize API errors
 * ----------------------------------------
 */

const unwrap = (response) =>
    response.data?.data ??
    response.data?.results ??
    response.data;

/**
 * Normalize axios errors into a consistent object.
 */
const normalizeError = (error) => {
    const data = error.response?.data;

    if (data) {
        return {
            message:
                data.message ??
                data.detail ??
                (typeof data === "string" ? data : "Unable to complete the request."),
            errors: data.errors,
        };
    }

    return {
        success: false,
        message: error.message || "Something went wrong.",
    };
};

/**
 * Analyze a resume.
 *
 * POST /resume-ai/analyze/
 *
 * @param {number} resumeId
 * @returns {Promise<Object>}
 */
export const analyzeResume = async (resumeId) => {
    try {
        const response = await api.post("/resume-ai/analyze/", {
            resume_id: resumeId,
        });

        return unwrap(response);
    } catch (error) {
        throw normalizeError(error);
    }
};

/**
 * Improve a resume section.
 *
 * POST /resume-ai/improve/
 *
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export const improveResumeSection = async (payload) => {
    try {
        const response = await api.post(
            "/resume-ai/improve/",
            payload
        );

        return unwrap(response);
    } catch (error) {
        throw normalizeError(error);
    }
};

/**
 * Match resume against a job description.
 *
 * POST /resume-ai/job-match/
 *
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export const matchResumeToJob = async (payload) => {
    try {
        const response = await api.post(
            "/resume-ai/job-match/",
            payload
        );

        return unwrap(response);
    } catch (error) {
        throw normalizeError(error);
    }
};

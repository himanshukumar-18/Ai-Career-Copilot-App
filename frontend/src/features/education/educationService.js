// api/education.js

import api from "@/api/axios";

/**
 * @typedef {Object} Education
 * @property {string} [id]
 * @property {string} institution
 * @property {string} degree
 * @property {string} [field_of_study]
 * @property {string} [start_date]  ISO date string
 * @property {string} [end_date]    ISO date string, omit if currently enrolled
 * @property {boolean} [is_current]
 * @property {string} [grade]
 * @property {string} [description]
 */

const unwrap = (response) => response.data?.data ?? response.data;

/**
 * Normalizes an axios error into a plain object the thunk's rejectWithValue
 * can pass straight to the slice ({ message } / { detail } shape).
 */
const normalizeApiError = (error) => {
    if (error.response?.data) {
        return error.response.data;
    }
    return { message: error.message || "Network error. Please try again." };
};

/**
 * Fetches all education entries for the current user/resume.
 * @returns {Promise<Education[]>}
 */
export const getEducations = async () => {
    try {
        const response = await api.get("/educations/");
        return unwrap(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

/**
 * Creates a new education entry.
 * @param {Education} educationData
 * @returns {Promise<Education>}
 */
export const createEducation = async (educationData) => {
    try {
        const response = await api.post("/educations/", educationData);
        return unwrap(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

/**
 * Partially updates an existing education entry.
 * @param {string} id
 * @param {Partial<Education>} educationData
 * @returns {Promise<Education>}
 */
export const updateEducation = async (id, educationData) => {
    try {
        const response = await api.patch(`/educations/${id}/`, educationData);
        return unwrap(response);
    } catch (error) {
        throw normalizeApiError(error);
    }
};

/**
 * Deletes an education entry.
 * @param {string} id
 * @returns {Promise<string>} the deleted entry's id, for removing it from state
 */
export const deleteEducation = async (id) => {
    try {
        await api.delete(`/educations/${id}/`);
        return id;
    } catch (error) {
        throw normalizeApiError(error);
    }
};
import api from "../../api/axios";

/**
 * Unwraps a DRF-style response, falling back to raw response data
 * if no nested "data" key is present.
 * @param {import("axios").AxiosResponse} response
 * @returns {*}
 */
const unwrap = (response) => response.data?.data ?? response.data;

/**
 * Fetch all experience entries for the current user.
 * @returns {Promise<Array<Object>>}
 */
export const getExperiences = async () => {
    const response = await api.get("/experiences/");
    return unwrap(response);
};

/**
 * Create a new experience entry.
 * @param {Object} experienceData
 * @returns {Promise<Object>}
 */
export const createExperience = async (experienceData) => {
    const response = await api.post("/experiences/", experienceData);
    return unwrap(response);
};

/**
 * Update an existing experience entry (partial update).
 * @param {string|number} id
 * @param {Object} experienceData
 * @returns {Promise<Object>}
 */
export const updateExperience = async (id, experienceData) => {
    const response = await api.patch(`/experiences/${id}/`, experienceData);
    return unwrap(response);
};

/**
 * Delete an experience entry.
 * @param {string|number} id
 * @returns {Promise<string|number>} the deleted id
 */
export const deleteExperience = async (id) => {
    await api.delete(`/experiences/${id}/`);
    return id;
};
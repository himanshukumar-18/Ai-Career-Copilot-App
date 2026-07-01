import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
} from "@/api/services/experienceApi";

/**
 * Pulls a readable error message out of a DRF-style error response.
 * @param {*} error - Axios error object
 * @returns {string}
 */
const extractErrorMessage = (error) => {
    const data = error?.response?.data;
    if (!data) return error?.message || "Something went wrong";

    if (typeof data === "string") return data;
    if (data.detail) return data.detail;
    if (data.message) return data.message;

    // DRF field errors, e.g. { title: ["This field is required."] }
    const firstKey = Object.keys(data)[0];
    if (firstKey) {
        const value = data[firstKey];
        return Array.isArray(value) ? value[0] : String(value);
    }

    return "Something went wrong";
};

/** Fetch all experiences */
export const fetchExperiences = createAsyncThunk(
    "experience/fetchExperiences",
    async (_, { rejectWithValue }) => {
        try {
            return await getExperiences();
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

/** Add a new experience */
export const addExperience = createAsyncThunk(
    "experience/addExperience",
    async (experienceData, { rejectWithValue }) => {
        try {
            return await createExperience(experienceData);
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

/** Update a single experience by id */
export const editExperience = createAsyncThunk(
    "experience/editExperience",
    async ({ id, experienceData }, { rejectWithValue }) => {
        try {
            return await updateExperience(id, experienceData);
        } catch (error) {
            return rejectWithValue({ id, message: extractErrorMessage(error) });
        }
    }
);

/** Remove a single experience by id */
export const removeExperience = createAsyncThunk(
    "experience/removeExperience",
    async (id, { rejectWithValue }) => {
        try {
            return await deleteExperience(id);
        } catch (error) {
            return rejectWithValue({ id, message: extractErrorMessage(error) });
        }
    }
);
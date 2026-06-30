// features/education/educationThunk.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getEducations,
    createEducation,
    updateEducation,
    deleteEducation,
} from "./educationService";

/**
 * Fetches all education entries.
 */
export const getEducationsThunk = createAsyncThunk(
    "education/getAll",
    async (_, { rejectWithValue }) => {
        try {
            return await getEducations();
        } catch (error) {
            return rejectWithValue(
                error.response?.data ?? { message: error.message }
            );
        }
    }
);

/**
 * Creates a new education entry.
 * @param {Object} educationData
 */
export const createEducationThunk = createAsyncThunk(
    "education/create",
    async (educationData, { rejectWithValue }) => {
        try {
            return await createEducation(educationData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data ?? { message: error.message }
            );
        }
    }
);

/**
 * Updates an existing education entry.
 * @param {{ id: string, educationData: Object }} payload
 */
export const updateEducationThunk = createAsyncThunk(
    "education/update",
    async ({ id, educationData }, { rejectWithValue }) => {
        try {
            return await updateEducation(id, educationData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data ?? { message: error.message }
            );
        }
    }
);

/**
 * Deletes an education entry by id.
 * @param {string} id
 * @returns {Promise<string>} the deleted entry's id
 */
export const deleteEducationThunk = createAsyncThunk(
    "education/delete",
    async (id, { rejectWithValue }) => {
        try {
            return await deleteEducation(id);
        } catch (error) {
            return rejectWithValue(
                error.response?.data ?? { message: error.message }
            );
        }
    }
);
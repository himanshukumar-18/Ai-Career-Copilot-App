// features/education/educationThunk.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getEducations,
    createEducation,
    updateEducation,
    deleteEducation,
} from "./educationService";

/**
 * Fetches all education entries for a resume.
 * @param {string|number} resumeId
 */
export const getEducationsThunk = createAsyncThunk(
    "education/getAll",
    async (resumeId, { rejectWithValue }) => {
        try {
            return await getEducations(resumeId);
        } catch (error) {
            return rejectWithValue(
                error.response?.data ?? error ?? { message: error.message }
            );
        }
    }
);

/**
 * Creates a new education entry.
 * @param {{ resumeId: string|number, educationData: Object }} payload
 */
export const createEducationThunk = createAsyncThunk(
    "education/create",
    async ({ resumeId, educationData }, { rejectWithValue }) => {
        try {
            return await createEducation(resumeId, educationData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data ?? error ?? { message: error.message }
            );
        }
    }
);

/**
 * Updates an existing education entry.
 * @param {{ id: string, resumeId: string|number, educationData: Object }} payload
 */
export const updateEducationThunk = createAsyncThunk(
    "education/update",
    async ({ id, resumeId, educationData }, { rejectWithValue }) => {
        try {
            return await updateEducation(id, resumeId, educationData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data ?? error ?? { message: error.message }
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
                error.response?.data ?? error ?? { message: error.message }
            );
        }
    }
);
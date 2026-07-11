import { createAsyncThunk } from "@reduxjs/toolkit";
import experienceService from "./experienceService";

const getErrorMessage = (error, fallbackMessage) => {
    const responseData = error?.response?.data;
    const data = responseData?.errors ?? responseData;

    if (typeof data === "string") {
        return data;
    }

    if (data?.detail) {
        return data.detail;
    }

    if (data?.message) {
        return data.message;
    }

    if (data && typeof data === "object") {
        const firstKey = Object.keys(data)[0];

        if (firstKey) {
            const value = data[firstKey];

            return Array.isArray(value)
                ? value[0]
                : String(value);
        }
    }

    return error?.message || fallbackMessage;
};

export const fetchExperiences = createAsyncThunk(
    "experience/fetchExperiences",
    async (resumeId, { rejectWithValue }) => {
        try {
            return await experienceService.getExperiences(resumeId);
        } catch (error) {
            return rejectWithValue(
                getErrorMessage(error, "Unable to load experiences.")
            );
        }
    }
);

export const addExperience = createAsyncThunk(
    "experience/addExperience",
    async (payload, { rejectWithValue }) => {
        try {
            return await experienceService.createExperience(payload);
        } catch (error) {
            return rejectWithValue(
                getErrorMessage(error, "Unable to add experience.")
            );
        }
    }
);

export const editExperience = createAsyncThunk(
    "experience/editExperience",
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            return await experienceService.updateExperience(id, payload);
        } catch (error) {
            return rejectWithValue({
                id,
                message: getErrorMessage(
                    error,
                    "Unable to update experience."
                ),
            });
        }
    }
);

export const removeExperience = createAsyncThunk(
    "experience/removeExperience",
    async (id, { rejectWithValue }) => {
        try {
            return await experienceService.deleteExperience(id);
        } catch (error) {
            return rejectWithValue({
                id,
                message: getErrorMessage(
                    error,
                    "Unable to delete experience."
                ),
            });
        }
    }
);
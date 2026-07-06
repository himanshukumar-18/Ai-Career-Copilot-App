import { createAsyncThunk } from "@reduxjs/toolkit";
import resumeProfileService from "./resumeProfileService";

const getErrorMessage = (error, fallbackMessage) =>
    error?.response?.data || {
        message: fallbackMessage,
    };

export const fetchResumeProfileThunk = createAsyncThunk(
    "resumeProfile/fetch",
    async (resumeId, { rejectWithValue }) => {
        try {
            return await resumeProfileService.getResumeProfile(resumeId);
        } catch (error) {
            return rejectWithValue(
                getErrorMessage(error, "Failed to fetch resume profile.")
            );
        }
    }
);

export const createResumeProfileThunk = createAsyncThunk(
    "resumeProfile/create",
    async ({ resumeId, data }, { rejectWithValue }) => {
        try {
            return await resumeProfileService.createResumeProfile(
                resumeId,
                data
            );
        } catch (error) {
            return rejectWithValue(
                getErrorMessage(error, "Failed to create resume profile.")
            );
        }
    }
);

export const updateResumeProfileThunk = createAsyncThunk(
    "resumeProfile/update",
    async ({ resumeId, data }, { rejectWithValue }) => {
        try {
            return await resumeProfileService.updateResumeProfile(
                resumeId,
                data
            );
        } catch (error) {
            return rejectWithValue(
                getErrorMessage(error, "Failed to update resume profile.")
            );
        }
    }
);

export const uploadResumePhotoThunk = createAsyncThunk(
    "resumeProfile/uploadPhoto",
    async ({ resumeId, photoFile }, { rejectWithValue }) => {
        try {
            return await resumeProfileService.uploadResumePhoto(
                resumeId,
                photoFile
            );
        } catch (error) {
            return rejectWithValue(
                getErrorMessage(error, "Failed to upload profile photo.")
            );
        }
    }
);
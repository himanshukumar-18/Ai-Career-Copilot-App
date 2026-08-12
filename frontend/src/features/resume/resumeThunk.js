import { createAsyncThunk } from "@reduxjs/toolkit";
import resumeApi from "../../api/resumeApi";

const publishErrorPayload = (error, fallback) => {
    const payload = error?.response?.data;
    const status = error?.response?.status;

    if (payload) {
        return {
            ...payload,
            message: payload.message || payload.detail || fallback,
            status,
        };
    }

    if (error?.code === "ECONNABORTED") {
        return { message: "The publish request timed out. Please try again.", status };
    }

    return { message: error?.message || "Network error while publishing. Please try again.", status };
};


// Fetch All Resumes
export const fetchResumes = createAsyncThunk(
    "resume/fetchResumes",
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await resumeApi.getResumes(params);

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to fetch resumes.",
                }
            );
        }
    }
);


// Fetch Resume By ID
export const fetchResumeById = createAsyncThunk(
    "resume/fetchResumeById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await resumeApi.getResumeById(id);

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to fetch resume.",
                }
            );
        }
    }
);


// Create Resume
export const createResume = createAsyncThunk(
    "resume/createResume",
    async (resumeData, { rejectWithValue }) => {
        try {
            const response = await resumeApi.createResume(resumeData);

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to create resume.",
                }
            );
        }
    }
);


// Update Resume
export const updateResume = createAsyncThunk(
    "resume/updateResume",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await resumeApi.updateResume(id, data);

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to update resume.",
                }
            );
        }
    }
);


// Delete Resume
export const deleteResume = createAsyncThunk(
    "resume/deleteResume",
    async (id, { rejectWithValue }) => {
        try {
            await resumeApi.deleteResume(id);

            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to delete resume.",
                }
            );
        }
    }
);


// Duplicate Resume
export const duplicateResume = createAsyncThunk(
    "resume/duplicateResume",
    async (id, { rejectWithValue }) => {
        try {
            const response = await resumeApi.duplicateResume(id);

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to duplicate resume.",
                }
            );
        }
    }
);


// Publish Resume
export const publishResume = createAsyncThunk(
    "resume/publishResume",
    async (id, { rejectWithValue }) => {
        try {
            const response = await resumeApi.publishResume(id);

            const payload = response.data;
            const publishedResume = payload?.data?.resume;
            const publicPath = payload?.data?.public_path;

            if (!payload?.success || !publishedResume || !publicPath) {
                return rejectWithValue({
                    message: "Resume was published, but the public link could not be retrieved. Please try again.",
                    status: response.status,
                });
            }

            return {
                ...payload,
                data: {
                    ...payload.data,
                    public_url: new URL(publicPath, window.location.origin).toString(),
                },
            };
        } catch (error) {
            return rejectWithValue(publishErrorPayload(error, "Unable to publish resume."));
        }
    }
);


// Unpublish Resume
export const unpublishResume = createAsyncThunk(
    "resume/unpublishResume",
    async (id, { rejectWithValue }) => {
        try {
            const response = await resumeApi.unpublishResume(id);

            const payload = response.data;
            if (!payload?.success || !payload?.data?.resume) {
                return rejectWithValue({ message: "The resume was unpublished, but its updated state could not be retrieved." });
            }
            return payload;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to unpublish resume.",
                }
            );
        }
    }
);

// Set Default Resume
export const setDefaultResume = createAsyncThunk(
    "resume/setDefaultResume",
    async (id, { rejectWithValue }) => {
        try {
            const response = await resumeApi.setDefaultResume(id);

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to set default resume.",
                }
            );
        }
    }
);

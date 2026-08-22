import { createAsyncThunk } from "@reduxjs/toolkit";
import projectLabApi from "../../api/projectLabApi";

const normalizeError = (error, fallbackMessage) => {
    if (!error?.response) {
        return error?.message || fallbackMessage;
    }
    const data = error.response.data;
    if (data?.message) return data.message;
    if (data?.errors) {
        if (typeof data.errors === "string") return data.errors;
        if (typeof data.errors === "object") {
            const firstKey = Object.keys(data.errors)[0];
            const val = data.errors[firstKey];
            return Array.isArray(val) ? val[0] : String(val);
        }
    }
    if (data?.detail) return data.detail;
    return fallbackMessage;
};

export const generateProjectsThunk = createAsyncThunk(
    "projectLab/generateProjects",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await projectLabApi.generateProjects(payload);
            return response.data?.data || [];
        } catch (error) {
            return rejectWithValue(
                normalizeError(error, "Failed to generate project suggestions.")
            );
        }
    }
);

export const fetchMyProjectsThunk = createAsyncThunk(
    "projectLab/fetchMyProjects",
    async (params, { rejectWithValue }) => {
        try {
            const response = await projectLabApi.getMyProjects(params);
            const data = response.data?.data;
            if (data && typeof data === "object" && "results" in data) {
                return {
                    results: data.results || [],
                    pagination: data.pagination || null,
                };
            }
            return {
                results: Array.isArray(data) ? data : [],
                pagination: null,
            };
        } catch (error) {
            return rejectWithValue(
                normalizeError(error, "Failed to load your project list.")
            );
        }
    }
);

export const fetchProjectByIdThunk = createAsyncThunk(
    "projectLab/fetchProjectById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await projectLabApi.getProjectById(id);
            return response.data?.data;
        } catch (error) {
            return rejectWithValue(
                normalizeError(error, "Failed to load project details.")
            );
        }
    }
);

export const saveGeneratedProjectThunk = createAsyncThunk(
    "projectLab/saveGeneratedProject",
    async (generatedProjectId, { rejectWithValue }) => {
        try {
            const response = await projectLabApi.saveGeneratedProject({
                generated_project_id: generatedProjectId,
            });
            return response.data?.data;
        } catch (error) {
            return rejectWithValue(
                normalizeError(error, "Failed to save project to your list.")
            );
        }
    }
);

export const updateProjectStatusThunk = createAsyncThunk(
    "projectLab/updateProjectStatus",
    async ({ id, status, repo_link, notes }, { rejectWithValue }) => {
        try {
            const payload = { status };
            if (repo_link !== undefined) payload.repo_link = repo_link;
            if (notes !== undefined) payload.notes = notes;

            const response = await projectLabApi.updateProjectStatus(id, payload);
            return response.data?.data;
        } catch (error) {
            return rejectWithValue(
                normalizeError(error, "Failed to update project status.")
            );
        }
    }
);

export const deleteUserProjectThunk = createAsyncThunk(
    "projectLab/deleteUserProject",
    async (id, { rejectWithValue }) => {
        try {
            await projectLabApi.deleteProject(id);
            return id;
        } catch (error) {
            return rejectWithValue(
                normalizeError(error, "Failed to delete project.")
            );
        }
    }
);

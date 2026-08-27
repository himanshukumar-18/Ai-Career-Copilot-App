import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
} from "./projectService";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sanitizes a project payload before sending it to the API.
 *
 * - Converts empty strings to `null` so optional fields are not rejected
 *   by the backend with a 400 Bad Request.
 * - Sets `end_date` to `null` when `currently_working` is true, because a
 *   current project has no end date.
 *
 * @param {object} data - Raw project form values.
 * @returns {object} Sanitized payload safe to send to the API.
 */
const sanitizeProject = (data) => {
    const sanitized = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
            key,
            typeof value === "string" && value.trim() === "" ? null : value,
        ])
    );

    if (sanitized.currently_working) {
        sanitized.end_date = null;
    }

    return sanitized;
};

// ─────────────────────────────────────────────────────────────────────────────
// Thunks
// ─────────────────────────────────────────────────────────────────────────────

/** Fetch all projects for a given resume. */
export const getProjectsThunk = createAsyncThunk(
    "projects/getAll",
    async (resumeId, { rejectWithValue }) => {
        try {
            return await getProjects(resumeId);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

/** Create a new project entry. */
export const createProjectThunk = createAsyncThunk(
    "projects/create",
    async ({ resumeId, projectData }, { rejectWithValue }) => {
        try {
            return await createProject(resumeId, sanitizeProject(projectData));
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

/** Update an existing project entry. */
export const updateProjectThunk = createAsyncThunk(
    "projects/update",
    async ({ id, projectData }, { rejectWithValue }) => {
        try {
            return await updateProject(id, sanitizeProject(projectData));
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

/** Delete a project entry by its ID. */
export const deleteProjectThunk = createAsyncThunk(
    "projects/delete",
    async (id, { rejectWithValue }) => {
        try {
            return await deleteProject(id);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

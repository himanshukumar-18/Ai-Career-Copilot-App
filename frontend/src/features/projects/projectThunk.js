import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
} from "./projectService";

export const getProjectsThunk = createAsyncThunk(
    "projects/getAll",
    async (_, { rejectWithValue }) => {
        try {
            return await getProjects();
        } catch (error) {
            return rejectWithValue(error.response?.data ?? { message: error.message });
        }
    }
);

export const createProjectThunk = createAsyncThunk(
    "projects/create",
    async (projectData, { rejectWithValue }) => {
        try {
            return await createProject(projectData);
        } catch (error) {
            return rejectWithValue(error.response?.data ?? { message: error.message });
        }
    }
);

export const updateProjectThunk = createAsyncThunk(
    "projects/update",
    async ({ id, projectData }, { rejectWithValue }) => {
        try {
            return await updateProject(id, projectData);
        } catch (error) {
            return rejectWithValue(error.response?.data ?? { message: error.message });
        }
    }
);

export const deleteProjectThunk = createAsyncThunk(
    "projects/delete",
    async (id, { rejectWithValue }) => {
        try {
            return await deleteProject(id);
        } catch (error) {
            return rejectWithValue(error.response?.data ?? { message: error.message });
        }
    }
);

import { createSlice } from "@reduxjs/toolkit";
import {
    getProjectsThunk,
    createProjectThunk,
    updateProjectThunk,
    deleteProjectThunk,
} from "./projectThunk";

const FETCH_ERROR_FALLBACK = "Unable to load projects. Please try again.";
const CREATE_ERROR_FALLBACK = "Unable to add project. Please try again.";
const UPDATE_ERROR_FALLBACK = "Unable to update project. Please try again.";
const DELETE_ERROR_FALLBACK = "Unable to delete project. Please try again.";

const extractErrorMessage = (payload, fallback) => {
    if (!payload) return fallback;
    if (typeof payload === "string") return payload;
    return payload.message ?? payload.detail ?? fallback;
};

const initialState = {
    items: [],
    fetchStatus: "idle",
    mutateStatus: "idle",
    error: null,
};

const projectSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        resetMutateStatus(state) {
            state.mutateStatus = "idle";
            state.error = null;
        },
        clearProjects(state) {
            state.items = [];
            state.fetchStatus = "idle";
            state.mutateStatus = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProjectsThunk.pending, (state) => {
                state.fetchStatus = "pending";
                state.error = null;
            })
            .addCase(getProjectsThunk.fulfilled, (state, { payload }) => {
                state.fetchStatus = "succeeded";
                state.items = payload ?? [];
            })
            .addCase(getProjectsThunk.rejected, (state, { payload }) => {
                state.fetchStatus = "failed";
                state.error = extractErrorMessage(payload, FETCH_ERROR_FALLBACK);
            })
            .addCase(createProjectThunk.pending, (state) => {
                state.mutateStatus = "pending";
                state.error = null;
            })
            .addCase(createProjectThunk.fulfilled, (state, { payload }) => {
                state.mutateStatus = "succeeded";
                state.items.push(payload);
            })
            .addCase(createProjectThunk.rejected, (state, { payload }) => {
                state.mutateStatus = "failed";
                state.error = extractErrorMessage(payload, CREATE_ERROR_FALLBACK);
            })
            .addCase(updateProjectThunk.pending, (state) => {
                state.mutateStatus = "pending";
                state.error = null;
            })
            .addCase(updateProjectThunk.fulfilled, (state, { payload }) => {
                state.mutateStatus = "succeeded";
                const index = state.items.findIndex((i) => i.id === payload.id);
                if (index !== -1) state.items[index] = payload;
            })
            .addCase(updateProjectThunk.rejected, (state, { payload }) => {
                state.mutateStatus = "failed";
                state.error = extractErrorMessage(payload, UPDATE_ERROR_FALLBACK);
            })
            .addCase(deleteProjectThunk.pending, (state) => {
                state.mutateStatus = "pending";
                state.error = null;
            })
            .addCase(deleteProjectThunk.fulfilled, (state, { payload: deletedId }) => {
                state.mutateStatus = "succeeded";
                state.items = state.items.filter((item) => item.id !== deletedId);
            })
            .addCase(deleteProjectThunk.rejected, (state, { payload }) => {
                state.mutateStatus = "failed";
                state.error = extractErrorMessage(payload, DELETE_ERROR_FALLBACK);
            });
    },
});

export const { resetMutateStatus, clearProjects } = projectSlice.actions;
export default projectSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { getSkillsThunk, createSkillThunk, updateSkillThunk, deleteSkillThunk } from "./skillThunk";

const FETCH_ERROR_FALLBACK = "Unable to load skills. Please try again.";
const CREATE_ERROR_FALLBACK = "Unable to add skill. Please try again.";
const UPDATE_ERROR_FALLBACK = "Unable to update skill. Please try again.";
const DELETE_ERROR_FALLBACK = "Unable to delete skill. Please try again.";

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

const skillSlice = createSlice({
    name: "skills",
    initialState,
    reducers: {
        resetMutateStatus(state) {
            state.mutateStatus = "idle";
            state.error = null;
        },
        clearSkills(state) {
            state.items = [];
            state.fetchStatus = "idle";
            state.mutateStatus = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSkillsThunk.pending, (state) => {
                state.fetchStatus = "pending";
                state.error = null;
            })
            .addCase(getSkillsThunk.fulfilled, (state, { payload }) => {
                state.fetchStatus = "succeeded";
                state.items = payload ?? [];
            })
            .addCase(getSkillsThunk.rejected, (state, { payload }) => {
                state.fetchStatus = "failed";
                state.error = extractErrorMessage(payload, FETCH_ERROR_FALLBACK);
            })
            .addCase(createSkillThunk.pending, (state) => {
                state.mutateStatus = "pending";
                state.error = null;
            })
            .addCase(createSkillThunk.fulfilled, (state, { payload }) => {
                state.mutateStatus = "succeeded";
                state.items.push(payload);
            })
            .addCase(createSkillThunk.rejected, (state, { payload }) => {
                state.mutateStatus = "failed";
                state.error = extractErrorMessage(payload, CREATE_ERROR_FALLBACK);
            })
            .addCase(updateSkillThunk.pending, (state) => {
                state.mutateStatus = "pending";
                state.error = null;
            })
            .addCase(updateSkillThunk.fulfilled, (state, { payload }) => {
                state.mutateStatus = "succeeded";
                const index = state.items.findIndex((i) => i.id === payload.id);
                if (index !== -1) state.items[index] = payload;
            })
            .addCase(updateSkillThunk.rejected, (state, { payload }) => {
                state.mutateStatus = "failed";
                state.error = extractErrorMessage(payload, UPDATE_ERROR_FALLBACK);
            })
            .addCase(deleteSkillThunk.pending, (state) => {
                state.mutateStatus = "pending";
                state.error = null;
            })
            .addCase(deleteSkillThunk.fulfilled, (state, { payload: deletedId }) => {
                state.mutateStatus = "succeeded";
                state.items = state.items.filter((item) => item.id !== deletedId);
            })
            .addCase(deleteSkillThunk.rejected, (state, { payload }) => {
                state.mutateStatus = "failed";
                state.error = extractErrorMessage(payload, DELETE_ERROR_FALLBACK);
            });
    },
});

export const { resetMutateStatus, clearSkills } = skillSlice.actions;
export default skillSlice.reducer;

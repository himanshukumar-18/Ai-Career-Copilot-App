import { createSlice } from "@reduxjs/toolkit";
import {
    getEducationsThunk,
    createEducationThunk,
    updateEducationThunk,
    deleteEducationThunk,
} from "./educationThunk";

const FETCH_ERROR_FALLBACK = "Unable to load education history. Please try again.";
const CREATE_ERROR_FALLBACK = "Unable to add education entry. Please try again.";
const UPDATE_ERROR_FALLBACK = "Unable to update education entry. Please try again.";
const DELETE_ERROR_FALLBACK = "Unable to delete education entry. Please try again.";

const extractErrorMessage = (payload, fallback) => {
    if (!payload) return fallback;
    if (typeof payload === "string") return payload;
    return payload.message ?? payload.detail ?? fallback;
};

const initialState = {
    items: [],

    fetchStatus: "idle",  // "idle" | "pending" | "succeeded" | "failed"
    mutateStatus: "idle", // "idle" | "pending" | "succeeded" | "failed"
    // shared across create/update/delete since only one
    // mutation tends to run at a time from the UI

    error: null,
};

const educationSlice = createSlice({
    name: "education",
    initialState,
    reducers: {
        resetMutateStatus(state) {
            state.mutateStatus = "idle";
            state.error = null;
        },
        clearEducation(state) {
            state.items = [];
            state.fetchStatus = "idle";
            state.mutateStatus = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // ── Fetch all ────────────────────────────────────────────────────────
        builder
            .addCase(getEducationsThunk.pending, (state) => {
                state.fetchStatus = "pending";
                state.error = null;
            })
            .addCase(getEducationsThunk.fulfilled, (state, { payload }) => {
                state.fetchStatus = "succeeded";
                state.items = payload ?? [];
            })
            .addCase(getEducationsThunk.rejected, (state, { payload }) => {
                state.fetchStatus = "failed";
                state.error = extractErrorMessage(payload, FETCH_ERROR_FALLBACK);
            });

        // ── Create ───────────────────────────────────────────────────────────
        builder
            .addCase(createEducationThunk.pending, (state) => {
                state.mutateStatus = "pending";
                state.error = null;
            })
            .addCase(createEducationThunk.fulfilled, (state, { payload }) => {
                state.mutateStatus = "succeeded";
                state.items.push(payload);
            })
            .addCase(createEducationThunk.rejected, (state, { payload }) => {
                state.mutateStatus = "failed";
                state.error = extractErrorMessage(payload, CREATE_ERROR_FALLBACK);
            });

        // ── Update ───────────────────────────────────────────────────────────
        builder
            .addCase(updateEducationThunk.pending, (state) => {
                state.mutateStatus = "pending";
                state.error = null;
            })
            .addCase(updateEducationThunk.fulfilled, (state, { payload }) => {
                state.mutateStatus = "succeeded";
                const index = state.items.findIndex((item) => item.id === payload.id);
                if (index !== -1) {
                    state.items[index] = payload;
                }
            })
            .addCase(updateEducationThunk.rejected, (state, { payload }) => {
                state.mutateStatus = "failed";
                state.error = extractErrorMessage(payload, UPDATE_ERROR_FALLBACK);
            });

        // ── Delete ───────────────────────────────────────────────────────────
        builder
            .addCase(deleteEducationThunk.pending, (state) => {
                state.mutateStatus = "pending";
                state.error = null;
            })
            .addCase(deleteEducationThunk.fulfilled, (state, { payload: deletedId }) => {
                state.mutateStatus = "succeeded";
                state.items = state.items.filter((item) => item.id !== deletedId);
            })
            .addCase(deleteEducationThunk.rejected, (state, { payload }) => {
                state.mutateStatus = "failed";
                state.error = extractErrorMessage(payload, DELETE_ERROR_FALLBACK);
            });
    },
});

export const { resetMutateStatus, clearEducation } = educationSlice.actions;
export default educationSlice.reducer;
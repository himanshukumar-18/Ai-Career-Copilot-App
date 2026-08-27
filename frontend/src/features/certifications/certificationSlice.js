// features/resumeCertifications/resumeCertificationsSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
    getCertificationsThunk,
    updateCertificationsThunk,
} from "./certificationThunk.js";

const FETCH_ERROR_FALLBACK = "Unable to load certifications. Please try again.";
const SAVE_ERROR_FALLBACK = "Unable to save certifications. Please try again.";

const extractErrorMessage = (payload, fallback) => {
    if (!payload) return fallback;
    if (typeof payload === "string") return payload;
    return payload.message ?? payload.detail ?? fallback;
};

const initialState = {
    /** Array of certification objects. Empty until fetched. */
    items: [],

    fetchStatus: "idle", // "idle" | "pending" | "succeeded" | "failed"
    saveStatus: "idle",  // "idle" | "pending" | "succeeded" | "failed"

    error: null,
};

const resumeCertificationsSlice = createSlice({
    name: "resumeCertifications",
    initialState,
    reducers: {
        resetSaveStatus(state) {
            state.saveStatus = "idle";
            state.error = null;
        },
        clearCertifications(state) {
            state.items = [];
            state.fetchStatus = "idle";
            state.saveStatus = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCertificationsThunk.pending, (state) => {
                state.fetchStatus = "pending";
                state.error = null;
            })
            .addCase(getCertificationsThunk.fulfilled, (state, { payload }) => {
                state.fetchStatus = "succeeded";
                state.items = payload ?? [];
            })
            .addCase(getCertificationsThunk.rejected, (state, { payload }) => {
                state.fetchStatus = "failed";
                state.error = extractErrorMessage(payload, FETCH_ERROR_FALLBACK);
            });

        builder
            .addCase(updateCertificationsThunk.pending, (state) => {
                state.saveStatus = "pending";
                state.error = null;
            })
            .addCase(updateCertificationsThunk.fulfilled, (state, { payload }) => {
                state.saveStatus = "succeeded";
                state.items = payload ?? [];
            })
            .addCase(updateCertificationsThunk.rejected, (state, { payload }) => {
                state.saveStatus = "failed";
                state.error = extractErrorMessage(payload, SAVE_ERROR_FALLBACK);
            });
    },
});

export const { resetSaveStatus, clearCertifications } = resumeCertificationsSlice.actions;
export default resumeCertificationsSlice.reducer;
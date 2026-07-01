import { createSlice } from "@reduxjs/toolkit";
import { getSummaryThunk, updateSummaryThunk } from "./summaryThunk";

const FETCH_ERROR_FALLBACK = "Unable to load summary. Please try again.";
const SAVE_ERROR_FALLBACK = "Unable to save summary. Please try again.";

const extractErrorMessage = (payload, fallback) => {
    if (!payload) return fallback;
    if (typeof payload === "string") return payload;
    return payload.message ?? payload.detail ?? fallback;
};

const initialState = {
    data: null,
    fetchStatus: "idle",
    saveStatus: "idle",
    error: null,
};

const summarySlice = createSlice({
    name: "summary",
    initialState,
    reducers: {
        resetSaveStatus(state) {
            state.saveStatus = "idle";
            state.error = null;
        },
        clearSummary(state) {
            state.data = null;
            state.fetchStatus = "idle";
            state.saveStatus = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSummaryThunk.pending, (state) => {
                state.fetchStatus = "pending";
                state.error = null;
            })
            .addCase(getSummaryThunk.fulfilled, (state, { payload }) => {
                state.fetchStatus = "succeeded";
                state.data = payload ?? null;
            })
            .addCase(getSummaryThunk.rejected, (state, { payload }) => {
                state.fetchStatus = "failed";
                state.error = extractErrorMessage(payload, FETCH_ERROR_FALLBACK);
            })
            .addCase(updateSummaryThunk.pending, (state) => {
                state.saveStatus = "pending";
                state.error = null;
            })
            .addCase(updateSummaryThunk.fulfilled, (state, { payload }) => {
                state.saveStatus = "succeeded";
                state.data = payload;
            })
            .addCase(updateSummaryThunk.rejected, (state, { payload }) => {
                state.saveStatus = "failed";
                state.error = extractErrorMessage(payload, SAVE_ERROR_FALLBACK);
            });
    },
});

export const { resetSaveStatus, clearSummary } = summarySlice.actions;
export default summarySlice.reducer;

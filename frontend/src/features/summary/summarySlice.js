import { createSlice } from "@reduxjs/toolkit";

import {
    fetchResumeSummaryThunk,
    updateResumeSummaryThunk,
} from "./summaryThunk";

const getPayloadData = (payload) => payload?.data ?? payload;

const getErrorMessage = (payload, fallbackMessage) => {
    if (typeof payload === "string") {
        return payload;
    }

    return (
        payload?.message ||
        payload?.detail ||
        fallbackMessage
    );
};

const initialState = {
    summary: null,
    isLoading: false,
    isSaving: false,
    error: null,
    successMessage: null,
};

const summarySlice = createSlice({
    name: "summary",
    initialState,

    reducers: {
        clearSummaryError: (state) => {
            state.error = null;
        },

        clearSummarySuccess: (state) => {
            state.successMessage = null;
        },

        clearSummary: () => initialState,
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchResumeSummaryThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchResumeSummaryThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.summary = getPayloadData(action.payload);
            })
            .addCase(fetchResumeSummaryThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = getErrorMessage(
                    action.payload,
                    "Unable to load summary."
                );
            })

            .addCase(updateResumeSummaryThunk.pending, (state) => {
                state.isSaving = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateResumeSummaryThunk.fulfilled, (state, action) => {
                state.isSaving = false;
                state.summary = getPayloadData(action.payload);
                state.successMessage = "Professional summary saved.";
            })
            .addCase(updateResumeSummaryThunk.rejected, (state, action) => {
                state.isSaving = false;
                state.error = getErrorMessage(
                    action.payload,
                    "Unable to save summary."
                );
            });
    },
});

export const {
    clearSummary,
    clearSummaryError,
    clearSummarySuccess,
} = summarySlice.actions;

export default summarySlice.reducer;
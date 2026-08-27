import { createSlice } from "@reduxjs/toolkit";
import {
    getLanguagesThunk,
    createLanguageThunk,
    updateLanguageThunk,
    deleteLanguageThunk,
} from "./languageThunk";

const FETCH_ERROR_FALLBACK = "Unable to load languages. Please try again.";
const CREATE_ERROR_FALLBACK = "Unable to add language. Please try again.";
const UPDATE_ERROR_FALLBACK = "Unable to update language. Please try again.";
const DELETE_ERROR_FALLBACK = "Unable to delete language. Please try again.";

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

const languageSlice = createSlice({
    name: "language",
    initialState,
    reducers: {
        resetMutateStatus(state) {
            state.mutateStatus = "idle";
            state.error = null;
        },
        clearLanguages(state) {
            state.items = [];
            state.fetchStatus = "idle";
            state.mutateStatus = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLanguagesThunk.pending, (state) => {
                state.fetchStatus = "pending";
                state.error = null;
            })
            .addCase(getLanguagesThunk.fulfilled, (state, { payload }) => {
                state.fetchStatus = "succeeded";
                state.items = payload ?? [];
            })
            .addCase(getLanguagesThunk.rejected, (state, { payload }) => {
                state.fetchStatus = "failed";
                state.error = extractErrorMessage(payload, FETCH_ERROR_FALLBACK);
            })
            .addCase(createLanguageThunk.pending, (state) => {
                state.mutateStatus = "pending";
                state.error = null;
            })
            .addCase(createLanguageThunk.fulfilled, (state, { payload }) => {
                state.mutateStatus = "succeeded";
                state.items.push(payload);
            })
            .addCase(createLanguageThunk.rejected, (state, { payload }) => {
                state.mutateStatus = "failed";
                state.error = extractErrorMessage(payload, CREATE_ERROR_FALLBACK);
            })
            .addCase(updateLanguageThunk.pending, (state) => {
                state.mutateStatus = "pending";
                state.error = null;
            })
            .addCase(updateLanguageThunk.fulfilled, (state, { payload }) => {
                state.mutateStatus = "succeeded";
                const index = state.items.findIndex((item) => item.id === payload.id);
                if (index !== -1) {
                    state.items[index] = payload;
                }
            })
            .addCase(updateLanguageThunk.rejected, (state, { payload }) => {
                state.mutateStatus = "failed";
                state.error = extractErrorMessage(payload, UPDATE_ERROR_FALLBACK);
            })
            .addCase(deleteLanguageThunk.pending, (state) => {
                state.mutateStatus = "pending";
                state.error = null;
            })
            .addCase(deleteLanguageThunk.fulfilled, (state, { payload: deletedId }) => {
                state.mutateStatus = "succeeded";
                state.items = state.items.filter((item) => item.id !== deletedId);
            })
            .addCase(deleteLanguageThunk.rejected, (state, { payload }) => {
                state.mutateStatus = "failed";
                state.error = extractErrorMessage(payload, DELETE_ERROR_FALLBACK);
            });
    },
});

export const { resetMutateStatus, clearLanguages } = languageSlice.actions;
export default languageSlice.reducer;

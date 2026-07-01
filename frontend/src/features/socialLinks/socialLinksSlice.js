import { createSlice } from "@reduxjs/toolkit";
import { getSocialLinksThunk, updateSocialLinksThunk } from "./socialLinksThunk";

const FETCH_ERROR_FALLBACK = "Unable to load social links. Please try again.";
const SAVE_ERROR_FALLBACK = "Unable to save social links. Please try again.";

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

const socialLinksSlice = createSlice({
    name: "socialLinks",
    initialState,
    reducers: {
        resetSaveStatus(state) {
            state.saveStatus = "idle";
            state.error = null;
        },
        clearSocialLinks(state) {
            state.data = null;
            state.fetchStatus = "idle";
            state.saveStatus = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSocialLinksThunk.pending, (state) => {
                state.fetchStatus = "pending";
                state.error = null;
            })
            .addCase(getSocialLinksThunk.fulfilled, (state, { payload }) => {
                state.fetchStatus = "succeeded";
                state.data = payload ?? null;
            })
            .addCase(getSocialLinksThunk.rejected, (state, { payload }) => {
                state.fetchStatus = "failed";
                state.error = extractErrorMessage(payload, FETCH_ERROR_FALLBACK);
            })
            .addCase(updateSocialLinksThunk.pending, (state) => {
                state.saveStatus = "pending";
                state.error = null;
            })
            .addCase(updateSocialLinksThunk.fulfilled, (state, { payload }) => {
                state.saveStatus = "succeeded";
                state.data = payload;
            })
            .addCase(updateSocialLinksThunk.rejected, (state, { payload }) => {
                state.saveStatus = "failed";
                state.error = extractErrorMessage(payload, SAVE_ERROR_FALLBACK);
            });
    },
});

export const { resetSaveStatus, clearSocialLinks } = socialLinksSlice.actions;
export default socialLinksSlice.reducer;

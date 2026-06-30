import { createSlice } from "@reduxjs/toolkit";
import {
    getResumeProfileThunk,
    updateResumeProfileThunk,
} from "./resumeProfileThunk";

// ─── Constants ────────────────────────────────────────────────────────────────

const SLICE_NAME = "resumeProfile";

const FETCH_ERROR_FALLBACK = "Unable to load resume profile. Please try again.";
const SAVE_ERROR_FALLBACK = "Unable to save changes. Please try again.";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Extracts a human-readable error message from a rejected thunk payload.
 * Supports DRF-style `{ detail }`, generic `{ message }`, and plain strings.
 */
const extractErrorMessage = (payload, fallback) => {
    if (!payload) return fallback;
    if (typeof payload === "string") return payload;
    return payload.message ?? payload.detail ?? fallback;
};

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
    /** Resolved profile data; null until successfully fetched. */
    profile: null,

    /** True while the initial GET is in-flight. */
    fetchStatus: "idle", // "idle" | "pending" | "succeeded" | "failed"

    /** True while a PATCH/PUT save is in-flight. */
    saveStatus: "idle", // "idle" | "pending" | "succeeded" | "failed"

    /** Populated on any error; cleared on the next action. */
    error: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const resumeProfileSlice = createSlice({
    name: SLICE_NAME,
    initialState,

    reducers: {
        /**
         * Call after consuming success / error UI feedback so transient flags
         * don't linger across navigation or re-renders.
         */
        resetSaveStatus(state) {
            state.saveStatus = "idle";
            state.error = null;
        },

        /**
         * Wipes profile from state, e.g. on resume deselect or user sign-out.
         */
        clearResumeProfile(state) {
            state.profile = null;
            state.fetchStatus = "idle";
            state.saveStatus = "idle";
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        // ── GET profile ──────────────────────────────────────────────────────
        builder
            .addCase(getResumeProfileThunk.pending, (state) => {
                state.fetchStatus = "pending";
                state.error = null;
            })
            .addCase(getResumeProfileThunk.fulfilled, (state, { payload }) => {
                state.fetchStatus = "succeeded";
                state.profile = payload;
            })
            .addCase(getResumeProfileThunk.rejected, (state, { payload }) => {
                state.fetchStatus = "failed";
                state.error = extractErrorMessage(payload, FETCH_ERROR_FALLBACK);
            });

        // ── UPDATE profile ───────────────────────────────────────────────────
        builder
            .addCase(updateResumeProfileThunk.pending, (state) => {
                state.saveStatus = "pending";
                state.error = null;
            })
            .addCase(updateResumeProfileThunk.fulfilled, (state, { payload }) => {
                state.saveStatus = "succeeded";
                state.profile = payload;
            })
            .addCase(updateResumeProfileThunk.rejected, (state, { payload }) => {
                state.saveStatus = "failed";
                state.error = extractErrorMessage(payload, SAVE_ERROR_FALLBACK);
            });
    },
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const { resetSaveStatus, clearResumeProfile } = resumeProfileSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

const selectResumeProfileSlice = (state) => state[SLICE_NAME];

export const selectResumeProfile = (state) => selectResumeProfileSlice(state).profile;
export const selectProfileError = (state) => selectResumeProfileSlice(state).error;

// Fetch-phase derived booleans
export const selectIsProfileLoading = (state) => selectResumeProfileSlice(state).fetchStatus === "pending";
export const selectIsProfileLoaded = (state) => selectResumeProfileSlice(state).fetchStatus === "succeeded";
export const selectHasProfileError = (state) => selectResumeProfileSlice(state).fetchStatus === "failed";

// Save-phase derived booleans
export const selectIsSaving = (state) => selectResumeProfileSlice(state).saveStatus === "pending";
export const selectSaveSucceeded = (state) => selectResumeProfileSlice(state).saveStatus === "succeeded";
export const selectSaveFailed = (state) => selectResumeProfileSlice(state).saveStatus === "failed";

// ─── Reducer ──────────────────────────────────────────────────────────────────

export default resumeProfileSlice.reducer;
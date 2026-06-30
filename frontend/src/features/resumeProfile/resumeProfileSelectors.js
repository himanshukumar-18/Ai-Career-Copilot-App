// features/resumeProfile/resumeProfileSelectors.js

import { createSelector } from "@reduxjs/toolkit";

// ─── Base Slice Selector ──────────────────────────────────────────────────────

const selectResumeProfileState = (state) => state.resumeProfile;

// ─── Raw Data ─────────────────────────────────────────────────────────────────

/** The resolved profile object, or null if not yet fetched. */
export const selectResumeProfile = (state) =>
    selectResumeProfileState(state).profile;

/** The current error message string, or null. */
export const selectProfileError = (state) =>
    selectResumeProfileState(state).error;

// ─── Fetch Status ─────────────────────────────────────────────────────────────

/** Raw fetch lifecycle status. Prefer the derived booleans below in components. */
export const selectFetchStatus = (state) =>
    selectResumeProfileState(state).fetchStatus;

export const selectIsProfileLoading = (state) =>
    selectResumeProfileState(state).fetchStatus === "pending";

export const selectIsProfileLoaded = (state) =>
    selectResumeProfileState(state).fetchStatus === "succeeded";

export const selectHasProfileFetchError = (state) =>
    selectResumeProfileState(state).fetchStatus === "failed";

// ─── Save Status ──────────────────────────────────────────────────────────────

/** Raw save lifecycle status. Prefer the derived booleans below in components. */
export const selectSaveStatus = (state) =>
    selectResumeProfileState(state).saveStatus;

export const selectIsSaving = (state) =>
    selectResumeProfileState(state).saveStatus === "pending";

export const selectSaveSucceeded = (state) =>
    selectResumeProfileState(state).saveStatus === "succeeded";

export const selectSaveFailed = (state) =>
    selectResumeProfileState(state).saveStatus === "failed";

// ─── Compound / Derived (memoized) ───────────────────────────────────────────

/**
 * True when the profile is ready to render — fetched and non-null.
 * Memoized because it combines two fields.
 */
export const selectIsProfileReady = createSelector(
    selectFetchStatus,
    selectResumeProfile,
    (fetchStatus, profile) => fetchStatus === "succeeded" && profile !== null
);

/**
 * True when any async operation (fetch or save) is in-flight.
 * Useful for disabling form controls globally.
 */
export const selectIsProfileBusy = createSelector(
    selectFetchStatus,
    selectSaveStatus,
    (fetchStatus, saveStatus) =>
        fetchStatus === "pending" || saveStatus === "pending"
);
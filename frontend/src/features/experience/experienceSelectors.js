import { createSelector } from "@reduxjs/toolkit";

/** All experience items */
export const selectExperiences = (state) =>
    Array.isArray(state.experience.items) ? state.experience.items : [];

/** List-level fetch status */
export const selectExperienceStatus = (state) => state.experience.status;

/** List-level fetch error */
export const selectExperienceError = (state) => state.experience.error;

/** Status of adding a new experience — separate from the list fetch status */
export const selectAddExperienceStatus = (state) => state.experience.addStatus;

/** Error from adding a new experience */
export const selectAddExperienceError = (state) => state.experience.addError;

/** Status for a single row (edit/delete), by id */
export const selectRowStatus = (state, id) =>
    state.experience.rowStatus[id] ?? "idle";

/** Error for a single row, by id */
export const selectRowError = (state, id) =>
    state.experience.rowError[id] ?? null;

/** Derived: experiences sorted by start date, most recent first */
export const selectExperiencesSortedByDate = createSelector(
    [selectExperiences],
    (items) =>
        [...items].sort(
            (a, b) => new Date(b.start_date) - new Date(a.start_date)
        )
);
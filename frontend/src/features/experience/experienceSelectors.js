import { createSelector } from "@reduxjs/toolkit";

/** All experience items */
export const selectExperiences = (state) => state.experience.items;

/** List-level fetch/add status */
export const selectExperienceStatus = (state) => state.experience.status;

/** List-level error */
export const selectExperienceError = (state) => state.experience.error;

/** Status for a single row (edit/delete), by id */
export const selectRowStatus = (state, id) => state.experience.rowStatus[id] ?? "idle";

/** Error for a single row, by id */
export const selectRowError = (state, id) => state.experience.rowError[id] ?? null;

/** Derived: experiences sorted by start date, most recent first */
export const selectExperiencesSortedByDate = createSelector(
    [selectExperiences],
    (items) =>
        [...items].sort(
            (a, b) => new Date(b.start_date) - new Date(a.start_date)
        )
);
// features/education/educationSelectors.js

import { createSelector } from "@reduxjs/toolkit";

const selectEducationState = (state) => state.education;

export const selectEducationList = (state) => selectEducationState(state).items;
export const selectEducationError = (state) => selectEducationState(state).error;

export const selectIsEducationLoading = (state) =>
    selectEducationState(state).fetchStatus === "pending";

export const selectIsEducationLoaded = (state) =>
    selectEducationState(state).fetchStatus === "succeeded";

export const selectIsEducationMutating = (state) =>
    selectEducationState(state).mutateStatus === "pending";

export const selectEducationMutateSucceeded = (state) =>
    selectEducationState(state).mutateStatus === "succeeded";

export const selectEducationMutateFailed = (state) =>
    selectEducationState(state).mutateStatus === "failed";

/** Memoized — sorts entries by most recent start_date first for display. */
export const selectEducationSortedByDate = createSelector(
    selectEducationList,
    (items) =>
        [...items].sort(
            (a, b) => new Date(b.start_date) - new Date(a.start_date)
        )
);
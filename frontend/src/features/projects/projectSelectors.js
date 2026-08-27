import { createSelector } from "@reduxjs/toolkit";

const selectProjectState = (state) => state.projects;

export const selectProjectList = (state) => selectProjectState(state).items;
export const selectProjectError = (state) => selectProjectState(state).error;

export const selectIsProjectsLoading = (state) => selectProjectState(state).fetchStatus === "pending";
export const selectIsProjectsLoaded = (state) => selectProjectState(state).fetchStatus === "succeeded";
export const selectIsProjectsMutating = (state) => selectProjectState(state).mutateStatus === "pending";
export const selectProjectsMutateSucceeded = (state) => selectProjectState(state).mutateStatus === "succeeded";
export const selectProjectsMutateFailed = (state) => selectProjectState(state).mutateStatus === "failed";

export const selectProjectsSortedByStartDate = createSelector(
    selectProjectList,
    (items) => [...items].sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
);

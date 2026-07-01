import { createSelector } from "@reduxjs/toolkit";

const selectLanguageState = (state) => state.language;

export const selectLanguageList = (state) => selectLanguageState(state).items;
export const selectLanguageError = (state) => selectLanguageState(state).error;

export const selectIsLanguageLoading = (state) =>
    selectLanguageState(state).fetchStatus === "pending";

export const selectIsLanguageLoaded = (state) =>
    selectLanguageState(state).fetchStatus === "succeeded";

export const selectIsLanguageMutating = (state) =>
    selectLanguageState(state).mutateStatus === "pending";

export const selectLanguageMutateSucceeded = (state) =>
    selectLanguageState(state).mutateStatus === "succeeded";

export const selectLanguageMutateFailed = (state) =>
    selectLanguageState(state).mutateStatus === "failed";

export const selectLanguagesSortedByName = createSelector(
    selectLanguageList,
    (items) => [...items].sort((a, b) => a.name.localeCompare(b.name))
);

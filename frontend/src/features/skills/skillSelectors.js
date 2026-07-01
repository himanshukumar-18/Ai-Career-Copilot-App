import { createSelector } from "@reduxjs/toolkit";

const selectSkillState = (state) => state.skills;

export const selectSkillList = (state) => selectSkillState(state).items;
export const selectSkillError = (state) => selectSkillState(state).error;

export const selectIsSkillsLoading = (state) => selectSkillState(state).fetchStatus === "pending";
export const selectIsSkillsLoaded = (state) => selectSkillState(state).fetchStatus === "succeeded";
export const selectIsSkillsMutating = (state) => selectSkillState(state).mutateStatus === "pending";
export const selectSkillsMutateSucceeded = (state) => selectSkillState(state).mutateStatus === "succeeded";
export const selectSkillsMutateFailed = (state) => selectSkillState(state).mutateStatus === "failed";

export const selectSkillsSortedAlpha = createSelector(
    selectSkillList,
    (items) => [...items].sort((a, b) => a.name.localeCompare(b.name))
);

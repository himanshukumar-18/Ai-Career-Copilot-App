import { createSelector } from "@reduxjs/toolkit";

export const selectProjectLabState = (state) => state.projectLab;

export const selectMyProjects = createSelector(
    [selectProjectLabState],
    (state) => state?.myProjects || []
);

export const selectGeneratedProjects = createSelector(
    [selectProjectLabState],
    (state) => state?.generatedProjects || []
);

export const selectSelectedProject = createSelector(
    [selectProjectLabState],
    (state) => state?.selectedProject || null
);

export const selectProjectLabPagination = createSelector(
    [selectProjectLabState],
    (state) => state?.pagination || null
);

export const selectProjectLabFilters = createSelector(
    [selectProjectLabState],
    (state) => state?.filters || {}
);

export const selectProjectLabStatuses = createSelector(
    [selectProjectLabState],
    (state) => ({
        listStatus: state?.listStatus || "idle",
        generateStatus: state?.generateStatus || "idle",
        detailStatus: state?.detailStatus || "idle",
        saveStatus: state?.saveStatus || "idle",
        updateStatus: state?.updateStatus || "idle",
        deleteStatus: state?.deleteStatus || "idle",
    })
);

export const selectProjectLabErrors = createSelector(
    [selectProjectLabState],
    (state) => ({
        error: state?.error || null,
        generateError: state?.generateError || null,
        saveError: state?.saveError || null,
        updateError: state?.updateError || null,
        deleteError: state?.deleteError || null,
    })
);

// Memoized statistics calculation from user projects
export const selectProjectStats = createSelector(
    [selectMyProjects],
    (projects) => {
        const total = projects.length;
        const notStarted = projects.filter((p) => p.status === "not_started").length;
        const inProgress = projects.filter((p) => p.status === "in_progress").length;
        const completed = projects.filter((p) => p.status === "completed").length;

        const totalHours = projects.reduce((acc, p) => acc + (p.estimated_hours || 0), 0);
        const completedHours = projects
            .filter((p) => p.status === "completed")
            .reduce((acc, p) => acc + (p.estimated_hours || 0), 0);

        const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            total,
            notStarted,
            inProgress,
            completed,
            totalHours,
            completedHours,
            completionPercentage,
        };
    }
);

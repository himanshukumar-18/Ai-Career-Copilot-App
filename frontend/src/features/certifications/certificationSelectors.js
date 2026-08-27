// features/resumeCertifications/resumeCertificationsSelectors.js

import { createSelector } from "@reduxjs/toolkit";

const selectCertificationsState = (state) => state.resumeCertifications;

export const selectCertifications = (state) =>
    selectCertificationsState(state).items;

export const selectCertificationsError = (state) =>
    selectCertificationsState(state).error;

export const selectIsCertificationsLoading = (state) =>
    selectCertificationsState(state).fetchStatus === "pending";

export const selectIsCertificationsLoaded = (state) =>
    selectCertificationsState(state).fetchStatus === "succeeded";

export const selectIsCertificationsSaving = (state) =>
    selectCertificationsState(state).saveStatus === "pending";

export const selectCertificationsSaveSucceeded = (state) =>
    selectCertificationsState(state).saveStatus === "succeeded";

export const selectCertificationsSaveFailed = (state) =>
    selectCertificationsState(state).saveStatus === "failed";

/** Count of certifications — memoized since it derives from the array. */
export const selectCertificationsCount = createSelector(
    selectCertifications,
    (items) => items.length
);
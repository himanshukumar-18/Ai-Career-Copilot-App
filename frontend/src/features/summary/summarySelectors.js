export const selectSummaryState = (state) => state.summary;

export const selectResumeSummary = (state) =>
    state.summary.summary;

export const selectResumeSummaryLoading = (state) =>
    state.summary.isLoading;

export const selectResumeSummarySaving = (state) =>
    state.summary.isSaving;

export const selectResumeSummaryError = (state) =>
    state.summary.error;

export const selectResumeSummarySuccessMessage = (state) =>
    state.summary.successMessage;
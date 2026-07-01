const selectSummaryState = (state) => state.summary;

export const selectSummary = (state) => selectSummaryState(state).data;
export const selectSummaryError = (state) => selectSummaryState(state).error;

export const selectIsSummaryLoading = (state) => selectSummaryState(state).fetchStatus === "pending";
export const selectIsSummarySaving = (state) => selectSummaryState(state).saveStatus === "pending";
export const selectSummarySaveSucceeded = (state) => selectSummaryState(state).saveStatus === "succeeded";
export const selectSummarySaveFailed = (state) => selectSummaryState(state).saveStatus === "failed";

const selectSocialLinksState = (state) => state.socialLinks;

export const selectSocialLinks = (state) => selectSocialLinksState(state).data;
export const selectSocialLinksError = (state) => selectSocialLinksState(state).error;

export const selectIsSocialLinksLoading = (state) => selectSocialLinksState(state).fetchStatus === "pending";
export const selectIsSocialLinksSaving = (state) => selectSocialLinksState(state).saveStatus === "pending";
export const selectSocialLinksSaveSucceeded = (state) => selectSocialLinksState(state).saveStatus === "succeeded";
export const selectSocialLinksSaveFailed = (state) => selectSocialLinksState(state).saveStatus === "failed";

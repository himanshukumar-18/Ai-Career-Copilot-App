export const selectResumeProfileState = (state) => state.resumeProfile;

export const selectResumeProfile = (state) =>
    state.resumeProfile.profile;

export const selectResumeProfileLoading = (state) =>
    state.resumeProfile.isLoading;

export const selectResumeProfileSaving = (state) =>
    state.resumeProfile.isSaving;

export const selectResumeProfilePhotoUploading = (state) =>
    state.resumeProfile.isUploadingPhoto;

export const selectResumeProfileError = (state) =>
    state.resumeProfile.error;

export const selectResumeProfileSuccessMessage = (state) =>
    state.resumeProfile.successMessage;
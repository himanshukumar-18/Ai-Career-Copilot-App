import { createSlice } from "@reduxjs/toolkit";

import {
    createResumeProfileThunk,
    fetchResumeProfileThunk,
    updateResumeProfileThunk,
    uploadResumePhotoThunk,
} from "./resumeProfileThunk";

const getPayloadData = (payload) => payload?.data ?? payload;

const getErrorMessage = (payload) =>
    payload?.message ||
    payload?.detail ||
    "Unable to complete this action.";

const initialState = {
    profile: null,
    isLoading: false,
    isSaving: false,
    isUploadingPhoto: false,
    error: null,
    successMessage: null,
};

const resumeProfileSlice = createSlice({
    name: "resumeProfile",
    initialState,

    reducers: {
        clearResumeProfileError: (state) => {
            state.error = null;
        },

        clearResumeProfileSuccess: (state) => {
            state.successMessage = null;
        },

        clearResumeProfile: (state) => {
            state.profile = null;
            state.error = null;
            state.successMessage = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchResumeProfileThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchResumeProfileThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = getPayloadData(action.payload);
            })
            .addCase(fetchResumeProfileThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = getErrorMessage(
                    action.payload,
                    "Failed to fetch resume profile."
                );
            })

            .addCase(createResumeProfileThunk.pending, (state) => {
                state.isSaving = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(createResumeProfileThunk.fulfilled, (state, action) => {
                state.isSaving = false;
                state.profile = getPayloadData(action.payload);
                state.successMessage = "Personal information saved.";
            })
            .addCase(createResumeProfileThunk.rejected, (state, action) => {
                state.isSaving = false;
                state.error = getErrorMessage(
                    action.payload,
                    "Failed to create resume profile."
                );
            })

            .addCase(updateResumeProfileThunk.pending, (state) => {
                state.isSaving = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateResumeProfileThunk.fulfilled, (state, action) => {
                state.isSaving = false;
                state.profile = getPayloadData(action.payload);
                state.successMessage = "Personal information updated.";
            })
            .addCase(updateResumeProfileThunk.rejected, (state, action) => {
                state.isSaving = false;
                state.error = getErrorMessage(
                    action.payload,
                    "Failed to update resume profile."
                );
            })

            .addCase(uploadResumePhotoThunk.pending, (state) => {
                state.isUploadingPhoto = true;
                state.error = null;
            })
            .addCase(uploadResumePhotoThunk.fulfilled, (state, action) => {
                state.isUploadingPhoto = false;
                state.profile = getPayloadData(action.payload);
                state.successMessage = "Profile photo uploaded.";
            })
            .addCase(uploadResumePhotoThunk.rejected, (state, action) => {
                state.isUploadingPhoto = false;
                state.error = getErrorMessage(
                    action.payload,
                    "Failed to upload profile photo."
                );
            });
    },
});

export const {
    clearResumeProfileError,
    clearResumeProfileSuccess,
    clearResumeProfile,
} = resumeProfileSlice.actions;

export default resumeProfileSlice.reducer;
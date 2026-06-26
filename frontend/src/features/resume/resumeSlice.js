import { createSlice } from "@reduxjs/toolkit";

import {
    fetchResumes,
    fetchResumeById,
    createResume,
    updateResume,
    deleteResume,
    duplicateResume,
    publishResume,
    unpublishResume,
    setDefaultResume
} from "./resumeThunk.js"

const initialState = {
    resume: [],
    selectedResume: null,

    loading: false,
    error: null,

    pagination: {
        count: 0,
        next: null,
        previous: null,
    },
};

const resumeSlice = createSlice({
    name: "resume",

    initialState,

    reducers: {
        clearResumeError: (state) => {
            state.error = null;
        },

        clearSelectedResume: (state) => {
            state.selectedResume = null;
        },
    },

    extraReducers: (builder) => {
        builder


            // fetch resume
            .addCase(fetchResumes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchResumes.fulfilled, (state, action) => {
                state.loading = false;

                state.resumes = action.payload.data?.results || [];
                state.pagination = {
                    count: action.payload.data?.count || 0,
                    next: action.payload.data?.next || null,
                    previous: action.payload.data?.previous || null,
                };
            })

            .addCase(fetchResumes.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload?.message || "Failed to fetch resumes.";
            })


            // fetch resume
            .addCase(fetchResumeById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchResumeById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedResume = action.payload.data;
            })

            .addCase(fetchResumeById.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload?.message || "Failed to fetch resume.";
            })

            // create resume 
            .addCase(createResume.pending, (state) => {
                state.loading = true;
            })

            .addCase(createResume.fulfilled, (state, action) => {
                state.loading = false;

                state.resumes.unshift(action.payload.data);
            })

            .addCase(createResume.rejected, (state, action) => {
                state.loading = false;

                state.error =
                    action.payload?.message || "Failed to create resume.";
            })


            // update resume
            .addCase(updateResume.fulfilled, (state, action) => {
                state.loading = false;

                state.resumes = state.resumes.map((resume) =>
                    resume.id === action.payload.data.id
                        ? action.payload.data
                        : resume
                );

                state.selectedResume = action.payload.data;
            })

            .addCase(updateResume.rejected, (state, action) => {
                state.loading = false;

                state.error =
                    action.payload?.message || "Failed to update resume.";
            })


            // delete resume
            .addCase(deleteResume.fulfilled, (state, action) => {
                state.loading = false;

                state.resumes = state.resumes.filter(
                    (resume) => resume.id !== action.payload
                );
            })

            .addCase(deleteResume.rejected, (state, action) => {
                state.loading = false;

                state.error =
                    action.payload?.message || "Failed to delete resume.";
            })

            // Duplicate Resume
            .addCase(duplicateResume.fulfilled, (state, action) => {
                state.loading = false;

                state.resumes.unshift(action.payload.data);
            })

            // Publish Resume
            .addCase(publishResume.fulfilled, (state, action) => {
                state.loading = false;

                state.resumes = state.resumes.map((resume) =>
                    resume.id === action.payload.data.id
                        ? action.payload.data
                        : resume
                );
            })

            // Unpublish Resume
            .addCase(unpublishResume.fulfilled, (state, action) => {
                state.loading = false;

                state.resumes = state.resumes.map((resume) =>
                    resume.id === action.payload.data.id
                        ? action.payload.data
                        : resume
                );
            })

            // Set Default Resume
            .addCase(setDefaultResume.fulfilled, (state, action) => {
                state.loading = false;

                state.resumes = state.resumes.map((resume) => ({
                    ...resume,
                    is_default: resume.id === action.payload.data.id,
                }));
            });
    },
});

export const {
    clearResumeError,
    clearSelectedResume,
} = resumeSlice.actions;

export default resumeSlice.reducer;
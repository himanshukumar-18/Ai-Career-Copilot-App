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
    resumes: [],
    selectedResume: null,

    loading: false,
    error: null,

    pagination: {
        count: 0,
        next: null,
        previous: null,
    },
    publish: {
        status: "idle",
        error: null,
        publicUrl: null,
        publishedAt: null,
        hasUnpublishedChanges: false,
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

        updateResumeSummaryInState: (state, action) => {
            const { resumeId, content } = action.payload;
            const updateSummary = (resume) =>
                String(resume?.id) === String(resumeId)
                    ? {
                        ...resume,
                        summary: {
                            ...(typeof resume.summary === "object" ? resume.summary : {}),
                            content,
                        },
                    }
                    : resume;

            state.selectedResume = updateSummary(state.selectedResume);
            state.resumes = state.resumes.map(updateSummary);
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
                state.selectedResume = {
                    ...state.selectedResume,
                    ...action.payload.data,
                };
            })

            .addCase(fetchResumeById.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload?.message || "Failed to fetch resume.";
            })

            // create resume 
            .addCase(createResume.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createResume.fulfilled, (state, action) => {
                state.loading = false;
                const newResume = action.payload?.data;
                if (newResume) {
                    state.resumes = [newResume, ...state.resumes.filter((r) => String(r.id) !== String(newResume.id))];
                    state.selectedResume = newResume;
                }
            })

            .addCase(createResume.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload?.message || "Failed to create resume.";
            })

            // update resume
            .addCase(updateResume.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(updateResume.fulfilled, (state, action) => {
                state.loading = false;
                const updatedData = action.payload?.data;
                if (updatedData) {
                    state.resumes = state.resumes.map((resume) =>
                        String(resume.id) === String(updatedData.id)
                            ? updatedData
                            : resume
                    );
                    state.selectedResume = updatedData;
                }
            })

            .addCase(updateResume.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload?.message || "Failed to update resume.";
            })

            // delete resume
            .addCase(deleteResume.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(deleteResume.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = String(action.payload);
                state.resumes = state.resumes.filter(
                    (resume) => String(resume.id) !== deletedId
                );
                if (state.selectedResume && String(state.selectedResume.id) === deletedId) {
                    state.selectedResume = null;
                }
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
            .addCase(publishResume.pending, (state) => {
                state.publish.status = "pending";
                state.publish.error = null;
            })
            .addCase(publishResume.fulfilled, (state, action) => {
                state.loading = false;
                state.publish.status = "succeeded";
                state.publish.publicUrl = action.payload.data.public_url;
                state.publish.publishedAt = action.payload.data.published_at;
                state.publish.hasUnpublishedChanges = false;

                state.resumes = state.resumes.map((resume) =>
                    resume.id === action.payload.data.resume.id
                        ? action.payload.data.resume
                        : resume
                );

                state.selectedResume = action.payload.data.resume;
            })
            .addCase(publishResume.rejected, (state, action) => {
                state.publish.status = "failed";
                state.publish.error = action.payload?.message || "Unable to publish resume.";
            })

            // Unpublish Resume
            .addCase(unpublishResume.pending, (state) => {
                state.publish.status = "pending";
                state.publish.error = null;
            })
            .addCase(unpublishResume.fulfilled, (state, action) => {
                state.loading = false;
                state.publish.status = "idle";
                state.publish.publicUrl = null;
                state.publish.publishedAt = null;
                state.publish.hasUnpublishedChanges = false;

                state.resumes = state.resumes.map((resume) =>
                    resume.id === action.payload.data.resume.id
                        ? action.payload.data.resume
                        : resume
                );

                state.selectedResume = action.payload.data.resume;
            })
            .addCase(unpublishResume.rejected, (state, action) => {
                state.publish.status = "failed";
                state.publish.error = action.payload?.message || "Unable to unpublish resume.";
            })

            // Set Default Resume
            .addCase(setDefaultResume.fulfilled, (state, action) => {
                state.loading = false;

                state.resumes = state.resumes.map((resume) => ({
                    ...resume,
                    is_default: resume.id === action.payload.data.id,
                }));
            })
            .addMatcher(
                (action) =>
                    /^(resumeProfile|summary|experience|education|skills|projects|certifications|language|socialLinks)\//.test(action.type) &&
                    /\/(create|update|add|edit|remove|delete)/.test(action.type) &&
                    action.type.endsWith("/fulfilled"),
                (state) => {
                    if (state.selectedResume?.is_public) {
                        state.publish.hasUnpublishedChanges = true;
                    }
                }
            );
    },
});

export const {
    clearResumeError,
    clearSelectedResume,
    updateResumeSummaryInState,
} = resumeSlice.actions;

export default resumeSlice.reducer;

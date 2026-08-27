import { createSlice } from "@reduxjs/toolkit";

import {
    analyzeResumeThunk,
    improveResumeSectionThunk,
    matchResumeJobThunk,
} from "./resumeAIThunk";

const ANALYZE_ERROR =
    "Unable to analyze your resume. Please try again.";

const IMPROVE_ERROR =
    "Unable to improve this section. Please try again.";

const JOB_MATCH_ERROR =
    "Unable to match your resume with the job description.";

const getErrorMessage = (payload, fallback) => {
    if (!payload) return fallback;

    if (typeof payload === "string") {
        return payload;
    }

    return (
        payload.message ??
        payload.detail ??
        fallback
    );
};

const initialState = {
    analysis: null,

    analyzedResumeId: null,

    improvedSection: null,

    jobMatch: null,

    analyzeStatus: "idle",

    improveStatus: "idle",

    jobMatchStatus: "idle",

    error: null,

    lastUpdated: null,
};

const resumeAISlice = createSlice({
    name: "resumeAI",

    initialState,

    reducers: {
        clearResumeAI(state) {
            Object.assign(state, initialState);
        },

        clearResumeAIError(state) {
            state.error = null;
        },

        clearImprovedSection(state, action) {
            const section = action.payload;

            if (section && state.analysis?.[section]) {
                delete state.analysis[section].improved_content;
            }

            state.improvedSection = null;
        },

        resetResumeAIStatus(state) {
            state.analyzeStatus = "idle";
            state.improveStatus = "idle";
            state.jobMatchStatus = "idle";
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        /**
         * ---------------------------------------
         * Resume Analysis
         * ---------------------------------------
         */
        builder
            .addCase(analyzeResumeThunk.pending, (state) => {
                state.analyzeStatus = "pending";
                state.error = null;
            })

            .addCase(analyzeResumeThunk.fulfilled, (state, action) => {
                state.analyzeStatus = "succeeded";

                state.analysis = action.payload;

                state.analyzedResumeId = action.meta.arg.resumeId;

                state.lastUpdated = new Date().toISOString();
            })

            .addCase(analyzeResumeThunk.rejected, (state, action) => {
                state.analyzeStatus = "failed";

                state.error = getErrorMessage(
                    action.payload,
                    ANALYZE_ERROR
                );
            });

        /**
         * ---------------------------------------
         * Improve Section
         * ---------------------------------------
         */
        builder
            .addCase(improveResumeSectionThunk.pending, (state) => {
                state.improveStatus = "pending";
                state.error = null;
            })

            .addCase(
                improveResumeSectionThunk.fulfilled,
                (state, action) => {
                    state.improveStatus = "succeeded";

                    state.improvedSection = action.payload;

                    const section = action.payload?.section;
                    const improvedContent = action.payload?.content;

                    if (section && improvedContent && state.analysis?.[section]) {
                        state.analysis[section].improved_content = improvedContent;
                    }

                    state.lastUpdated = new Date().toISOString();
                }
            )

            .addCase(
                improveResumeSectionThunk.rejected,
                (state, action) => {
                    state.improveStatus = "failed";

                    state.error = getErrorMessage(
                        action.payload,
                        IMPROVE_ERROR
                    );
                }
            );

        /**
         * ---------------------------------------
         * Job Match
         * ---------------------------------------
         */
        builder
            .addCase(matchResumeJobThunk.pending, (state) => {
                state.jobMatchStatus = "pending";
                state.error = null;
            })

            .addCase(matchResumeJobThunk.fulfilled, (state, action) => {
                state.jobMatchStatus = "succeeded";

                state.jobMatch = action.payload;

                state.lastUpdated = new Date().toISOString();
            })

            .addCase(matchResumeJobThunk.rejected, (state, action) => {
                state.jobMatchStatus = "failed";

                state.error = getErrorMessage(
                    action.payload,
                    JOB_MATCH_ERROR
                );
            });
    },
});

export const {
    clearResumeAI,
    clearResumeAIError,
    clearImprovedSection,
    resetResumeAIStatus,
} = resumeAISlice.actions;

export default resumeAISlice.reducer;

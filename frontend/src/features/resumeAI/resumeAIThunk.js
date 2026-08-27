import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    analyzeResume,
    improveResumeSection,
    matchResumeToJob,
} from "../../api/resumeAI";

/**
 * Normalize API errors into a string/object that Redux can store.
 */
const normalizeError = (error) => {
    if (!error) {
        return {
            message: "Something went wrong.",
        };
    }

    if (typeof error === "string") {
        return {
            message: error,
        };
    }

    return error;
};

/**
 * -------------------------------------------------------
 * Analyze Resume
 * POST /resume-ai/analyze/
 * -------------------------------------------------------
 */
export const analyzeResumeThunk = createAsyncThunk(
    "resumeAI/analyze",
    async ({ resumeId }, { rejectWithValue }) => {
        try {
            return await analyzeResume(resumeId);
        } catch (error) {
            return rejectWithValue(normalizeError(error));
        }
    },
    {
        condition: ({ resumeId, force = false }, { getState }) => {
            if (force) return true;

            const state = getState().resumeAI;
            return !(
                state.analyzedResumeId === resumeId &&
                ["pending", "succeeded"].includes(state.analyzeStatus)
            );
        },
    }
);

/**
 * -------------------------------------------------------
 * Improve Resume Section
 * POST /resume-ai/improve/
 * payload:
 * {
 *   resume_id,
 *   section,
 *   content
 * }
 * -------------------------------------------------------
 */
export const improveResumeSectionThunk = createAsyncThunk(
    "resumeAI/improveSection",
    async (payload, { rejectWithValue }) => {
        try {
            return await improveResumeSection(payload);
        } catch (error) {
            return rejectWithValue(normalizeError(error));
        }
    }
);

/**
 * -------------------------------------------------------
 * Job Match Analysis
 * POST /resume-ai/job-match/
 * payload:
 * {
 *   resume_id,
 *   job_description
 * }
 * -------------------------------------------------------
 */
export const matchResumeJobThunk = createAsyncThunk(
    "resumeAI/jobMatch",
    async (payload, { rejectWithValue }) => {
        try {
            return await matchResumeToJob(payload);
        } catch (error) {
            return rejectWithValue(normalizeError(error));
        }
    }
);

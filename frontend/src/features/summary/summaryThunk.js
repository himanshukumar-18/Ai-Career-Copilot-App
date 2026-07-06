import { createAsyncThunk } from "@reduxjs/toolkit";

import summaryService from "./summaryService";

const getErrorPayload = (error, fallbackMessage) => {
    if (typeof error === "string") {
        return { message: error };
    }

    if (error && typeof error === "object") {
        return {
            ...error,
            message:
                error.message ||
                error.detail ||
                fallbackMessage,
        };
    }

    return { message: fallbackMessage };
};

export const fetchResumeSummaryThunk = createAsyncThunk(
    "summary/fetchResumeSummary",
    async (resumeId, { rejectWithValue }) => {
        try {
            return await summaryService.getSummary(resumeId);
        } catch (error) {
            return rejectWithValue(
                getErrorPayload(error, "Unable to load summary.")
            );
        }
    }
);

export const updateResumeSummaryThunk = createAsyncThunk(
    "summary/updateResumeSummary",
    async ({ resumeId, content }, { rejectWithValue }) => {

        console.log("summary: ", content)

        try {
            return await summaryService.updateSummary({
                resumeId,
                content,
            });
        } catch (error) {
            return rejectWithValue(
                getErrorPayload(error, "Unable to save summary.")
            );
        }
    }
);
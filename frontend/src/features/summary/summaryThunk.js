import { createAsyncThunk } from "@reduxjs/toolkit";
import { getSummary, updateSummary } from "./summaryService";

export const getSummaryThunk = createAsyncThunk(
    "summary/get",
    async (_, { rejectWithValue }) => {
        try {
            return await getSummary();
        } catch (error) {
            return rejectWithValue(error.response?.data ?? { message: error.message });
        }
    }
);

export const updateSummaryThunk = createAsyncThunk(
    "summary/update",
    async ({ id, summaryData }, { rejectWithValue }) => {
        try {
            return await updateSummary(id, summaryData);
        } catch (error) {
            return rejectWithValue(error.response?.data ?? { message: error.message });
        }
    }
);

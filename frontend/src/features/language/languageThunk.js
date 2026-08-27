import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getLanguages,
    createLanguage,
    updateLanguage,
    deleteLanguage,
} from "./languageService";

export const getLanguagesThunk = createAsyncThunk(
    "language/getAll",
    async (resumeId, { rejectWithValue }) => {
        try {
            return await getLanguages(resumeId);
        } catch (error) {
            return rejectWithValue(
                error.response?.data ?? { message: error.message }
            );
        }
    }
);

export const createLanguageThunk = createAsyncThunk(
    "language/create",
    async ({ resumeId, languageData }, { rejectWithValue }) => {
        try {
            return await createLanguage(resumeId, languageData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data ?? { message: error.message }
            );
        }
    }
);

export const updateLanguageThunk = createAsyncThunk(
    "language/update",
    async ({ id, languageData }, { rejectWithValue }) => {
        try {
            return await updateLanguage(id, languageData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data ?? { message: error.message }
            );
        }
    }
);

export const deleteLanguageThunk = createAsyncThunk(
    "language/delete",
    async (id, { rejectWithValue }) => {
        try {
            return await deleteLanguage(id);
        } catch (error) {
            return rejectWithValue(
                error.response?.data ?? { message: error.message }
            );
        }
    }
);

import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getResumeProfile,
    updateResumeProfile,
} from "./resumeProfileService";


// GET Resume Profile
export const getResumeProfileThunk =
    createAsyncThunk(
        "resumeProfile/get",

        async (resumeId, thunkAPI) => {
            try {
                return await getResumeProfile(
                    resumeId
                );
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data ??
                    error.message
                );
            }
        }
    );


// PATCH Resume Profile
export const updateResumeProfileThunk =
    createAsyncThunk(
        "resumeProfile/update",

        async (
            { resumeId, profileData },
            thunkAPI
        ) => {
            try {
                return await updateResumeProfile(
                    resumeId,
                    profileData
                );
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data ??
                    error.message
                );
            }
        }
    );
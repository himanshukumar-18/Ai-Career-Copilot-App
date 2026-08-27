import {
    createAsyncThunk,
} from "@reduxjs/toolkit";

import {
    getProfile,
    updateProfile,
} from "./profileService";

export const getProfileThunk =
    createAsyncThunk(
        "profile/get",

        async (_, thunkAPI) => {
            try {
                return await getProfile();
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data
                );
            }
        }
    );

export const updateProfileThunk =
    createAsyncThunk(
        "profile/update",

        async (
            profileData,
            thunkAPI
        ) => {
            try {
                return await updateProfile(
                    profileData
                );
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data
                );
            }
        }
    );
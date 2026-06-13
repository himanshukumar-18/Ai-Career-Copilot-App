import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    registerUser,
    loginUser,
    getMe,
} from "./authService";


// Register User

export const registerThunk = createAsyncThunk(
    "auth/register",

    async (userData, thunkAPI) => {
        try {
            return await registerUser(userData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data ||
                error.message
            );
        }
    }
);


// Login User

export const loginThunk = createAsyncThunk(
    "auth/login",

    async (credentials, thunkAPI) => {
        try {
            return await loginUser(credentials);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data ||
                error.message
            );
        }
    }
);


// Current User

export const getMeThunk = createAsyncThunk(
    "auth/me",

    async (token, thunkAPI) => {
        try {
            return await getMe(token);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data ||
                error.message
            );
        }
    }
);
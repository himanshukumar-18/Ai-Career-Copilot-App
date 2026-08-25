import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    registerUser,
    loginUser,
    getMe,
    verifyOTP,
    googleLogin
} from "./authService";

const normalizeAuthError = (error, defaultFallback) => {
    if (!error?.response) {
        return "Unable to connect to the server. Check your internet connection.";
    }
    const status = error.response.status;
    const data = error.response.data;

    if (status === 401) {
        return "Invalid email or password.";
    }
    if (status === 403) {
        return "You don't have permission to access this account.";
    }
    if (status === 409) {
        return "An account with this email already exists.";
    }
    if (status === 429) {
        return "Too many attempts. Please wait a minute.";
    }
    if (status >= 500) {
        return "Something went wrong on our side. Please try again.";
    }

    if (typeof data === "string") return data;
    if (data?.detail && typeof data.detail === "string") return data.detail;
    if (data?.message && typeof data.message === "string") return data.message;
    if (data?.error && typeof data.error === "string") return data.error;

    if (data && typeof data === "object") {
        const firstKey = Object.keys(data)[0];
        const val = data[firstKey];
        if (Array.isArray(val)) return `${firstKey}: ${val[0]}`;
        if (typeof val === "string") return `${firstKey}: ${val}`;
    }

    return defaultFallback;
};

// Register User
export const registerThunk = createAsyncThunk(
    "auth/register",
    async (userData, thunkAPI) => {
        try {
            return await registerUser(userData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                normalizeAuthError(error, "Unable to create your account right now.")
            );
        }
    }
);

// OTP
export const verifyOTPThunk = createAsyncThunk(
    "auth/verify-otp",
    async (data, thunkAPI) => {
        try {
            return await verifyOTP(data);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                normalizeAuthError(error, "Invalid or expired verification code.")
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
                normalizeAuthError(error, "Invalid email or password.")
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
                normalizeAuthError(error, "Failed to authenticate session.")
            );
        }
    }
);

// Google Login
export const googleLoginThunk = createAsyncThunk(
    "auth/google-login",
    async (credential, thunkAPI) => {
        try {
            const response = await googleLogin(credential);
            await thunkAPI.dispatch(getMeThunk(response.access));
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                normalizeAuthError(error, "Google authentication failed. Please try again.")
            );
        }
    }
);
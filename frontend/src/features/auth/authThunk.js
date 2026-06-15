import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    registerUser,
    loginUser,
    getMe,
    verifyOTP,
    googleLogin
} from "./authService";


// Register User

export const registerThunk = createAsyncThunk(
    "auth/register",

    async (userData, thunkAPI) => {
        try {
            return await registerUser(userData);
        } catch (error) {
            if (error.response?.status === 429) {

                return thunkAPI.rejectWithValue(
                    "Too many registration attempts. Please wait a minute."
                );

            }

            return thunkAPI.rejectWithValue(
                error.response?.data ||
                error.message
            );
        }
    }
);

// otp
export const verifyOTPThunk =
    createAsyncThunk(
        "auth/verify-otp",

        async (data, thunkAPI) => {

            try {

                return await verifyOTP(
                    data
                );

            } catch (error) {
                if (error.response?.status === 429) {

                    return thunkAPI.rejectWithValue(
                        "Too many OTP attempts. Please wait a minute."
                    );

                }

                return thunkAPI.rejectWithValue(
                    error.response?.data
                );

            }

        }
    );


// Login User

export const loginThunk = createAsyncThunk(
    "auth/login",

    async (credentials, thunkAPI) => {

        try {

            return await loginUser(
                credentials
            );

        } catch (error) {

            if (
                error.response?.status === 429
            ) {

                return thunkAPI.rejectWithValue(
                    "Too many login attempts. Please wait a minute."
                );

            }

            return thunkAPI.rejectWithValue(
                error.response?.data?.detail ||
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

export const googleLoginThunk =
    createAsyncThunk(
        "auth/google-login",

        async (
            credential,
            thunkAPI
        ) => {

            try {

                const response =
                    await googleLogin(
                        credential
                    );

                await thunkAPI.dispatch(
                    getMeThunk(
                        response.access
                    )
                );

                return response;

            } catch (error) {
                if (error.response?.status === 429) {

                    return thunkAPI.rejectWithValue(
                        "Too many Google login attempts. Please wait a minute."
                    );

                }

                return thunkAPI.rejectWithValue(
                    error.response?.data
                );

            }

        }
    );
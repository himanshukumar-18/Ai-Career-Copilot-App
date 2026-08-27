import { createSlice } from "@reduxjs/toolkit";

import {
    loginThunk,
    registerThunk,
    getMeThunk,
    verifyOTPThunk,
    googleLoginThunk
} from "./authThunk";

const initialState = {
    user: null,

    accessToken:
        localStorage.getItem(
            "accessToken"
        ),

    refreshToken:
        localStorage.getItem(
            "refreshToken"
        ),

    isAuthenticated:
        !!localStorage.getItem(
            "accessToken"
        ),

    isLoading: false,
    isSuccess: false,
    isError: false,

    message: null,
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        logout: (state) => {

            localStorage.removeItem(
                "accessToken"
            );

            localStorage.removeItem(
                "refreshToken"
            );

            state.user = null;

            state.accessToken = null;
            state.refreshToken = null;

            state.isAuthenticated = false;

            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;

            state.message = null;
        },

        resetAuthState: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // REGISTER

            .addCase(registerThunk.pending, (state) => {
                state.isLoading = true;
            })

            .addCase(registerThunk.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })

            .addCase(registerThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // LOGIN

            .addCase(loginThunk.pending, (state) => {
                state.isLoading = true;
            })

            .addCase(loginThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                state.message = "Login successful";

                state.accessToken =
                    action.payload.access;

                state.refreshToken =
                    action.payload.refresh;

                localStorage.setItem(
                    "accessToken",
                    action.payload.access
                );

                localStorage.setItem(
                    "refreshToken",
                    action.payload.refresh
                );

                state.isAuthenticated = true;
            })

            .addCase(loginThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // GET CURRENT USER

            .addCase(getMeThunk.pending, (state) => {
                state.isLoading = true;
            })

            .addCase(getMeThunk.fulfilled, (state, action) => {
                state.isLoading = false;

                state.user = action.payload;
            })

            .addCase(getMeThunk.rejected, (state) => {
                state.isLoading = false;
            })

            .addCase(
                verifyOTPThunk.pending,

                (state) => {

                    state.isLoading = true;
                }
            )

            .addCase(
                verifyOTPThunk.fulfilled,

                (state, action) => {

                    state.isLoading = false;

                    state.isSuccess = true;

                    state.message =
                        action.payload.detail;
                }
            )

            .addCase(
                verifyOTPThunk.rejected,

                (state, action) => {

                    state.isLoading = false;

                    state.isError = true;

                    state.message =
                        action.payload?.detail;
                }
            )

            .addCase(
                googleLoginThunk.pending,

                (state) => {

                    state.isLoading = true;
                }
            )

            .addCase(
                googleLoginThunk.fulfilled,

                (state, action) => {

                    localStorage.setItem(
                        "accessToken",
                        action.payload.access
                    );

                    localStorage.setItem(
                        "refreshToken",
                        action.payload.refresh
                    );

                    state.accessToken =
                        action.payload.access;

                    state.refreshToken =
                        action.payload.refresh;

                    state.isAuthenticated =
                        true;

                    state.isLoading = false;

                    state.isSuccess = true;

                    state.message =
                        "Login successful";
                }
            )

            .addCase(
                googleLoginThunk.rejected,

                (state, action) => {

                    state.isLoading = false;

                    state.isError = true;

                    state.message =
                        action.payload?.detail;
                }
            )
    },
});

export const {
    logout,
    resetAuthState,
} = authSlice.actions;

export default authSlice.reducer;
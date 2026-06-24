import {
    createSlice,
} from "@reduxjs/toolkit";

import {
    getProfileThunk,
    updateProfileThunk,
} from "./profileThunk";

const initialState = {
    profile: null,

    isLoading: false,

    isSuccess: false,

    isError: false,

    message: "",
};

const profileSlice =
    createSlice({
        name: "profile",

        initialState,

        reducers: {

            resetProfileState: (
                state
            ) => {

                state.isSuccess =
                    false;

                state.isError =
                    false;

                state.message =
                    "";
            },

        },


        extraReducers: (
            builder
        ) => {

            builder

                .addCase(
                    getProfileThunk.pending,

                    (state) => {
                        state.isLoading = true;
                    }
                )

                .addCase(
                    getProfileThunk.fulfilled,

                    (
                        state,
                        action
                    ) => {
                        state.isLoading =
                            false;

                        state.profile =
                            action.payload;
                    }
                )

                .addCase(
                    getProfileThunk.rejected,

                    (
                        state,
                        action
                    ) => {
                        state.isLoading =
                            false;

                        state.isError =
                            true;

                        state.message =
                            action.payload
                                ?.detail;
                    }
                )

                .addCase(
                    updateProfileThunk.fulfilled,

                    (
                        state,
                        action
                    ) => {

                        state.profile =
                            action.payload;

                        state.isSuccess =
                            true;
                    }
                );
        },
    });

export const {
    resetProfileState
} = profileSlice.actions

export default
    profileSlice.reducer;
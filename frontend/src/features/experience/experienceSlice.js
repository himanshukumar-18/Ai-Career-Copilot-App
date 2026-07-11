import { createSlice } from "@reduxjs/toolkit";
import {
    addExperience,
    editExperience,
    fetchExperiences,
    removeExperience,
} from "./experienceThunk";

const initialState = {
    items: [],
    status: "idle",
    error: null,
    addStatus: "idle",
    addError: null,
    rowStatus: {},
    rowError: {},
};

const experienceSlice = createSlice({
    name: "experience",
    initialState,

    reducers: {
        clearExperienceError: (state) => {
            state.error = null;
        },

        clearAddError: (state) => {
            state.addError = null;
        },

        clearRowError: (state, action) => {
            delete state.rowError[action.payload];
        },

        resetExperiences: () => initialState,
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchExperiences.pending, (state) => {
                state.status = "pending";
                state.error = null;
            })
            .addCase(fetchExperiences.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = Array.isArray(action.payload)
                    ? action.payload
                    : [];
            })
            .addCase(fetchExperiences.rejected, (state, action) => {
                state.status = "failed";
                state.error =
                    action.payload || "Unable to load experiences.";
            })

            .addCase(addExperience.pending, (state) => {
                state.addStatus = "pending";
                state.addError = null;
            })
            .addCase(addExperience.fulfilled, (state, action) => {
                state.addStatus = "succeeded";
                state.items.push(action.payload);
            })
            .addCase(addExperience.rejected, (state, action) => {
                state.addStatus = "failed";
                state.addError =
                    action.payload || "Unable to add experience.";
            })

            .addCase(editExperience.pending, (state, action) => {
                const id = action.meta.arg.id;

                state.rowStatus[id] = "pending";
                state.rowError[id] = null;
            })
            .addCase(editExperience.fulfilled, (state, action) => {
                const updatedExperience = action.payload;

                state.rowStatus[updatedExperience.id] = "succeeded";

                const index = state.items.findIndex(
                    (item) => item.id === updatedExperience.id
                );

                if (index !== -1) {
                    state.items[index] = updatedExperience;
                }
            })
            .addCase(editExperience.rejected, (state, action) => {
                const { id, message } = action.payload || {};

                if (!id) return;

                state.rowStatus[id] = "failed";
                state.rowError[id] =
                    message || "Unable to update experience.";
            })

            .addCase(removeExperience.pending, (state, action) => {
                const id = action.meta.arg;

                state.rowStatus[id] = "pending";
                state.rowError[id] = null;
            })
            .addCase(removeExperience.fulfilled, (state, action) => {
                const id = action.payload;

                state.items = state.items.filter(
                    (item) => item.id !== id
                );

                delete state.rowStatus[id];
                delete state.rowError[id];
            })
            .addCase(removeExperience.rejected, (state, action) => {
                const { id, message } = action.payload || {};

                if (!id) return;

                state.rowStatus[id] = "failed";
                state.rowError[id] =
                    message || "Unable to delete experience.";
            });
    },
});

export const {
    clearExperienceError,
    clearAddError,
    clearRowError,
    resetExperiences,
} = experienceSlice.actions;

export default experienceSlice.reducer;
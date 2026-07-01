import { createSlice } from "@reduxjs/toolkit";
import { fetchExperiences, addExperience, editExperience, removeExperience,  } from "./experienceThunk"

const initialState = {
    items: [],
    status: "idle", // "idle" | "pending" | "succeeded" | "failed"
    error: null,
    // Per-row status for save/delete, keyed by experience id
    rowStatus: {}, // { [id]: "idle" | "pending" | "succeeded" | "failed" }
    rowError: {}, // { [id]: string | null }
};

const experienceSlice = createSlice({
    name: "experience",
    initialState,
    reducers: {
        /** Clear list-level error, e.g. after showing a toast */
        clearExperienceError: (state) => {
            state.error = null;
        },
        /** Clear a specific row's error, e.g. after showing a toast */
        clearRowError: (state, action) => {
            delete state.rowError[action.payload];
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchExperiences.pending, (state) => {
                state.status = "pending";
                state.error = null;
            })
            .addCase(fetchExperiences.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchExperiences.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Add
            .addCase(addExperience.pending, (state) => {
                state.status = "pending";
                state.error = null;
            })
            .addCase(addExperience.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items.push(action.payload);
            })
            .addCase(addExperience.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Edit (per-row)
            .addCase(editExperience.pending, (state, action) => {
                const id = action.meta.arg.id;
                state.rowStatus[id] = "pending";
                state.rowError[id] = null;
            })
            .addCase(editExperience.fulfilled, (state, action) => {
                const updated = action.payload;
                state.rowStatus[updated.id] = "succeeded";
                const index = state.items.findIndex((item) => item.id === updated.id);
                if (index !== -1) state.items[index] = updated;
            })
            .addCase(editExperience.rejected, (state, action) => {
                const { id, message } = action.payload;
                state.rowStatus[id] = "failed";
                state.rowError[id] = message;
            })

            // Delete (per-row)
            .addCase(removeExperience.pending, (state, action) => {
                const id = action.meta.arg;
                state.rowStatus[id] = "pending";
                state.rowError[id] = null;
            })
            .addCase(removeExperience.fulfilled, (state, action) => {
                const id = action.payload;
                state.items = state.items.filter((item) => item.id !== id);
                delete state.rowStatus[id];
                delete state.rowError[id];
            })
            .addCase(removeExperience.rejected, (state, action) => {
                const { id, message } = action.payload;
                state.rowStatus[id] = "failed";
                state.rowError[id] = message;
            });
    },
});

export const { clearExperienceError, clearRowError } = experienceSlice.actions;

export default experienceSlice.reducer;


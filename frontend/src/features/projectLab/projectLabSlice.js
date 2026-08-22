import { createSlice } from "@reduxjs/toolkit";
import {
    generateProjectsThunk,
    fetchMyProjectsThunk,
    fetchProjectByIdThunk,
    saveGeneratedProjectThunk,
    updateProjectStatusThunk,
    deleteUserProjectThunk,
} from "./projectLabThunk";

const initialState = {
    generatedProjects: [],
    myProjects: [],
    selectedProject: null,
    pagination: null,

    filters: {
        status: "",
        difficulty: "",
        search: "",
        ordering: "-updated_at",
        page: 1,
    },

    listStatus: "idle",       // 'idle' | 'pending' | 'succeeded' | 'failed'
    generateStatus: "idle",
    detailStatus: "idle",
    saveStatus: "idle",
    updateStatus: "idle",
    deleteStatus: "idle",

    error: null,
    generateError: null,
    saveError: null,
    updateError: null,
    deleteError: null,
};

const projectLabSlice = createSlice({
    name: "projectLab",
    initialState,
    reducers: {
        setFilters(state, action) {
            state.filters = {
                ...state.filters,
                ...action.payload,
            };
        },

        resetFilters(state) {
            state.filters = {
                status: "",
                difficulty: "",
                search: "",
                ordering: "-updated_at",
                page: 1,
            };
        },

        setPage(state, action) {
            state.filters.page = action.payload;
        },

        clearGeneratedProjects(state) {
            state.generatedProjects = [];
            state.generateStatus = "idle";
            state.generateError = null;
        },

        clearSelectedProject(state) {
            state.selectedProject = null;
            state.detailStatus = "idle";
        },

        clearProjectLabError(state) {
            state.error = null;
            state.generateError = null;
            state.saveError = null;
            state.updateError = null;
            state.deleteError = null;
        },

        resetProjectLabStatuses(state) {
            state.listStatus = "idle";
            state.generateStatus = "idle";
            state.detailStatus = "idle";
            state.saveStatus = "idle";
            state.updateStatus = "idle";
            state.deleteStatus = "idle";
            state.error = null;
            state.generateError = null;
            state.saveError = null;
            state.updateError = null;
            state.deleteError = null;
        },
    },

    extraReducers: (builder) => {
        /**
         * ---------------------------------------
         * Generate Projects (AI)
         * ---------------------------------------
         */
        builder
            .addCase(generateProjectsThunk.pending, (state) => {
                state.generateStatus = "pending";
                state.generateError = null;
            })
            .addCase(generateProjectsThunk.fulfilled, (state, action) => {
                state.generateStatus = "succeeded";
                state.generatedProjects = action.payload;
            })
            .addCase(generateProjectsThunk.rejected, (state, action) => {
                state.generateStatus = "failed";
                state.generateError = action.payload;
            });

        /**
         * ---------------------------------------
         * Fetch My Projects List
         * ---------------------------------------
         */
        builder
            .addCase(fetchMyProjectsThunk.pending, (state) => {
                state.listStatus = "pending";
                state.error = null;
            })
            .addCase(fetchMyProjectsThunk.fulfilled, (state, action) => {
                state.listStatus = "succeeded";
                state.myProjects = action.payload.results;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchMyProjectsThunk.rejected, (state, action) => {
                state.listStatus = "failed";
                state.error = action.payload;
            });

        /**
         * ---------------------------------------
         * Fetch Project By ID
         * ---------------------------------------
         */
        builder
            .addCase(fetchProjectByIdThunk.pending, (state) => {
                state.detailStatus = "pending";
            })
            .addCase(fetchProjectByIdThunk.fulfilled, (state, action) => {
                state.detailStatus = "succeeded";
                state.selectedProject = action.payload;
            })
            .addCase(fetchProjectByIdThunk.rejected, (state, action) => {
                state.detailStatus = "failed";
                state.error = action.payload;
            });

        /**
         * ---------------------------------------
         * Save Generated Project
         * ---------------------------------------
         */
        builder
            .addCase(saveGeneratedProjectThunk.pending, (state) => {
                state.saveStatus = "pending";
                state.saveError = null;
            })
            .addCase(saveGeneratedProjectThunk.fulfilled, (state, action) => {
                state.saveStatus = "succeeded";
                if (action.payload) {
                    state.myProjects = [action.payload, ...state.myProjects];
                }
            })
            .addCase(saveGeneratedProjectThunk.rejected, (state, action) => {
                state.saveStatus = "failed";
                state.saveError = action.payload;
            });

        /**
         * ---------------------------------------
         * Update Project Status / Notes / Repo Link
         * ---------------------------------------
         */
        builder
            .addCase(updateProjectStatusThunk.pending, (state) => {
                state.updateStatus = "pending";
                state.updateError = null;
            })
            .addCase(updateProjectStatusThunk.fulfilled, (state, action) => {
                state.updateStatus = "succeeded";
                const updated = action.payload;
                if (updated) {
                    state.myProjects = state.myProjects.map((p) =>
                        p.id === updated.id ? updated : p
                    );
                    if (state.selectedProject?.id === updated.id) {
                        state.selectedProject = updated;
                    }
                }
            })
            .addCase(updateProjectStatusThunk.rejected, (state, action) => {
                state.updateStatus = "failed";
                state.updateError = action.payload;
            });

        /**
         * ---------------------------------------
         * Delete User Project
         * ---------------------------------------
         */
        builder
            .addCase(deleteUserProjectThunk.pending, (state) => {
                state.deleteStatus = "pending";
                state.deleteError = null;
            })
            .addCase(deleteUserProjectThunk.fulfilled, (state, action) => {
                state.deleteStatus = "succeeded";
                const deletedId = action.payload;
                state.myProjects = state.myProjects.filter((p) => p.id !== deletedId);
                if (state.selectedProject?.id === deletedId) {
                    state.selectedProject = null;
                }
            })
            .addCase(deleteUserProjectThunk.rejected, (state, action) => {
                state.deleteStatus = "failed";
                state.deleteError = action.payload;
            });
    },
});

export const {
    setFilters,
    resetFilters,
    setPage,
    clearGeneratedProjects,
    clearSelectedProject,
    clearProjectLabError,
    resetProjectLabStatuses,
} = projectLabSlice.actions;

export default projectLabSlice.reducer;

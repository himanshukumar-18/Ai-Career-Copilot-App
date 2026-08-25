import { createSlice } from "@reduxjs/toolkit";
import {
    fetchRolesThunk,
    generateAIRoadmapThunk,
    fetchUserProgressThunk,
    completeStepThunk,
    fetchNextStepThunk,
    fetchMyEnrolledRoadmapsThunk,
} from "./careerRoadmapThunk";

const initialState = {
    roles: [],
    selectedRoleSlug: null,
    activeProgress: null, // Full UserRoadmapProgressDetail object
    myEnrolledRoadmaps: [],
    nextStepData: null,

    rolesStatus: "idle",       // 'idle' | 'pending' | 'succeeded' | 'failed'
    generateStatus: "idle",
    progressStatus: "idle",
    completeStatus: "idle",
    nextStepStatus: "idle",
    enrolledListStatus: "idle",

    rolesError: null,
    generateError: null,
    progressError: null,
    completeError: null,
    nextStepError: null,

    lastUpdated: null,
};

const careerRoadmapSlice = createSlice({
    name: "careerRoadmap",
    initialState,
    reducers: {
        setSelectedRoleSlug(state, action) {
            state.selectedRoleSlug = action.payload;
        },

        clearActiveProgress(state) {
            state.activeProgress = null;
            state.progressStatus = "idle";
            state.progressError = null;
        },

        clearRoadmapErrors(state) {
            state.rolesError = null;
            state.generateError = null;
            state.progressError = null;
            state.completeError = null;
            state.nextStepError = null;
        },

        resetRoadmapStatuses(state) {
            state.rolesStatus = "idle";
            state.generateStatus = "idle";
            state.progressStatus = "idle";
            state.completeStatus = "idle";
            state.nextStepStatus = "idle";
            state.enrolledListStatus = "idle";
        },
    },

    extraReducers: (builder) => {
        /**
         * ---------------------------------------
         * Fetch Available Career Roles
         * ---------------------------------------
         */
        builder
            .addCase(fetchRolesThunk.pending, (state) => {
                state.rolesStatus = "pending";
                state.rolesError = null;
            })
            .addCase(fetchRolesThunk.fulfilled, (state, action) => {
                state.rolesStatus = "succeeded";
                state.roles = action.payload;
                if (!state.selectedRoleSlug && action.payload.length > 0) {
                    state.selectedRoleSlug = action.payload[0].slug;
                }
            })
            .addCase(fetchRolesThunk.rejected, (state, action) => {
                state.rolesStatus = "failed";
                state.rolesError = action.payload;
            });

        /**
         * ---------------------------------------
         * Generate AI Roadmap
         * ---------------------------------------
         */
        builder
            .addCase(generateAIRoadmapThunk.pending, (state) => {
                state.generateStatus = "pending";
                state.generateError = null;
            })
            .addCase(generateAIRoadmapThunk.fulfilled, (state, action) => {
                state.generateStatus = "succeeded";
                state.activeProgress = action.payload;
                state.selectedRoleSlug = action.payload?.career_role?.slug || state.selectedRoleSlug;
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(generateAIRoadmapThunk.rejected, (state, action) => {
                state.generateStatus = "failed";
                state.generateError = action.payload;
            });

        /**
         * ---------------------------------------
         * Fetch Student User Progress
         * ---------------------------------------
         */
        builder
            .addCase(fetchUserProgressThunk.pending, (state) => {
                state.progressStatus = "pending";
                state.progressError = null;
            })
            .addCase(fetchUserProgressThunk.fulfilled, (state, action) => {
                state.progressStatus = "succeeded";
                state.activeProgress = action.payload;
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(fetchUserProgressThunk.rejected, (state, action) => {
                state.progressStatus = "failed";
                state.progressError = action.payload;
                state.activeProgress = null;
            });

        /**
         * ---------------------------------------
         * Complete Step
         * ---------------------------------------
         */
        builder
            .addCase(completeStepThunk.pending, (state) => {
                state.completeStatus = "pending";
                state.completeError = null;
            })
            .addCase(completeStepThunk.fulfilled, (state, action) => {
                state.completeStatus = "succeeded";
                const nextData = action.payload;
                state.nextStepData = nextData;

                // Update local step status & percentage inside activeProgress
                if (state.activeProgress && nextData) {
                    state.activeProgress.completion_percentage = nextData.completion_percentage;
                    const completedStepId = nextData.current_step?.id;
                    if (completedStepId && state.activeProgress.step_progresses) {
                        state.activeProgress.step_progresses = state.activeProgress.step_progresses.map((sp) => {
                            if (sp.step?.id === completedStepId) {
                                return {
                                    ...sp,
                                    status: "completed",
                                    completed_at: new Date().toISOString(),
                                };
                            }
                            return sp;
                        });
                    }
                }
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(completeStepThunk.rejected, (state, action) => {
                state.completeStatus = "failed";
                state.completeError = action.payload;
            });

        /**
         * ---------------------------------------
         * Fetch Next Step Recommendation
         * ---------------------------------------
         */
        builder
            .addCase(fetchNextStepThunk.pending, (state) => {
                state.nextStepStatus = "pending";
                state.nextStepError = null;
            })
            .addCase(fetchNextStepThunk.fulfilled, (state, action) => {
                state.nextStepStatus = "succeeded";
                state.nextStepData = action.payload;
            })
            .addCase(fetchNextStepThunk.rejected, (state, action) => {
                state.nextStepStatus = "failed";
                state.nextStepError = action.payload;
            });

        /**
         * ---------------------------------------
         * Fetch Enrolled Roadmaps
         * ---------------------------------------
         */
        builder
            .addCase(fetchMyEnrolledRoadmapsThunk.pending, (state) => {
                state.enrolledListStatus = "pending";
            })
            .addCase(fetchMyEnrolledRoadmapsThunk.fulfilled, (state, action) => {
                state.enrolledListStatus = "succeeded";
                state.myEnrolledRoadmaps = action.payload;
            })
            .addCase(fetchMyEnrolledRoadmapsThunk.rejected, (state) => {
                state.enrolledListStatus = "failed";
            });
    },
});

export const {
    setSelectedRoleSlug,
    clearActiveProgress,
    clearRoadmapErrors,
    resetRoadmapStatuses,
} = careerRoadmapSlice.actions;

export default careerRoadmapSlice.reducer;

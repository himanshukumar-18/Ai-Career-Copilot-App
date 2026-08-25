import { createSlice } from "@reduxjs/toolkit";
import * as thunks from "./adminThunk";

const initialState = {
    dashboardStats: null,
    activities: [],

    students: [],
    studentsPagination: { count: 0, next: null, previous: null },
    selectedStudent: null,

    careerRoles: [],
    resources: { roadmap_resources: [], prep_resources: [] },

    resumesData: { total_count: 0, published_count: 0, resumes: [], published_resumes: [] },
    aiMonitoring: null,
    analytics: null,
    health: null,
    settings: null,

    isLoading: false,
    isError: false,
    message: "",
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        resetAdminState: () => initialState,
        clearAdminError: (state) => {
            state.isError = false;
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
            // Dashboard Stats
            .addCase(thunks.fetchAdminDashboardStatsThunk.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(thunks.fetchAdminDashboardStatsThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.dashboardStats = action.payload.stats;
                state.activities = action.payload.activities;
            })
            .addCase(thunks.fetchAdminDashboardStatsThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // Students
            .addCase(thunks.fetchAdminStudentsThunk.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(thunks.fetchAdminStudentsThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.students = action.payload.results || action.payload;
                state.studentsPagination = {
                    count: action.payload.count || action.payload.length || 0,
                    next: action.payload.next || null,
                    previous: action.payload.previous || null,
                };
            })
            .addCase(thunks.fetchAdminStudentsThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // Student Detail
            .addCase(thunks.fetchAdminStudentDetailThunk.fulfilled, (state, action) => {
                state.selectedStudent = action.payload;
            })

            // Toggle Student Active
            .addCase(thunks.toggleAdminStudentActiveThunk.fulfilled, (state, action) => {
                const updated = action.payload;
                state.students = state.students.map((s) => (s.id === updated.id ? { ...s, is_active: updated.is_active } : s));
                if (state.selectedStudent && state.selectedStudent.id === updated.id) {
                    state.selectedStudent = { ...state.selectedStudent, is_active: updated.is_active };
                }
            })

            // Career Roles
            .addCase(thunks.fetchAdminCareerRolesThunk.fulfilled, (state, action) => {
                state.careerRoles = action.payload.results || action.payload;
            })
            .addCase(thunks.createAdminCareerRoleThunk.fulfilled, (state, action) => {
                state.careerRoles.unshift(action.payload);
            })
            .addCase(thunks.updateAdminCareerRoleThunk.fulfilled, (state, action) => {
                state.careerRoles = state.careerRoles.map((r) => (r.id === action.payload.id ? action.payload : r));
            })
            .addCase(thunks.deleteAdminCareerRoleThunk.fulfilled, (state, action) => {
                state.careerRoles = state.careerRoles.filter((r) => r.id !== action.payload);
            })

            // Resources
            .addCase(thunks.fetchAdminResourcesThunk.fulfilled, (state, action) => {
                state.resources = action.payload;
            })

            // Resumes
            .addCase(thunks.fetchAdminResumesThunk.fulfilled, (state, action) => {
                state.resumesData = action.payload;
            })

            // AI Monitoring
            .addCase(thunks.fetchAdminAIMonitoringThunk.fulfilled, (state, action) => {
                state.aiMonitoring = action.payload;
            })

            // Analytics
            .addCase(thunks.fetchAdminAnalyticsThunk.fulfilled, (state, action) => {
                state.analytics = action.payload;
            })

            // Health
            .addCase(thunks.fetchAdminHealthThunk.fulfilled, (state, action) => {
                state.health = action.payload;
            })

            // Settings
            .addCase(thunks.fetchAdminSettingsThunk.fulfilled, (state, action) => {
                state.settings = action.payload;
            });
    },
});

export const { resetAdminState, clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;

import { createAsyncThunk } from "@reduxjs/toolkit";
import * as adminApi from "./adminApi";

export const fetchAdminDashboardStatsThunk = createAsyncThunk(
    "admin/fetchDashboardStats",
    async (_, thunkAPI) => {
        try {
            const res = await adminApi.getAdminDashboardStats();
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.detail || "Failed to fetch dashboard stats.");
        }
    }
);

export const fetchAdminStudentsThunk = createAsyncThunk(
    "admin/fetchStudents",
    async (params, thunkAPI) => {
        try {
            const res = await adminApi.getAdminStudents(params);
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.detail || "Failed to fetch students.");
        }
    }
);

export const fetchAdminStudentDetailThunk = createAsyncThunk(
    "admin/fetchStudentDetail",
    async (studentId, thunkAPI) => {
        try {
            const res = await adminApi.getAdminStudentDetail(studentId);
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.detail || "Failed to fetch student details.");
        }
    }
);

export const toggleAdminStudentActiveThunk = createAsyncThunk(
    "admin/toggleStudentActive",
    async (studentId, thunkAPI) => {
        try {
            const res = await adminApi.toggleAdminStudentActive(studentId);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.detail || "Failed to update student account status.");
        }
    }
);

export const fetchAdminCareerRolesThunk = createAsyncThunk(
    "admin/fetchCareerRoles",
    async (params, thunkAPI) => {
        try {
            const res = await adminApi.getAdminCareerRoles(params);
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.detail || "Failed to fetch career roles.");
        }
    }
);

export const createAdminCareerRoleThunk = createAsyncThunk(
    "admin/createCareerRole",
    async (data, thunkAPI) => {
        try {
            const res = await adminApi.createAdminCareerRole(data);
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.detail || "Failed to create career role.");
        }
    }
);

export const updateAdminCareerRoleThunk = createAsyncThunk(
    "admin/updateCareerRole",
    async ({ id, data }, thunkAPI) => {
        try {
            const res = await adminApi.updateAdminCareerRole({ id, data });
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.detail || "Failed to update career role.");
        }
    }
);

export const deleteAdminCareerRoleThunk = createAsyncThunk(
    "admin/deleteCareerRole",
    async (id, thunkAPI) => {
        try {
            await adminApi.deleteAdminCareerRole(id);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.detail || "Failed to delete career role.");
        }
    }
);

export const fetchAdminResourcesThunk = createAsyncThunk(
    "admin/fetchResources",
    async (_, thunkAPI) => {
        try {
            const res = await adminApi.getAdminResources();
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.detail || "Failed to fetch resources.");
        }
    }
);

export const fetchAdminResumesThunk = createAsyncThunk(
    "admin/fetchResumes",
    async (_, thunkAPI) => {
        try {
            const res = await adminApi.getAdminResumes();
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.detail || "Failed to fetch resumes.");
        }
    }
);

export const fetchAdminAIMonitoringThunk = createAsyncThunk(
    "admin/fetchAIMonitoring",
    async (_, thunkAPI) => {
        try {
            const res = await adminApi.getAdminAIMonitoring();
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.detail || "Failed to fetch AI monitoring data.");
        }
    }
);

export const fetchAdminAnalyticsThunk = createAsyncThunk(
    "admin/fetchAnalytics",
    async (_, thunkAPI) => {
        try {
            const res = await adminApi.getAdminAnalytics();
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.detail || "Failed to fetch analytics data.");
        }
    }
);

export const fetchAdminHealthThunk = createAsyncThunk(
    "admin/fetchHealth",
    async (_, thunkAPI) => {
        try {
            const res = await adminApi.getAdminHealth();
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.detail || "Failed to fetch system health.");
        }
    }
);

export const fetchAdminSettingsThunk = createAsyncThunk(
    "admin/fetchSettings",
    async (_, thunkAPI) => {
        try {
            const res = await adminApi.getAdminSettings();
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.detail || "Failed to fetch admin settings.");
        }
    }
);

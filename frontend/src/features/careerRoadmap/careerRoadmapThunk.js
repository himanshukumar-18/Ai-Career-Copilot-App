import { createAsyncThunk } from "@reduxjs/toolkit";
import careerRoadmapApi from "../../api/careerRoadmapApi";

/**
 * Helper to normalize API error payload.
 */
const extractErrorPayload = (error) => {
    if (error.response?.data) {
        return {
            message: error.response.data.message || "An error occurred.",
            errors: error.response.data.errors || null,
            status: error.response.status,
        };
    }
    return {
        message: error.message || "Network connection error.",
        errors: null,
        status: 500,
    };
};

const extractArrayData = (resData) => {
    if (!resData) return [];
    if (Array.isArray(resData)) return resData;
    if (Array.isArray(resData.data)) return resData.data;
    if (resData.data && typeof resData.data === "object" && Array.isArray(resData.data.results)) {
        return resData.data.results;
    }
    if (Array.isArray(resData.results)) return resData.results;
    return [];
};

export const fetchRolesThunk = createAsyncThunk(
    "careerRoadmap/fetchRoles",
    async (_, { rejectWithValue }) => {
        try {
            const response = await careerRoadmapApi.fetchRoles();
            const roles = extractArrayData(response.data);
            return roles;
        } catch (error) {
            return rejectWithValue(extractErrorPayload(error));
        }
    }
);

export const generateAIRoadmapThunk = createAsyncThunk(
    "careerRoadmap/generateAIRoadmap",
    async ({ careerRoleSlug, forceRegenerate = false, customRoleInput }, { rejectWithValue }) => {
        try {
            const roleInput = customRoleInput || careerRoleSlug;
            const response = await careerRoadmapApi.generateAIRoadmap({
                career_role_input: roleInput,
                force_regenerate: forceRegenerate,
            });
            return response.data?.data;
        } catch (error) {
            return rejectWithValue(extractErrorPayload(error));
        }
    }
);

export const fetchUserProgressThunk = createAsyncThunk(
    "careerRoadmap/fetchUserProgress",
    async (careerRoleSlug, { rejectWithValue }) => {
        try {
            const response = await careerRoadmapApi.getUserProgress(careerRoleSlug);
            return response.data?.data;
        } catch (error) {
            return rejectWithValue(extractErrorPayload(error));
        }
    }
);

export const completeStepThunk = createAsyncThunk(
    "careerRoadmap/completeStep",
    async ({ stepId, notes }, { rejectWithValue }) => {
        try {
            const response = await careerRoadmapApi.completeStep(stepId, { notes });
            return response.data?.data; // returns NextStepResponseSerializer payload
        } catch (error) {
            return rejectWithValue(extractErrorPayload(error));
        }
    }
);

export const fetchNextStepThunk = createAsyncThunk(
    "careerRoadmap/fetchNextStep",
    async (careerRoleSlug, { rejectWithValue }) => {
        try {
            const response = await careerRoadmapApi.getNextStep(careerRoleSlug);
            return response.data?.data;
        } catch (error) {
            return rejectWithValue(extractErrorPayload(error));
        }
    }
);

export const fetchMyEnrolledRoadmapsThunk = createAsyncThunk(
    "careerRoadmap/fetchMyEnrolledRoadmaps",
    async (_, { rejectWithValue }) => {
        try {
            const response = await careerRoadmapApi.getMyEnrolledRoadmaps();
            const rawData = response.data?.data;
            const enrollments = Array.isArray(rawData) ? rawData : (rawData?.results || []);
            return enrollments;
        } catch (error) {
            return rejectWithValue(extractErrorPayload(error));
        }
    }
);

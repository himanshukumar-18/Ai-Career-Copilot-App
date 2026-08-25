import { createAsyncThunk } from "@reduxjs/toolkit";
import interviewPrepApi from "../../api/interviewPrepApi";

const normalizeError = (error, fallbackMessage) => {
    if (!error?.response) {
        return error?.message || fallbackMessage;
    }
    const data = error.response.data;
    if (data?.message) return data.message;
    if (data?.errors) {
        if (typeof data.errors === "string") return data.errors;
        if (typeof data.errors === "object") {
            const firstKey = Object.keys(data.errors)[0];
            const val = data.errors[firstKey];
            return Array.isArray(val) ? val[0] : String(val);
        }
    }
    if (data?.detail) return data.detail;
    return fallbackMessage;
};

export const generatePrepPlanThunk = createAsyncThunk(
    "interviewPrep/generatePrepPlan",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await interviewPrepApi.generatePrepPlan(payload);
            const resData = response.data;
            return resData?.data || resData;
        } catch (error) {
            return rejectWithValue(
                normalizeError(error, "Failed to generate interview preparation plan.")
            );
        }
    }
);

export const fetchPrepPlansThunk = createAsyncThunk(
    "interviewPrep/fetchPrepPlans",
    async (_, { rejectWithValue }) => {
        try {
            const response = await interviewPrepApi.fetchPrepPlans();
            const resData = response.data;
            if (Array.isArray(resData?.data)) return resData.data;
            if (Array.isArray(resData?.results)) return resData.results;
            if (Array.isArray(resData)) return resData;
            return [];
        } catch (error) {
            return rejectWithValue(
                normalizeError(error, "Failed to load interview preparation plans.")
            );
        }
    }
);

export const fetchPrepPlanByIdThunk = createAsyncThunk(
    "interviewPrep/fetchPrepPlanById",
    async (planId, { rejectWithValue }) => {
        try {
            const response = await interviewPrepApi.fetchPrepPlanById(planId);
            return response.data?.data;
        } catch (error) {
            return rejectWithValue(
                normalizeError(error, "Failed to load prep plan details.")
            );
        }
    }
);

export const generateQuestionsThunk = createAsyncThunk(
    "interviewPrep/generateQuestions",
    async ({ planId, topicId, questionCount = 5 }, { rejectWithValue }) => {
        try {
            const response = await interviewPrepApi.generateQuestions(planId, {
                topic_id: topicId,
                question_count: questionCount,
            });
            return response.data?.data || [];
        } catch (error) {
            return rejectWithValue(
                normalizeError(error, "Failed to generate interview questions.")
            );
        }
    }
);

export const submitAnswerThunk = createAsyncThunk(
    "interviewPrep/submitAnswer",
    async ({ questionId, userAnswer }, { rejectWithValue }) => {
        try {
            const response = await interviewPrepApi.submitAnswer(questionId, {
                user_answer: userAnswer,
            });
            return response.data?.data;
        } catch (error) {
            return rejectWithValue(
                normalizeError(error, "Failed to evaluate answer.")
            );
        }
    }
);

export const startMockSessionThunk = createAsyncThunk(
    "interviewPrep/startMockSession",
    async ({ planId, category = "technical", totalQuestions = 5 }, { rejectWithValue }) => {
        try {
            const response = await interviewPrepApi.startMockSession(planId, {
                category,
                total_questions: totalQuestions,
            });
            return response.data?.data;
        } catch (error) {
            return rejectWithValue(
                normalizeError(error, "Failed to start mock interview session.")
            );
        }
    }
);

export const submitMockTurnThunk = createAsyncThunk(
    "interviewPrep/submitMockTurn",
    async ({ sessionId, userAnswer }, { rejectWithValue }) => {
        try {
            const response = await interviewPrepApi.submitMockTurn(sessionId, {
                user_answer: userAnswer,
            });
            return response.data?.data;
        } catch (error) {
            return rejectWithValue(
                normalizeError(error, "Failed to submit turn answer.")
            );
        }
    }
);

export const fetchReadinessThunk = createAsyncThunk(
    "interviewPrep/fetchReadiness",
    async (planId, { rejectWithValue }) => {
        try {
            const response = await interviewPrepApi.fetchReadiness(planId);
            return response.data?.data;
        } catch (error) {
            return rejectWithValue(
                normalizeError(error, "Failed to fetch readiness assessment.")
            );
        }
    }
);

export const fetchStudyTodayThunk = createAsyncThunk(
    "interviewPrep/fetchStudyToday",
    async (_, { rejectWithValue }) => {
        try {
            const response = await interviewPrepApi.fetchStudyToday();
            return response.data?.data;
        } catch (error) {
            return rejectWithValue(
                normalizeError(error, "Failed to fetch daily study recommendation.")
            );
        }
    }
);

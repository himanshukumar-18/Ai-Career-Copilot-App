import { createSlice } from "@reduxjs/toolkit";
import {
    fetchPrepPlansThunk,
    fetchPrepPlanByIdThunk,
    generatePrepPlanThunk,
    generateQuestionsThunk,
    submitAnswerThunk,
    startMockSessionThunk,
    submitMockTurnThunk,
    fetchReadinessThunk,
    fetchStudyTodayThunk,
} from "./interviewPrepThunk";

const initialState = {
    plans: [],
    activePlan: null,
    questions: [],
    attemptsMap: {}, // { [questionId]: QuestionAttempt }
    mockSession: null,
    mockTurnResult: null,
    readiness: null,
    studyToday: null,

    plansStatus: "idle",
    generateStatus: "idle",
    planDetailStatus: "idle",
    questionsStatus: "idle",
    evaluationStatus: "idle",
    mockSessionStatus: "idle",
    mockTurnStatus: "idle",
    readinessStatus: "idle",
    studyTodayStatus: "idle",

    plansError: null,
    generateError: null,
    planDetailError: null,
    questionsError: null,
    evaluationError: null,
    mockSessionError: null,
    mockTurnError: null,
    readinessError: null,
    studyTodayError: null,

    lastUpdated: null,
};

const interviewPrepSlice = createSlice({
    name: "interviewPrep",
    initialState,
    reducers: {
        setActivePlan(state, action) {
            state.activePlan = action.payload;
        },
        clearActivePlan(state) {
            state.activePlan = null;
            state.planDetailStatus = "idle";
            state.questions = [];
        },
        clearMockSession(state) {
            state.mockSession = null;
            state.mockTurnResult = null;
            state.mockSessionStatus = "idle";
            state.mockTurnStatus = "idle";
        },
        clearPrepErrors(state) {
            state.plansError = null;
            state.generateError = null;
            state.planDetailError = null;
            state.questionsError = null;
            state.evaluationError = null;
            state.mockSessionError = null;
            state.mockTurnError = null;
            state.readinessError = null;
            state.studyTodayError = null;
        },
        resetPrepStatuses(state) {
            state.plansStatus = "idle";
            state.generateStatus = "idle";
            state.planDetailStatus = "idle";
            state.questionsStatus = "idle";
            state.evaluationStatus = "idle";
            state.mockSessionStatus = "idle";
            state.mockTurnStatus = "idle";
            state.readinessStatus = "idle";
            state.studyTodayStatus = "idle";
        },
    },

    extraReducers: (builder) => {
        // Fetch Plans
        builder
            .addCase(fetchPrepPlansThunk.pending, (state) => {
                state.plansStatus = "pending";
                state.plansError = null;
            })
            .addCase(fetchPrepPlansThunk.fulfilled, (state, action) => {
                state.plansStatus = "succeeded";
                const plansArray = Array.isArray(action.payload)
                    ? action.payload
                    : Array.isArray(action.payload?.data)
                    ? action.payload.data
                    : Array.isArray(action.payload?.results)
                    ? action.payload.results
                    : [];
                state.plans = plansArray;
                if (!state.activePlan && plansArray.length > 0) {
                    state.activePlan = plansArray[0];
                }
            })
            .addCase(fetchPrepPlansThunk.rejected, (state, action) => {
                state.plansStatus = "failed";
                state.plansError = action.payload;
            });

        // Generate Plan
        builder
            .addCase(generatePrepPlanThunk.pending, (state) => {
                state.generateStatus = "pending";
                state.generateError = null;
            })
            .addCase(generatePrepPlanThunk.fulfilled, (state, action) => {
                state.generateStatus = "succeeded";
                state.activePlan = action.payload;
                const currentPlans = Array.isArray(state.plans) ? state.plans : [];
                const newPlanId = action.payload?.id;
                state.plans = newPlanId
                    ? [action.payload, ...currentPlans.filter((p) => p && p.id !== newPlanId)]
                    : [action.payload, ...currentPlans];
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(generatePrepPlanThunk.rejected, (state, action) => {
                state.generateStatus = "failed";
                state.generateError = action.payload;
            });

        // Fetch Plan By ID
        builder
            .addCase(fetchPrepPlanByIdThunk.pending, (state) => {
                state.planDetailStatus = "pending";
                state.planDetailError = null;
            })
            .addCase(fetchPrepPlanByIdThunk.fulfilled, (state, action) => {
                state.planDetailStatus = "succeeded";
                state.activePlan = action.payload;
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(fetchPrepPlanByIdThunk.rejected, (state, action) => {
                state.planDetailStatus = "failed";
                state.planDetailError = action.payload;
            });

        // Generate Questions
        builder
            .addCase(generateQuestionsThunk.pending, (state) => {
                state.questionsStatus = "pending";
                state.questionsError = null;
            })
            .addCase(generateQuestionsThunk.fulfilled, (state, action) => {
                state.questionsStatus = "succeeded";
                state.questions = action.payload;
            })
            .addCase(generateQuestionsThunk.rejected, (state, action) => {
                state.questionsStatus = "failed";
                state.questionsError = action.payload;
            });

        // Submit Answer & Evaluate
        builder
            .addCase(submitAnswerThunk.pending, (state) => {
                state.evaluationStatus = "pending";
                state.evaluationError = null;
            })
            .addCase(submitAnswerThunk.fulfilled, (state, action) => {
                state.evaluationStatus = "succeeded";
                if (action.payload?.question) {
                    state.attemptsMap[action.payload.question] = action.payload;
                }
            })
            .addCase(submitAnswerThunk.rejected, (state, action) => {
                state.evaluationStatus = "failed";
                state.evaluationError = action.payload;
            });

        // Start Mock Session
        builder
            .addCase(startMockSessionThunk.pending, (state) => {
                state.mockSessionStatus = "pending";
                state.mockSessionError = null;
                state.mockTurnResult = null;
            })
            .addCase(startMockSessionThunk.fulfilled, (state, action) => {
                state.mockSessionStatus = "succeeded";
                state.mockSession = action.payload;
            })
            .addCase(startMockSessionThunk.rejected, (state, action) => {
                state.mockSessionStatus = "failed";
                state.mockSessionError = action.payload;
            });

        // Submit Mock Turn
        builder
            .addCase(submitMockTurnThunk.pending, (state) => {
                state.mockTurnStatus = "pending";
                state.mockTurnError = null;
            })
            .addCase(submitMockTurnThunk.fulfilled, (state, action) => {
                state.mockTurnStatus = "succeeded";
                state.mockTurnResult = action.payload;
                if (action.payload?.is_finished && action.payload?.session) {
                    state.mockSession = action.payload.session;
                }
            })
            .addCase(submitMockTurnThunk.rejected, (state, action) => {
                state.mockTurnStatus = "failed";
                state.mockTurnError = action.payload;
            });

        // Fetch Readiness
        builder
            .addCase(fetchReadinessThunk.pending, (state) => {
                state.readinessStatus = "pending";
                state.readinessError = null;
            })
            .addCase(fetchReadinessThunk.fulfilled, (state, action) => {
                state.readinessStatus = "succeeded";
                state.readiness = action.payload;
            })
            .addCase(fetchReadinessThunk.rejected, (state, action) => {
                state.readinessStatus = "failed";
                state.readinessError = action.payload;
            });

        // Fetch Daily Study Today
        builder
            .addCase(fetchStudyTodayThunk.pending, (state) => {
                state.studyTodayStatus = "pending";
                state.studyTodayError = null;
            })
            .addCase(fetchStudyTodayThunk.fulfilled, (state, action) => {
                state.studyTodayStatus = "succeeded";
                state.studyToday = action.payload;
            })
            .addCase(fetchStudyTodayThunk.rejected, (state, action) => {
                state.studyTodayStatus = "failed";
                state.studyTodayError = action.payload;
            });
    },
});

export const {
    setActivePlan,
    clearActivePlan,
    clearMockSession,
    clearPrepErrors,
    resetPrepStatuses,
} = interviewPrepSlice.actions;

export default interviewPrepSlice.reducer;

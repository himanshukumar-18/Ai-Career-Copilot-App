import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import {
    setActivePlan,
    clearActivePlan,
    clearMockSession,
    clearPrepErrors,
    resetPrepStatuses,
} from "./interviewPrepSlice";
import {
    selectPrepPlans,
    selectActivePlan,
    selectQuestions,
    selectAttemptsMap,
    selectMockSession,
    selectMockTurnResult,
    selectReadiness,
    selectStudyToday,
    selectPlansStatus,
    selectGenerateStatus,
    selectPlanDetailStatus,
    selectQuestionsStatus,
    selectEvaluationStatus,
    selectMockSessionStatus,
    selectMockTurnStatus,
    selectReadinessStatus,
    selectStudyTodayStatus,
    selectPlansError,
    selectGenerateError,
    selectPlanDetailError,
    selectQuestionsError,
    selectEvaluationError,
    selectMockSessionError,
    selectMockTurnError,
    selectReadinessError,
    selectStudyTodayError,
} from "./interviewPrepSelectors";

export const useInterviewPrep = () => {
    const dispatch = useDispatch();

    const plans = useSelector(selectPrepPlans);
    const activePlan = useSelector(selectActivePlan);
    const questions = useSelector(selectQuestions);
    const attemptsMap = useSelector(selectAttemptsMap);
    const mockSession = useSelector(selectMockSession);
    const mockTurnResult = useSelector(selectMockTurnResult);
    const readiness = useSelector(selectReadiness);
    const studyToday = useSelector(selectStudyToday);

    const plansStatus = useSelector(selectPlansStatus);
    const generateStatus = useSelector(selectGenerateStatus);
    const planDetailStatus = useSelector(selectPlanDetailStatus);
    const questionsStatus = useSelector(selectQuestionsStatus);
    const evaluationStatus = useSelector(selectEvaluationStatus);
    const mockSessionStatus = useSelector(selectMockSessionStatus);
    const mockTurnStatus = useSelector(selectMockTurnStatus);
    const readinessStatus = useSelector(selectReadinessStatus);
    const studyTodayStatus = useSelector(selectStudyTodayStatus);

    const plansError = useSelector(selectPlansError);
    const generateError = useSelector(selectGenerateError);
    const planDetailError = useSelector(selectPlanDetailError);
    const questionsError = useSelector(selectQuestionsError);
    const evaluationError = useSelector(selectEvaluationError);
    const mockSessionError = useSelector(selectMockSessionError);
    const mockTurnError = useSelector(selectMockTurnError);
    const readinessError = useSelector(selectReadinessError);
    const studyTodayError = useSelector(selectStudyTodayError);

    // Callbacks
    const generatePrepPlan = useCallback(
        (payload) => dispatch(generatePrepPlanThunk(payload)),
        [dispatch]
    );

    const fetchPrepPlans = useCallback(
        () => dispatch(fetchPrepPlansThunk()),
        [dispatch]
    );

    const fetchPrepPlanById = useCallback(
        (planId) => dispatch(fetchPrepPlanByIdThunk(planId)),
        [dispatch]
    );

    const generateQuestions = useCallback(
        (params) => dispatch(generateQuestionsThunk(params)),
        [dispatch]
    );

    const submitAnswer = useCallback(
        (params) => dispatch(submitAnswerThunk(params)),
        [dispatch]
    );

    const startMockSession = useCallback(
        (params) => dispatch(startMockSessionThunk(params)),
        [dispatch]
    );

    const submitMockTurn = useCallback(
        (params) => dispatch(submitMockTurnThunk(params)),
        [dispatch]
    );

    const fetchReadiness = useCallback(
        (planId) => dispatch(fetchReadinessThunk(planId)),
        [dispatch]
    );

    const fetchStudyToday = useCallback(
        () => dispatch(fetchStudyTodayThunk()),
        [dispatch]
    );

    const handleSetActivePlan = useCallback(
        (plan) => dispatch(setActivePlan(plan)),
        [dispatch]
    );

    const handleClearActivePlan = useCallback(
        () => dispatch(clearActivePlan()),
        [dispatch]
    );

    const handleClearMockSession = useCallback(
        () => dispatch(clearMockSession()),
        [dispatch]
    );

    const handleClearErrors = useCallback(
        () => dispatch(clearPrepErrors()),
        [dispatch]
    );

    const handleResetStatuses = useCallback(
        () => dispatch(resetPrepStatuses()),
        [dispatch]
    );

    return {
        // State
        plans,
        activePlan,
        questions,
        attemptsMap,
        mockSession,
        mockTurnResult,
        readiness,
        studyToday,

        // Statuses
        plansStatus,
        generateStatus,
        planDetailStatus,
        questionsStatus,
        evaluationStatus,
        mockSessionStatus,
        mockTurnStatus,
        readinessStatus,
        studyTodayStatus,

        // Errors
        plansError,
        generateError,
        planDetailError,
        questionsError,
        evaluationError,
        mockSessionError,
        mockTurnError,
        readinessError,
        studyTodayError,

        // Actions
        generatePrepPlan,
        fetchPrepPlans,
        fetchPrepPlanById,
        generateQuestions,
        submitAnswer,
        startMockSession,
        submitMockTurn,
        fetchReadiness,
        fetchStudyToday,
        setActivePlan: handleSetActivePlan,
        clearActivePlan: handleClearActivePlan,
        clearMockSession: handleClearMockSession,
        clearPrepErrors: handleClearErrors,
        resetPrepStatuses: handleResetStatuses,
    };
};

export default useInterviewPrep;

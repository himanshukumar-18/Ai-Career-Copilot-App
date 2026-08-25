export const selectInterviewPrepState = (state) => state.interviewPrep;

export const selectPrepPlans = (state) => state.interviewPrep.plans;
export const selectActivePlan = (state) => state.interviewPrep.activePlan;
export const selectQuestions = (state) => state.interviewPrep.questions;
export const selectAttemptsMap = (state) => state.interviewPrep.attemptsMap;
export const selectMockSession = (state) => state.interviewPrep.mockSession;
export const selectMockTurnResult = (state) => state.interviewPrep.mockTurnResult;
export const selectReadiness = (state) => state.interviewPrep.readiness;
export const selectStudyToday = (state) => state.interviewPrep.studyToday;

export const selectPlansStatus = (state) => state.interviewPrep.plansStatus;
export const selectGenerateStatus = (state) => state.interviewPrep.generateStatus;
export const selectPlanDetailStatus = (state) => state.interviewPrep.planDetailStatus;
export const selectQuestionsStatus = (state) => state.interviewPrep.questionsStatus;
export const selectEvaluationStatus = (state) => state.interviewPrep.evaluationStatus;
export const selectMockSessionStatus = (state) => state.interviewPrep.mockSessionStatus;
export const selectMockTurnStatus = (state) => state.interviewPrep.mockTurnStatus;
export const selectReadinessStatus = (state) => state.interviewPrep.readinessStatus;
export const selectStudyTodayStatus = (state) => state.interviewPrep.studyTodayStatus;

export const selectPlansError = (state) => state.interviewPrep.plansError;
export const selectGenerateError = (state) => state.interviewPrep.generateError;
export const selectPlanDetailError = (state) => state.interviewPrep.planDetailError;
export const selectQuestionsError = (state) => state.interviewPrep.questionsError;
export const selectEvaluationError = (state) => state.interviewPrep.evaluationError;
export const selectMockSessionError = (state) => state.interviewPrep.mockSessionError;
export const selectMockTurnError = (state) => state.interviewPrep.mockTurnError;
export const selectReadinessError = (state) => state.interviewPrep.readinessError;
export const selectStudyTodayError = (state) => state.interviewPrep.studyTodayError;

import { createSelector } from "@reduxjs/toolkit";

/**
 * ---------------------------------------------------------
 * Base Selector
 * ---------------------------------------------------------
 */

export const selectResumeAIState = (state) => state.resumeAI;

/**
 * ---------------------------------------------------------
 * Analysis
 * ---------------------------------------------------------
 */

export const selectResumeAnalysis = createSelector(
    [selectResumeAIState],
    (resumeAI) => resumeAI.analysis
);

export const selectAnalyzedResumeId = createSelector(
    [selectResumeAIState],
    (resumeAI) => resumeAI.analyzedResumeId
);

export const selectResumeScores = createSelector(
    [selectResumeAnalysis],
    (analysis) => analysis?.scores ?? null
);

export const selectOverallScore = createSelector(
    [selectResumeScores],
    (scores) => scores?.overall_score ?? 0
);

/**
 * ---------------------------------------------------------
 * Resume Sections
 * ---------------------------------------------------------
 */

export const selectSummaryAnalysis = createSelector(
    [selectResumeAnalysis],
    (analysis) => analysis?.summary ?? null
);

export const selectExperienceAnalysis = createSelector(
    [selectResumeAnalysis],
    (analysis) => analysis?.experience ?? null
);

export const selectEducationAnalysis = createSelector(
    [selectResumeAnalysis],
    (analysis) => analysis?.education ?? null
);

export const selectProjectsAnalysis = createSelector(
    [selectResumeAnalysis],
    (analysis) => analysis?.projects ?? null
);

export const selectSkillsAnalysis = createSelector(
    [selectResumeAnalysis],
    (analysis) => analysis?.skills ?? null
);

export const selectCertificationsAnalysis = createSelector(
    [selectResumeAnalysis],
    (analysis) => analysis?.certifications ?? null
);

export const selectLanguagesAnalysis = createSelector(
    [selectResumeAnalysis],
    (analysis) => analysis?.languages ?? null
);

/**
 * ---------------------------------------------------------
 * Strengths / Weaknesses
 * ---------------------------------------------------------
 */

export const selectStrengths = createSelector(
    [selectResumeAnalysis],
    (analysis) => analysis?.strengths ?? []
);

export const selectWeaknesses = createSelector(
    [selectResumeAnalysis],
    (analysis) => analysis?.weaknesses ?? []
);

export const selectRecommendations = createSelector(
    [selectResumeAnalysis],
    (analysis) => analysis?.recommendations ?? []
);

export const selectMissingKeywords = createSelector(
    [selectResumeAnalysis],
    (analysis) => analysis?.missing_keywords ?? []
);

export const selectMissingSections = createSelector(
    [selectResumeAnalysis],
    (analysis) => analysis?.missing_sections ?? []
);

export const selectFinalFeedback = createSelector(
    [selectResumeAnalysis],
    (analysis) => analysis?.final_feedback ?? ""
);

/**
 * ---------------------------------------------------------
 * Improvement
 * ---------------------------------------------------------
 */

export const selectImprovedSection = createSelector(
    [selectResumeAIState],
    (resumeAI) => resumeAI.improvedSection
);

/**
 * ---------------------------------------------------------
 * Job Match
 * ---------------------------------------------------------
 */

export const selectJobMatch = createSelector(
    [selectResumeAIState],
    (resumeAI) => resumeAI.jobMatch
);

/**
 * ---------------------------------------------------------
 * Status
 * ---------------------------------------------------------
 */

export const selectAnalyzeStatus = createSelector(
    [selectResumeAIState],
    (resumeAI) => resumeAI.analyzeStatus
);

export const selectImproveStatus = createSelector(
    [selectResumeAIState],
    (resumeAI) => resumeAI.improveStatus
);

export const selectJobMatchStatus = createSelector(
    [selectResumeAIState],
    (resumeAI) => resumeAI.jobMatchStatus
);

/**
 * ---------------------------------------------------------
 * Loading
 * ---------------------------------------------------------
 */

export const selectIsAnalyzing = createSelector(
    [selectAnalyzeStatus],
    (status) => status === "pending"
);

export const selectIsImproving = createSelector(
    [selectImproveStatus],
    (status) => status === "pending"
);

export const selectIsJobMatching = createSelector(
    [selectJobMatchStatus],
    (status) => status === "pending"
);

export const selectIsLoading = createSelector(
    [
        selectIsAnalyzing,
        selectIsImproving,
        selectIsJobMatching,
    ],
    (analyzing, improving, matching) =>
        analyzing || improving || matching
);

/**
 * ---------------------------------------------------------
 * Error
 * ---------------------------------------------------------
 */

export const selectResumeAIError = createSelector(
    [selectResumeAIState],
    (resumeAI) => resumeAI.error
);

/**
 * ---------------------------------------------------------
 * Metadata
 * ---------------------------------------------------------
 */

export const selectLastUpdated = createSelector(
    [selectResumeAIState],
    (resumeAI) => resumeAI.lastUpdated
);

/**
 * ---------------------------------------------------------
 * Has Analysis
 * ---------------------------------------------------------
 */

export const selectHasAnalysis = createSelector(
    [selectResumeAnalysis],
    (analysis) => Boolean(analysis)
);

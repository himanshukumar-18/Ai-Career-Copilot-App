import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    analyzeResumeThunk,
    improveResumeSectionThunk,
    matchResumeJobThunk,
} from "../features/resumeAI/resumeAIThunk.js";

import {
    clearResumeAI,
    clearResumeAIError,
    clearImprovedSection,
    resetResumeAIStatus,
} from "../features/resumeAI/resumeAISlice";

import {
    selectResumeAnalysis,
    selectAnalyzedResumeId,
    selectResumeScores,
    selectOverallScore,
    selectStrengths,
    selectWeaknesses,
    selectRecommendations,
    selectMissingKeywords,
    selectMissingSections,
    selectFinalFeedback,

    selectSummaryAnalysis,
    selectExperienceAnalysis,
    selectEducationAnalysis,
    selectProjectsAnalysis,
    selectSkillsAnalysis,
    selectCertificationsAnalysis,
    selectLanguagesAnalysis,

    selectImprovedSection,
    selectJobMatch,

    selectAnalyzeStatus,
    selectImproveStatus,
    selectJobMatchStatus,

    selectIsAnalyzing,
    selectIsImproving,
    selectIsJobMatching,
    selectIsLoading,

    selectResumeAIError,
    selectLastUpdated,
    selectHasAnalysis,
} from "../features/resumeAI/resumeAISelectors";

/**
 * ---------------------------------------------------------
 * Resume AI Hook
 * ---------------------------------------------------------
 *
 * Components never interact with Redux directly.
 *
 * Everything should go through this hook.
 *
 * ---------------------------------------------------------
 */

const useResumeAI = () => {
    const dispatch = useDispatch();

    /* ----------------------------------------
     * Analysis
     * ---------------------------------------- */

    const analysis = useSelector(selectResumeAnalysis);

    const analyzedResumeId = useSelector(selectAnalyzedResumeId);

    const scores = useSelector(selectResumeScores);

    const overallScore = useSelector(selectOverallScore);

    /* ----------------------------------------
     * Sections
     * ---------------------------------------- */

    const summary = useSelector(selectSummaryAnalysis);

    const experience = useSelector(selectExperienceAnalysis);

    const education = useSelector(selectEducationAnalysis);

    const projects = useSelector(selectProjectsAnalysis);

    const skills = useSelector(selectSkillsAnalysis);

    const certifications = useSelector(selectCertificationsAnalysis);

    const languages = useSelector(selectLanguagesAnalysis);

    /* ----------------------------------------
     * Insights
     * ---------------------------------------- */

    const strengths = useSelector(selectStrengths);

    const weaknesses = useSelector(selectWeaknesses);

    const recommendations = useSelector(selectRecommendations);

    const missingKeywords = useSelector(selectMissingKeywords);

    const missingSections = useSelector(selectMissingSections);

    const finalFeedback = useSelector(selectFinalFeedback);

    /* ----------------------------------------
     * Improvement
     * ---------------------------------------- */

    const improvedSection = useSelector(selectImprovedSection);

    const jobMatch = useSelector(selectJobMatch);

    /* ----------------------------------------
     * Status
     * ---------------------------------------- */

    const analyzeStatus = useSelector(selectAnalyzeStatus);

    const improveStatus = useSelector(selectImproveStatus);

    const jobMatchStatus = useSelector(selectJobMatchStatus);

    const isAnalyzing = useSelector(selectIsAnalyzing);

    const isImproving = useSelector(selectIsImproving);

    const isJobMatching = useSelector(selectIsJobMatching);

    const loading = useSelector(selectIsLoading);

    /* ----------------------------------------
     * Metadata
     * ---------------------------------------- */

    const error = useSelector(selectResumeAIError);

    const lastUpdated = useSelector(selectLastUpdated);

    const hasAnalysis = useSelector(selectHasAnalysis);

    /* ----------------------------------------
     * Actions
     * ---------------------------------------- */

    const analyseResume = useCallback(
        (payload) =>
            dispatch(analyzeResumeThunk(payload)).unwrap(),
        [dispatch]
    );

    const improveSection = useCallback(
        (payload) =>
            dispatch(improveResumeSectionThunk(payload)).unwrap(),
        [dispatch]
    );

    const matchJobDescription = useCallback(
        (payload) =>
            dispatch(matchResumeJobThunk(payload)).unwrap(),
        [dispatch]
    );

    /* ----------------------------------------
     * Reset
     * ---------------------------------------- */

    const clearAnalysis = useCallback(
        () => dispatch(clearResumeAI()),
        [dispatch]
    );

    const clearError = useCallback(
        () => dispatch(clearResumeAIError()),
        [dispatch]
    );

    const clearImprovement = useCallback(
        (section) => dispatch(clearImprovedSection(section)),
        [dispatch]
    );

    const resetStatus = useCallback(
        () => dispatch(resetResumeAIStatus()),
        [dispatch]
    );

    /* ----------------------------------------
     * Public API
     * ---------------------------------------- */

    return {
        // Analysis
        analysis,
        analyzedResumeId,
        scores,
        overallScore,

        // Sections
        summary,
        experience,
        education,
        projects,
        skills,
        certifications,
        languages,

        // Insights
        strengths,
        weaknesses,
        recommendations,
        missingKeywords,
        missingSections,
        finalFeedback,

        // AI Improvement
        improvedSection,
        jobMatch,

        // Status
        analyzeStatus,
        improveStatus,
        jobMatchStatus,

        isAnalyzing,
        isImproving,
        isJobMatching,
        loading,

        // Metadata
        error,
        lastUpdated,
        hasAnalysis,

        // Actions
        analyseResume,
        improveSection,
        matchJobDescription,

        // Reset
        clearAnalysis,
        clearError,
        clearImprovement,
        resetStatus,
    };
};

export default useResumeAI;

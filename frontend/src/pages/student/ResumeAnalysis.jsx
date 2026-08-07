import { useCallback, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import ResumeAIError from "../../components/resume/ai/ResumeAIError";
import ResumeAIHeader from "../../components/resume/ai/ResumeAIHeader";
import ResumeAIKeywords from "../../components/resume/ai/ResumeAIKeywords";
import ResumeAILoading from "../../components/resume/ai/ResumeAILoading";
import ResumeAIRecommendations from "../../components/resume/ai/ResumeAIRecommendations";
import ResumeAIScoreCard from "../../components/resume/ai/ResumeAIScoreCard";
import ResumeAIScoreGrid from "../../components/resume/ai/ResumeAIScoreGrid";
import ResumeAISectionList from "../../components/resume/ai/ResumeAISectionList";
import ResumeAIStrengths from "../../components/resume/ai/ResumeAIStrengths";
import ResumeAIWeaknesses from "../../components/resume/ai/ResumeAIWeaknesses";
import { updateResumeSummaryThunk } from "../../features/summary/summaryThunk";
import { updateResumeSummaryInState } from "../../features/resume/resumeSlice";
import useResumeAI from "../../hooks/useResumeAI";
import { RESUME_LIST_PATH } from "../../routes/paths";

const getErrorMessage = (error, fallback) =>
    typeof error === "string" ? error : error?.message || error?.detail || fallback;

const ResumeAnalysis = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const resumeId = searchParams.get("resumeId");
    const {
        analysis,
        analyzedResumeId,
        scores,
        strengths,
        weaknesses,
        recommendations,
        missingKeywords,
        isAnalyzing,
        isImproving,
        analyzeStatus,
        error,
        lastUpdated,
        analyseResume,
        improveSection,
        clearError,
        clearImprovement,
    } = useResumeAI();

    const numericResumeId = useMemo(() => Number(resumeId), [resumeId]);
    const hasValidResumeId = Number.isInteger(numericResumeId) && numericResumeId > 0;
    const hasCurrentAnalysis = analyzedResumeId === numericResumeId && Boolean(analysis);

    const runAnalysis = useCallback(
        async (force = false) => {
            if (!hasValidResumeId) return;

            try {
                await analyseResume({ resumeId: numericResumeId, force });
            } catch {
                // The slice owns the normalized error shown below.
            }
        },
        [analyseResume, hasValidResumeId, numericResumeId]
    );

    useEffect(() => {
        runAnalysis();
    }, [runAnalysis]);

    const handleImprove = useCallback(
        async (section) => {
            if (!hasValidResumeId) return;

            try {
                const result = await improveSection({
                    resume_id: numericResumeId,
                    section,
                });

                toast.success(`${section === "summary" ? "Summary" : "Section"} improvement is ready to review.`);
                return result;
            } catch {
                return undefined;
            }
        },
        [hasValidResumeId, improveSection, numericResumeId]
    );

    const handleApply = useCallback(
        async (section, content) => {
            try {
                await dispatch(
                    updateResumeSummaryThunk({
                        resumeId: numericResumeId,
                        content,
                    })
                ).unwrap();
                dispatch(
                    updateResumeSummaryInState({
                        resumeId: numericResumeId,
                        content,
                    })
                );
                clearImprovement();
                toast.success("Professional summary updated.");
                await runAnalysis(true);
            } catch (applyError) {
                toast.error(getErrorMessage(applyError, "Unable to apply the improved summary."));
            }
        },
        [clearImprovement, dispatch, numericResumeId, runAnalysis]
    );

    if (!hasValidResumeId) {
        return (
            <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
                <ResumeAIError
                    title="Resume not selected"
                    message="Open AI Improve from a resume in the builder to analyse that resume."
                    onRetry={() => navigate(RESUME_LIST_PATH)}
                    onDismiss={() => navigate(RESUME_LIST_PATH)}
                />
            </main>
        );
    }

    return (
        <main className="mx-auto w-full">
            <div className="border border-zinc-800 bg-black">
                <ResumeAIHeader
                    onClose={() => navigate(-1)}
                    onAnalyze={() => runAnalysis(true)}
                    loading={isAnalyzing}
                    lastUpdated={lastUpdated}
                />

                <div className="p-5 sm:p-6 lg:p-7">
                    <AnimatePresence mode="wait">
                        {isAnalyzing && !hasCurrentAnalysis ? (
                            <ResumeAILoading key="loading" />
                        ) : analyzeStatus === "failed" ? (
                            <ResumeAIError
                                key="error"
                                message={getErrorMessage(error, "Unable to analyse this resume.")}
                                onRetry={() => runAnalysis(true)}
                                onDismiss={clearError}
                            />
                        ) : hasCurrentAnalysis ? (
                            <div key="analysis" className="space-y-5 sm:space-y-6">
                                <ResumeAIScoreCard
                                    score={scores?.overall_score}
                                    ats={scores?.ats_score}
                                    grammar={scores?.grammar_score}
                                    readability={scores?.readability_score}
                                    impact={scores?.impact_score}
                                />
                                <ResumeAIScoreGrid
                                    ats={scores?.ats_score}
                                    grammar={scores?.grammar_score}
                                    readability={scores?.readability_score}
                                    impact={scores?.impact_score}
                                />
                                <div className="grid gap-5 xl:grid-cols-2">
                                    <ResumeAIStrengths strengths={strengths} />
                                    <ResumeAIWeaknesses weaknesses={weaknesses} />
                                </div>
                                <div className="grid gap-5 xl:grid-cols-2">
                                    <ResumeAIKeywords keywords={missingKeywords} />
                                    <ResumeAIRecommendations
                                        recommendations={recommendations}
                                        onImprove={() => handleImprove("summary")}
                                        improving={isImproving}
                                    />
                                </div>
                                <ResumeAISectionList
                                    analysis={analysis}
                                    onImprove={handleImprove}
                                    onApply={handleApply}
                                    onReject={(section) => clearImprovement(section)}
                                    improving={isImproving}
                                />
                            </div>
                        ) : (
                            <ResumeAILoading key="initial-loading" />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
};

export default ResumeAnalysis;

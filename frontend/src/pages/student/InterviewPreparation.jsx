import React, { useEffect, useState } from "react";
import useInterviewPrep from "../../features/interviewPrep/useInterviewPrep";

import InterviewHeader from "../../components/interviewPrep/InterviewHeader";
import InterviewSetupModal from "../../components/interviewPrep/InterviewSetupModal";
import PreparationOverview from "../../components/interviewPrep/PreparationOverview";
import StudyTodayCard from "../../components/interviewPrep/StudyTodayCard";
import SkillGapAnalysis from "../../components/interviewPrep/SkillGapAnalysis";
import TopicList from "../../components/interviewPrep/TopicList";
import QuestionPractice from "../../components/interviewPrep/QuestionPractice";
import MockInterviewModal from "../../components/interviewPrep/MockInterviewModal";
import InterviewReadinessCard from "../../components/interviewPrep/InterviewReadinessCard";
import InterviewLoading, { InterviewSkeleton } from "../../components/interviewPrep/InterviewLoading";
import InterviewError from "../../components/interviewPrep/InterviewError";
import InterviewEmpty from "../../components/interviewPrep/InterviewEmpty";

import { Sparkles, BookOpen, HelpCircle, ShieldCheck, PlayCircle, Layers } from "lucide-react";

const TABS = [
    { id: "overview", label: "Overview & Strategy", icon: Layers },
    { id: "topics", label: "Topics & Resources", icon: BookOpen },
    { id: "questions", label: "Practice Questions", icon: HelpCircle },
    { id: "readiness", label: "Readiness Assessment", icon: ShieldCheck },
];

const InterviewPreparation = () => {
    const {
        plans,
        activePlan,
        questions,
        attemptsMap,
        mockSession,
        mockTurnResult,
        readiness,
        studyToday,

        plansStatus,
        generateStatus,
        planDetailStatus,
        questionsStatus,
        evaluationStatus,
        mockSessionStatus,
        mockTurnStatus,
        readinessStatus,

        plansError,
        generateError,
        questionsError,

        generatePrepPlan,
        fetchPrepPlans,
        fetchPrepPlanById,
        generateQuestions,
        submitAnswer,
        startMockSession,
        submitMockTurn,
        fetchReadiness,
        fetchStudyToday,
        setActivePlan,
        clearMockSession,
    } = useInterviewPrep();

    const [activeTab, setActiveTab] = useState("overview");
    const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
    const [isMockModalOpen, setIsMockModalOpen] = useState(false);

    // Initial load
    useEffect(() => {
        fetchPrepPlans();
        fetchStudyToday();
    }, [fetchPrepPlans, fetchStudyToday]);

    // Load active plan questions when plan changes
    useEffect(() => {
        if (activePlan?.id && (!questions || questions.length === 0)) {
            generateQuestions({ planId: activePlan.id, questionCount: 5 });
            fetchReadiness(activePlan.id);
        }
    }, [activePlan?.id]);

    const handleGeneratePlan = async (payload) => {
        const resultAction = await generatePrepPlan(payload);
        if (generatePrepPlanThunk.fulfilled.match(resultAction)) {
            setIsSetupModalOpen(false);
            setActiveTab("overview");
        }
    };

    const handleTopicGenerateQuestions = (topicId) => {
        if (!activePlan) return;
        setActiveTab("questions");
        generateQuestions({
            planId: activePlan.id,
            topicId,
            questionCount: 5,
        });
    };

    const handleSubmitAnswer = ({ questionId, userAnswer }) => {
        submitAnswer({ questionId, userAnswer });
    };

    const handleStartMockSession = (params) => {
        startMockSession(params);
    };

    const handleSubmitMockTurn = (params) => {
        submitMockTurn(params);
    };

    const handleCalculateReadiness = () => {
        if (activePlan?.id) {
            fetchReadiness(activePlan.id);
        }
    };

    const isInitialLoading = plansStatus === "pending" && !plans.length;
    const isGeneratingPlan = generateStatus === "pending";
    const isGeneratingQuestions = questionsStatus === "pending";
    const isEvaluatingAnswer = evaluationStatus === "pending";

    return (
        <div className="max-w-7xl mx-auto pb-16">
            {/* Top Header */}
            <InterviewHeader
                activePlan={activePlan}
                onOpenSetupModal={() => setIsSetupModalOpen(true)}
                isGenerating={isGeneratingPlan}
            />

            {/* Daily Focus Bar */}
            {studyToday && <StudyTodayCard studyToday={studyToday} />}

            {/* Error Banner */}
            {(plansError || generateError) && (
                <InterviewError
                    error={plansError || generateError}
                    onRetry={() => fetchPrepPlans()}
                />
            )}

            {/* Initial Loading Skeleton */}
            {isInitialLoading && <InterviewSkeleton />}

            {/* AI Generation Loading Banner */}
            {isGeneratingPlan && (
                <InterviewLoading message="Analyzing candidate profile, resume claims, and target role..." />
            )}

            {/* Empty State */}
            {!isInitialLoading && !isGeneratingPlan && !activePlan && (
                <InterviewEmpty onOpenSetupModal={() => setIsSetupModalOpen(true)} />
            )}

            {/* Active Preparation Plan Main Content */}
            {!isInitialLoading && !isGeneratingPlan && activePlan && (
                <div>
                    {/* Navigation Bar & Quick Action */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[var(--border)] pb-2">
                        {/* Tab Switcher */}
                        <div className="flex flex-wrap items-center gap-1">
                            {TABS.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`inline-flex items-center gap-2 px-4 py-3 font-mono text-xs uppercase tracking-wider transition-all border-b-2 ${
                                            isActive
                                                ? "border-[var(--accent)] text-white font-bold bg-[var(--surface)]"
                                                : "border-transparent text-[var(--text-muted)] hover:text-white"
                                        }`}
                                    >
                                        <Icon size={14} className={isActive ? "text-[var(--accent)]" : ""} />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Quick Start Mock Interview Trigger */}
                        <button
                            onClick={() => {
                                clearMockSession();
                                setIsMockModalOpen(true);
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)]/10 border border-[var(--accent)] text-[var(--accent-light)] hover:bg-[var(--accent)] hover:text-white font-mono text-xs uppercase tracking-wider transition-all"
                        >
                            <PlayCircle size={14} />
                            <span>Start AI Mock Interview</span>
                        </button>
                    </div>

                    {/* Tab 1: Overview & Strategy */}
                    {activeTab === "overview" && (
                        <div>
                            <PreparationOverview activePlan={activePlan} />
                            <SkillGapAnalysis topics={activePlan.topics || []} />
                        </div>
                    )}

                    {/* Tab 2: Topics & Resources */}
                    {activeTab === "topics" && (
                        <TopicList
                            topics={activePlan.topics || []}
                            onGenerateQuestions={handleTopicGenerateQuestions}
                            isGeneratingQuestions={isGeneratingQuestions}
                        />
                    )}

                    {/* Tab 3: Practice Questions */}
                    {activeTab === "questions" && (
                        <QuestionPractice
                            questions={questions}
                            attemptsMap={attemptsMap}
                            onSubmitAnswer={handleSubmitAnswer}
                            onGenerateQuestions={() =>
                                generateQuestions({ planId: activePlan.id, questionCount: 5 })
                            }
                            isGenerating={isGeneratingQuestions}
                            isEvaluating={isEvaluatingAnswer}
                        />
                    )}

                    {/* Tab 4: Readiness Assessment */}
                    {activeTab === "readiness" && (
                        <InterviewReadinessCard
                            readiness={readiness}
                            onCalculateReadiness={handleCalculateReadiness}
                            isCalculating={readinessStatus === "pending"}
                        />
                    )}
                </div>
            )}

            {/* Setup Modal */}
            <InterviewSetupModal
                isOpen={isSetupModalOpen}
                onClose={() => setIsSetupModalOpen(false)}
                onGenerate={handleGeneratePlan}
                isGenerating={isGeneratingPlan}
            />

            {/* Mock Interview Modal */}
            <MockInterviewModal
                isOpen={isMockModalOpen}
                onClose={() => setIsMockModalOpen(false)}
                activePlan={activePlan}
                mockSession={mockSession}
                mockTurnResult={mockTurnResult}
                onStartMockSession={handleStartMockSession}
                onSubmitMockTurn={handleSubmitMockTurn}
                isStarting={mockSessionStatus === "pending"}
                isSubmittingTurn={mockTurnStatus === "pending"}
            />
        </div>
    );
};

export default InterviewPreparation;

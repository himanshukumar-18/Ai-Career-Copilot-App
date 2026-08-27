import React from "react";
import { Sparkles, Plus, RefreshCw } from "lucide-react";

const InterviewHeader = ({
    activePlan,
    onOpenSetupModal,
    isGenerating,
}) => {
    return (
        <div className="border border-[var(--border)] bg-[var(--surface)] p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="p-1.5 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                        <Sparkles size={16} />
                    </span>
                    <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent)]">
                        AI Mentor Gap Analysis
                    </span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                    AI Interview Preparation
                </h1>
                <p className="mt-1 text-sm text-[var(--text-muted)] max-w-xl">
                    Personalized interview topics, resume & project probing questions, real-time AI answer evaluation, and adaptive mock interviews.
                </p>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={onOpenSetupModal}
                    disabled={isGenerating}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 border border-[var(--accent)] bg-[var(--accent)] text-white font-mono text-xs uppercase tracking-[0.15em] hover:bg-[var(--accent-light)] transition-all disabled:opacity-50"
                >
                    {isGenerating ? (
                        <>
                            <RefreshCw size={14} className="animate-spin" />
                            <span>Analyzing Profile...</span>
                        </>
                    ) : (
                        <>
                            <Plus size={14} />
                            <span>{activePlan ? "New Target Role / JD" : "Generate Prep Plan"}</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default InterviewHeader;

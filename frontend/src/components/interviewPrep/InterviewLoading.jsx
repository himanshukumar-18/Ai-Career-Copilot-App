import React from "react";
import { Sparkles } from "lucide-react";

export const InterviewSkeleton = () => {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-32 bg-[var(--surface)] border border-[var(--border)]" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="h-28 bg-[var(--surface)] border border-[var(--border)]" />
                <div className="h-28 bg-[var(--surface)] border border-[var(--border)]" />
                <div className="h-28 bg-[var(--surface)] border border-[var(--border)]" />
                <div className="h-28 bg-[var(--surface)] border border-[var(--border)]" />
            </div>
            <div className="h-48 bg-[var(--surface)] border border-[var(--border)]" />
        </div>
    );
};

export const InterviewLoading = ({ message = "Analyzing candidate profile & synthesizing interview plan..." }) => {
    return (
        <div className="border border-[var(--border)] bg-[var(--surface)] p-12 text-center my-8">
            <div className="inline-flex p-4 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 mb-4 animate-bounce">
                <Sparkles size={28} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-mono uppercase tracking-wider">
                AI Mentor Synthesizing Plan
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-mono max-w-md mx-auto mb-6">
                {message}
            </p>

            <div className="max-w-xs mx-auto space-y-2 text-left font-mono text-xs text-[var(--text-secondary)]">
                <div className="flex items-center gap-2">
                    <span className="text-[var(--success)]">✓</span>
                    <span>Aggregating Profile & Skills</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[var(--success)]">✓</span>
                    <span>Reviewing Resume Claims & Portfolio Projects</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[var(--accent)] animate-pulse">○</span>
                    <span>Building Priority Topics & Resources</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                    <span>○</span>
                    <span>Generating Tailored Question Bank</span>
                </div>
            </div>
        </div>
    );
};

export default InterviewLoading;

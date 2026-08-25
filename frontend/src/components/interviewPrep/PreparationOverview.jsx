import React from "react";
import { Target, Award, ListChecks, HelpCircle, Building } from "lucide-react";

const PreparationOverview = ({ activePlan }) => {
    if (!activePlan) return null;

    const {
        target_role,
        experience_level,
        company_name,
        summary,
        overall_readiness_score,
        topics = [],
    } = activePlan;

    return (
        <div className="border border-[var(--border)] bg-[var(--surface)] p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                {/* Overall Readiness Score Card */}
                <div className="border border-[var(--border)] bg-[var(--background)] p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                            Baseline Readiness
                        </span>
                        <Award size={18} className="text-[var(--accent)]" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold font-mono text-white">
                            {overall_readiness_score}%
                        </span>
                        <span className="text-xs text-[var(--text-muted)] font-mono">Target: 85%+</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--border)] mt-3 overflow-hidden">
                        <div
                            className="h-full bg-[var(--accent)] transition-all duration-500"
                            style={{ width: `${Math.min(overall_readiness_score, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Target Role & Level */}
                <div className="border border-[var(--border)] bg-[var(--background)] p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                            Target Career Role
                        </span>
                        <Target size={18} className="text-[var(--accent-light)]" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-white tracking-tight line-clamp-1">
                            {target_role}
                        </h3>
                        <p className="text-xs text-[var(--text-muted)] capitalize font-mono mt-0.5">
                            Level: {experience_level}
                        </p>
                    </div>
                </div>

                {/* Target Company */}
                <div className="border border-[var(--border)] bg-[var(--background)] p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                            Target Company
                        </span>
                        <Building size={18} className="text-[var(--text-secondary)]" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-white tracking-tight">
                            {company_name || "General Market Standard"}
                        </h3>
                        <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                            Industry Benchmarked
                        </p>
                    </div>
                </div>

                {/* Total Focus Topics */}
                <div className="border border-[var(--border)] bg-[var(--background)] p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                            Structured Topics
                        </span>
                        <ListChecks size={18} className="text-[var(--success)]" />
                    </div>
                    <div>
                        <span className="text-3xl font-bold font-mono text-white">
                            {topics.length}
                        </span>
                        <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                            Focus Diagnostic Areas
                        </p>
                    </div>
                </div>
            </div>

            {/* AI Executive Summary */}
            {summary && (
                <div className="border-t border-[var(--border)] pt-4">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--accent)] mb-1">
                        AI Mentor Strategy Summary
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-mono">
                        {typeof summary === "object" ? summary?.content || summary?.summary || "" : String(summary)}
                    </p>
                </div>
            )}
        </div>
    );
};

export default PreparationOverview;

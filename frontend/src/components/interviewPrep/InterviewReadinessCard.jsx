import React from "react";
import { ShieldCheck, Award, Sparkles, TrendingUp, AlertTriangle } from "lucide-react";

const InterviewReadinessCard = ({ readiness, onCalculateReadiness, isCalculating }) => {
    if (!readiness) {
        return (
            <div className="border border-[var(--border)] bg-[var(--surface)] p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-base font-bold text-white mb-1">
                        Holistic Interview Readiness Score
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] font-mono">
                        Calculate your multi-dimensional readiness across Technical, Behavioral, and Portfolio Project parameters.
                    </p>
                </div>
                <button
                    onClick={onCalculateReadiness}
                    disabled={isCalculating}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white font-mono text-xs uppercase tracking-wider hover:bg-[var(--accent-light)] transition-all disabled:opacity-50"
                >
                    <Sparkles size={14} />
                    <span>{isCalculating ? "Calculating..." : "Assess Readiness"}</span>
                </button>
            </div>
        );
    }

    const {
        technical_score = 50,
        behavioral_score = 50,
        project_score = 50,
        overall_score = 50,
        weak_areas = [],
        recommendation = "",
    } = readiness;

    return (
        <div className="border border-[var(--border)] bg-[var(--surface)] p-6 mb-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--border)]">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck size={18} className="text-[var(--accent)]" />
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-bold">
                            Multi-Dimensional Assessment
                        </span>
                    </div>
                    <h2 className="text-xl font-bold text-white">
                        Interview Readiness Score: <span className="text-[var(--accent-light)]">{overall_score}%</span>
                    </h2>
                </div>

                <button
                    onClick={onCalculateReadiness}
                    disabled={isCalculating}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text-secondary)] hover:text-white font-mono uppercase tracking-wider"
                >
                    <TrendingUp size={12} />
                    <span>Recalculate</span>
                </button>
            </div>

            {/* Score Progress Bars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Technical Readiness */}
                <div className="border border-[var(--border)] bg-[var(--background)] p-4">
                    <div className="flex justify-between font-mono text-xs text-[var(--text-muted)] mb-2">
                        <span>Technical Proficiency</span>
                        <span className="text-white font-bold">{technical_score}%</span>
                    </div>
                    <div className="h-2 bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-500"
                            style={{ width: `${technical_score}%` }}
                        />
                    </div>
                </div>

                {/* Behavioral & Communication */}
                <div className="border border-[var(--border)] bg-[var(--background)] p-4">
                    <div className="flex justify-between font-mono text-xs text-[var(--text-muted)] mb-2">
                        <span>Behavioral & STAR Structure</span>
                        <span className="text-white font-bold">{behavioral_score}%</span>
                    </div>
                    <div className="h-2 bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
                        <div
                            className="h-full bg-amber-500 transition-all duration-500"
                            style={{ width: `${behavioral_score}%` }}
                        />
                    </div>
                </div>

                {/* Project-Lab Confidence */}
                <div className="border border-[var(--border)] bg-[var(--background)] p-4">
                    <div className="flex justify-between font-mono text-xs text-[var(--text-muted)] mb-2">
                        <span>Project Architecture Confidence</span>
                        <span className="text-white font-bold">{project_score}%</span>
                    </div>
                    <div className="h-2 bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
                        <div
                            className="h-full bg-green-500 transition-all duration-500"
                            style={{ width: `${project_score}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Weak Areas & Recommendation */}
            {weak_areas.length > 0 && (
                <div className="mb-4">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--warning)] mb-2 flex items-center gap-1">
                        <AlertTriangle size={14} /> Identified Priority Gaps
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {weak_areas.map((wa, idx) => (
                            <span key={idx} className="px-2 py-1 bg-[var(--background)] border border-[var(--warning)]/40 text-xs font-mono text-white">
                                {wa}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {recommendation && (
                <div className="border-t border-[var(--border)] pt-4">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--accent)] mb-1">
                        Executive AI Recommendation
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] font-mono leading-relaxed">
                        {recommendation}
                    </p>
                </div>
            )}
        </div>
    );
};

export default InterviewReadinessCard;

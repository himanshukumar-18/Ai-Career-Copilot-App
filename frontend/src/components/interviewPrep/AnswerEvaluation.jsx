import React from "react";
import { CheckCircle2, XCircle, Award, Lightbulb, AlertTriangle } from "lucide-react";

const AnswerEvaluation = ({ evaluation }) => {
    if (!evaluation) return null;

    const {
        score,
        is_correct,
        strengths = [],
        weaknesses = [],
        missing_points = [],
        ideal_answer,
        improvement_tips = [],
    } = evaluation;

    const getScoreColor = (val) => {
        if (val >= 80) return "text-[var(--success)] border-[var(--success)]";
        if (val >= 60) return "text-[var(--warning)] border-[var(--warning)]";
        return "text-[var(--danger)] border-[var(--danger)]";
    };

    return (
        <div className="border border-[var(--border)] bg-[var(--background)] p-5 mt-4 space-y-5 animate-fadeIn">
            {/* Score & Verdict Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 border-2 rounded-full flex items-center justify-center font-mono font-bold text-lg ${getScoreColor(score)}`}>
                        {score}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            {is_correct ? (
                                <span className="inline-flex items-center gap-1 font-mono text-xs text-[var(--success)] uppercase font-bold">
                                    <CheckCircle2 size={14} /> Passed Criteria
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 font-mono text-xs text-[var(--danger)] uppercase font-bold">
                                    <XCircle size={14} /> Needs Revision
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                            Evaluated by AI Technical Recruiter
                        </p>
                    </div>
                </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                {strengths.length > 0 && (
                    <div className="border border-[var(--success)]/30 bg-[var(--success)]/5 p-4">
                        <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--success)] mb-2 flex items-center gap-1">
                            <CheckCircle2 size={14} /> Key Strengths Identified
                        </h4>
                        <ul className="space-y-1.5">
                            {strengths.map((item, idx) => (
                                <li key={idx} className="text-xs text-[var(--text-primary)] font-mono flex items-start gap-2">
                                    <span className="text-[var(--success)]">+</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Weaknesses / Gaps */}
                {weaknesses.length > 0 && (
                    <div className="border border-[var(--warning)]/30 bg-[var(--warning)]/5 p-4">
                        <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--warning)] mb-2 flex items-center gap-1">
                            <AlertTriangle size={14} /> Inaccuracies & Gaps
                        </h4>
                        <ul className="space-y-1.5">
                            {weaknesses.map((item, idx) => (
                                <li key={idx} className="text-xs text-[var(--text-primary)] font-mono flex items-start gap-2">
                                    <span className="text-[var(--warning)]">-</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Missing Points */}
            {missing_points.length > 0 && (
                <div className="border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-4">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--accent)] mb-2">
                        Missing Concepts / Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {missing_points.map((mp, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-[var(--surface)] border border-[var(--accent)]/40 text-xs text-white font-mono">
                                {mp}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Ideal Answer Guidance */}
            {ideal_answer && (
                <div className="border border-[var(--border)] p-4 bg-[var(--surface)]">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2 flex items-center gap-1">
                        <Award size={14} className="text-[var(--accent)]" /> Model Ideal Answer
                    </h4>
                    <p className="text-xs text-[var(--text-primary)] font-mono leading-relaxed whitespace-pre-line">
                        {ideal_answer}
                    </p>
                </div>
            )}

            {/* Improvement Tips */}
            {improvement_tips.length > 0 && (
                <div className="border border-[var(--border)] p-4 bg-[var(--surface)]">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--warning)] mb-2 flex items-center gap-1">
                        <Lightbulb size={14} /> Actionable Tips for Next Attempt
                    </h4>
                    <ul className="space-y-1">
                        {improvement_tips.map((tip, idx) => (
                            <li key={idx} className="text-xs text-[var(--text-secondary)] font-mono flex items-start gap-2">
                                <span className="text-[var(--warning)]">💡</span>
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AnswerEvaluation;

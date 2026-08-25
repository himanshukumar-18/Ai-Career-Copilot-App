import React from "react";
import { Award, CheckCircle, ArrowRight, RotateCcw } from "lucide-react";

const MockInterviewReport = ({ session, turns = [], onClose }) => {
    if (!session) return null;

    const {
        title,
        category,
        overall_score,
        feedback,
    } = session;

    return (
        <div className="space-y-6">
            {/* Header Score Banner */}
            <div className="border border-[var(--accent)]/40 bg-[var(--accent)]/5 p-6 text-center">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
                    Session Completed Report
                </span>
                <h3 className="text-xl font-bold text-white mt-1 mb-3">{title}</h3>

                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-[var(--accent)] text-3xl font-bold font-mono text-white mb-3">
                    {overall_score}%
                </div>

                <p className="text-xs text-[var(--text-secondary)] font-mono max-w-lg mx-auto leading-relaxed">
                    {feedback}
                </p>
            </div>

            {/* Turn-by-Turn Breakdown */}
            <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-3">
                    Turn-by-Turn Responses ({turns.length})
                </h4>
                <div className="space-y-3">
                    {turns.map((t, idx) => (
                        <div key={t.id || idx} className="border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-xs">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[var(--accent)] uppercase font-bold">
                                    Turn #{t.turn_index}
                                </span>
                                <span className="text-white font-bold border border-[var(--border)] px-2 py-0.5">
                                    Score: {t.score}%
                                </span>
                            </div>
                            <p className="text-white font-bold mb-2">Q: {t.question_text}</p>
                            <p className="text-[var(--text-muted)] mb-2 italic">A: "{t.user_answer || "No response provided"}"</p>
                            {t.evaluation && (
                                <p className="text-[var(--text-secondary)] pt-2 border-t border-[var(--border)]">
                                    Feedback: {t.evaluation}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Close / Retake Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-[var(--accent)] text-white text-xs font-mono uppercase tracking-wider hover:bg-[var(--accent-light)] transition-all"
                >
                    Close Report
                </button>
            </div>
        </div>
    );
};

export default MockInterviewReport;

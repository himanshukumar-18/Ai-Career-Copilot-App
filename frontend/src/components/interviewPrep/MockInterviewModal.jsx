import React, { useState } from "react";
import { X, Sparkles, Send, RefreshCw, AlertCircle } from "lucide-react";
import MockInterviewReport from "./MockInterviewReport";

const MockInterviewModal = ({
    isOpen,
    onClose,
    activePlan,
    mockSession,
    mockTurnResult,
    onStartMockSession,
    onSubmitMockTurn,
    isStarting,
    isSubmittingTurn,
}) => {
    const [category, setCategory] = useState("technical");
    const [totalQuestions, setTotalQuestions] = useState(5);
    const [userAnswer, setUserAnswer] = useState("");

    if (!isOpen) return null;

    // Check if session completed
    const isFinished = mockTurnResult?.is_finished || mockSession?.status === "completed";
    const currentSession = mockTurnResult?.session || mockSession;
    const turnsList = currentSession?.turns || [];

    // Current active turn question
    const currentQuestionText =
        mockTurnResult?.next_question ||
        (turnsList.length > 0 ? turnsList[turnsList.length - 1].question_text : "");
    const currentTurnIndex =
        mockTurnResult?.next_turn_index ||
        currentSession?.current_question_index || 1;

    const handleStart = (e) => {
        e.preventDefault();
        if (!activePlan) return;

        onStartMockSession({
            planId: activePlan.id,
            category,
            totalQuestions,
        });
    };

    const handleTurnSubmit = (e) => {
        e.preventDefault();
        if (!userAnswer.trim() || !currentSession || isSubmittingTurn) return;

        onSubmitMockTurn({
            sessionId: currentSession.id,
            userAnswer: userAnswer.trim(),
        });
        setUserAnswer("");
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 overflow-y-auto">
            <div className="border border-[var(--border)] bg-[var(--surface)] w-full max-w-3xl p-6 sm:p-8 relative shadow-2xl my-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Setup state */}
                {!currentSession && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={16} className="text-[var(--accent)]" />
                            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
                                Adaptive AI Mock Interview
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">
                            Start Real-Time Mock Interview
                        </h2>
                        <p className="text-xs text-[var(--text-muted)] font-mono mb-6">
                            The AI interviewer evaluates each response in real time and adaptively adjusts difficulty or asks architectural follow-ups.
                        </p>

                        <form onSubmit={handleStart} className="space-y-6">
                            <div>
                                <label className="block font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                                    Interview Category
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-[var(--background)] border border-[var(--border)] px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-[var(--accent)]"
                                >
                                    <option value="technical">Technical & System Architecture</option>
                                    <option value="behavioral">Behavioral & STAR Method</option>
                                    <option value="system_design">System Design & Scaling</option>
                                    <option value="coding">Coding & Algorithms</option>
                                    <option value="domain_knowledge">Domain Knowledge</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                                    Total Question Turns
                                </label>
                                <select
                                    value={totalQuestions}
                                    onChange={(e) => setTotalQuestions(Number(e.target.value))}
                                    className="w-full bg-[var(--background)] border border-[var(--border)] px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-[var(--accent)]"
                                >
                                    <option value={3}>3 Turns (Quick Session)</option>
                                    <option value={5}>5 Turns (Standard Session)</option>
                                    <option value={8}>8 Turns (Full Technical Loop)</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-5 py-2.5 border border-[var(--border)] text-xs font-mono uppercase text-[var(--text-muted)] hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isStarting}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--accent)] text-white text-xs font-mono uppercase tracking-wider hover:bg-[var(--accent-light)] transition-all disabled:opacity-50"
                                >
                                    {isStarting ? (
                                        <>
                                            <RefreshCw size={14} className="animate-spin" />
                                            <span>Initializing AI Session...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={14} />
                                            <span>Begin Mock Interview</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Session Report Finished State */}
                {currentSession && isFinished && (
                    <MockInterviewReport
                        session={currentSession}
                        turns={turnsList}
                        onClose={onClose}
                    />
                )}

                {/* In Progress Turn State */}
                {currentSession && !isFinished && (
                    <div className="space-y-6">
                        {/* Progress Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] font-mono text-xs">
                            <span className="text-[var(--accent)] uppercase font-bold">
                                Question {currentTurnIndex} of {currentSession.total_questions}
                            </span>
                            <span className="text-[var(--text-muted)] uppercase">
                                Category: {currentSession.category}
                            </span>
                        </div>

                        {/* Last Turn Feedback snippet if available */}
                        {mockTurnResult?.completed_turn_evaluation && (
                            <div className="border border-[var(--success)]/30 bg-[var(--success)]/5 p-4 text-xs font-mono text-white">
                                <span className="text-[var(--success)] font-bold">
                                    Last Turn Score: {mockTurnResult.completed_turn_score}% —{" "}
                                </span>
                                <span>{mockTurnResult.completed_turn_evaluation}</span>
                            </div>
                        )}

                        {/* Current Question Display */}
                        <div className="border border-[var(--border)] bg-[var(--background)] p-6">
                            <span className="font-mono text-[10px] uppercase text-[var(--accent)] font-bold block mb-2">
                                AI Interviewer Asks:
                            </span>
                            <h3 className="text-lg font-bold text-white leading-relaxed">
                                {currentQuestionText}
                            </h3>
                        </div>

                        {/* Turn Answer Submission */}
                        <form onSubmit={handleTurnSubmit} className="space-y-4">
                            <div>
                                <label className="block font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                                    Your Response
                                </label>
                                <textarea
                                    rows={5}
                                    required
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    placeholder="Speak or type your full response here..."
                                    className="w-full bg-[var(--background)] border border-[var(--border)] p-4 text-xs text-white font-mono focus:outline-none focus:border-[var(--accent)]"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={!userAnswer.trim() || isSubmittingTurn}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--accent)] text-white text-xs font-mono uppercase tracking-wider hover:bg-[var(--accent-light)] transition-all disabled:opacity-50"
                                >
                                    {isSubmittingTurn ? (
                                        <>
                                            <RefreshCw size={14} className="animate-spin" />
                                            <span>Evaluating Turn & Generating Follow-up...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={14} />
                                            <span>Submit Turn Answer</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MockInterviewModal;

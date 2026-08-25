import React, { useState } from "react";
import { Send, RefreshCw, FileText, Code2, ShieldAlert } from "lucide-react";
import AnswerEvaluation from "./AnswerEvaluation";

const getSourceBadge = (sourceType) => {
    switch (sourceType) {
        case "resume_based":
            return "bg-blue-500/10 text-blue-400 border-blue-500/40";
        case "project_based":
            return "bg-green-500/10 text-green-400 border-green-500/40";
        case "jd_specific":
            return "bg-purple-500/10 text-purple-400 border-purple-500/40";
        case "behavioral":
            return "bg-amber-500/10 text-amber-400 border-amber-500/40";
        default:
            return "bg-gray-500/10 text-gray-400 border-gray-500/40";
    }
};

const QuestionCard = ({
    question,
    attempt,
    onSubmitAnswer,
    isEvaluating,
}) => {
    const [userAnswer, setUserAnswer] = useState("");
    const [showInput, setShowInput] = useState(true);

    const {
        id,
        question_text,
        category,
        difficulty,
        source_type,
        ideal_answer_outline,
    } = question;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!userAnswer.trim() || isEvaluating) return;

        onSubmitAnswer({
            questionId: id,
            userAnswer: userAnswer.trim(),
        });
    };

    return (
        <div className="border border-[var(--border)] bg-[var(--surface)] p-6 mb-6">
            {/* Metadata Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-[var(--border)]">
                <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider border ${getSourceBadge(source_type)}`}>
                        {source_type.replace("_", " ")}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border border-[var(--border)] text-[var(--text-muted)]">
                        {category}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border border-[var(--border)] text-[var(--text-muted)]">
                        {difficulty}
                    </span>
                </div>
            </div>

            {/* Question Text */}
            <h3 className="text-base font-bold text-white mb-4 leading-snug">
                {question_text}
            </h3>

            {/* Answer Input Form */}
            {showInput && (
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                            Write Your Response / Solution
                        </label>
                        <textarea
                            rows={5}
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Type your explanation, trade-offs, code snippet, or STAR method response..."
                            className="w-full bg-[var(--background)] border border-[var(--border)] p-4 text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent)] transition-all resize-y"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={!userAnswer.trim() || isEvaluating}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--accent)] text-white text-xs font-mono uppercase tracking-wider hover:bg-[var(--accent-light)] transition-all disabled:opacity-50"
                        >
                            {isEvaluating ? (
                                <>
                                    <RefreshCw size={14} className="animate-spin" />
                                    <span>AI Evaluating Response...</span>
                                </>
                            ) : (
                                <>
                                    <Send size={14} />
                                    <span>Submit Answer to AI</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}

            {/* Display Evaluation Result */}
            {attempt && <AnswerEvaluation evaluation={attempt} />}
        </div>
    );
};

export default QuestionCard;

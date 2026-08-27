import React from "react";
import QuestionCard from "./QuestionCard";
import { HelpCircle, Sparkles, RefreshCw } from "lucide-react";

const QuestionPractice = ({
    questions = [],
    attemptsMap = {},
    onSubmitAnswer,
    onGenerateQuestions,
    isGenerating,
    isEvaluating,
}) => {
    if (!questions.length) {
        return (
            <div className="border border-[var(--border)] bg-[var(--surface)] p-8 text-center my-6">
                <HelpCircle size={32} className="mx-auto text-[var(--text-muted)] mb-3" />
                <h3 className="text-base font-bold text-white mb-1">
                    No Practice Questions Generated
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono max-w-md mx-auto mb-6">
                    Click below to generate personalized technical, resume-based, project-based, and JD interview questions.
                </p>
                <button
                    onClick={() => onGenerateQuestions()}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white text-xs font-mono uppercase tracking-wider hover:bg-[var(--accent-light)] transition-all disabled:opacity-50"
                >
                    {isGenerating ? (
                        <>
                            <RefreshCw size={14} className="animate-spin" />
                            <span>Generating Questions...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles size={14} />
                            <span>Generate Question Bank</span>
                        </>
                    )}
                </button>
            </div>
        );
    }

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">
                        AI Practice Questions ({questions.length})
                    </h2>
                    <p className="text-xs text-[var(--text-muted)] font-mono">
                        Targeted questions probing your technical skills, resume claims, and project choices.
                    </p>
                </div>

                <button
                    onClick={() => onGenerateQuestions()}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-white text-xs font-mono uppercase tracking-wider transition-all disabled:opacity-50"
                >
                    <Sparkles size={12} className="text-[var(--accent)]" />
                    <span>Generate More</span>
                </button>
            </div>

            <div>
                {questions.map((q) => (
                    <QuestionCard
                        key={q.id}
                        question={q}
                        attempt={attemptsMap[q.id]}
                        onSubmitAnswer={onSubmitAnswer}
                        isEvaluating={isEvaluating}
                    />
                ))}
            </div>
        </div>
    );
};

export default QuestionPractice;

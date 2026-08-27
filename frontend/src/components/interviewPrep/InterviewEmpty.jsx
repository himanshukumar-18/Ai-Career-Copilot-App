import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

const InterviewEmpty = ({ onOpenSetupModal }) => {
    return (
        <div className="border border-[var(--border)] bg-[var(--surface)] p-12 text-center my-8">
            <div className="inline-flex p-4 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 mb-4">
                <Sparkles size={32} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
                No Active Interview Preparation Plan
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-mono max-w-lg mx-auto mb-8 leading-relaxed">
                Select your target career role or paste a job description. The AI Career Mentor will synthesize a custom interview preparation roadmap, technical probing questions, and adaptive mock interview loops.
            </p>

            <button
                onClick={onOpenSetupModal}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[var(--accent)] text-white text-xs font-mono uppercase tracking-widest hover:bg-[var(--accent-light)] transition-all shadow-lg"
            >
                <span>Generate Preparation Plan</span>
                <ArrowRight size={14} />
            </button>
        </div>
    );
};

export default InterviewEmpty;

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

const InterviewError = ({ error, onRetry }) => {
    return (
        <div className="border border-red-500/40 bg-red-500/5 p-8 text-center my-8">
            <AlertTriangle size={32} className="mx-auto text-red-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2 font-mono uppercase tracking-wider">
                Operation Could Not Be Completed
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-mono max-w-md mx-auto mb-6">
                {error || "Your interview preparation request failed. Your profile and context are safe."}
            </p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white font-mono text-xs uppercase tracking-wider hover:bg-[var(--accent-light)] transition-all"
                >
                    <RefreshCw size={14} />
                    <span>Try Again</span>
                </button>
            )}
        </div>
    );
};

export default InterviewError;

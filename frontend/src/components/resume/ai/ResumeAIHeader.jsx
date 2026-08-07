import { motion } from "framer-motion";
import {
    BrainCircuit,
    Sparkles,
    Clock3,
    X,
} from "lucide-react";

import Button from "../../ui/Button";

const ResumeAIHeader = ({
    onClose,
    onAnalyze,
    loading = false,
    lastUpdated,
}) => {
    return (
        <header className="border-b border-zinc-800 bg-zinc-950">
            <div className="flex flex-col gap-6 px-5 py-5 sm:px-6 lg:px-7">
                {/* Top Row */}
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.32em] text-red-600">
                            AI Resume Copilot
                        </p>

                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center border border-zinc-800 bg-black">
                                <BrainCircuit
                                    size={22}
                                    className="text-red-600"
                                />
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                                    Resume Analysis
                                </h2>

                                <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-500">
                                    Analyze your resume using AI, discover ATS
                                    issues, improve every section, and receive
                                    recruiter-focused recommendations.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <motion.div whileTap={{ scale: 0.97 }}>
                            <Button
                                onClick={onAnalyze}
                                disabled={loading}
                                className="h-11 min-w-[180px]"
                            >
                                <Sparkles size={16} />

                                {loading
                                    ? "Analyzing..."
                                    : "Analyze Resume"}
                            </Button>
                        </motion.div>

                        <motion.div whileTap={{ scale: 0.96 }}>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex h-11 w-11 items-center justify-center border border-zinc-800 bg-black transition hover:border-red-600 hover:text-red-500"
                            >
                                <X size={18} />
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Status */}
                <div className="flex flex-col gap-3 border-t border-zinc-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                        <div className="flex items-center gap-2">
                            <Clock3 size={14} />

                            <span>
                                {lastUpdated
                                    ? `Last analyzed ${new Date(
                                        lastUpdated
                                    ).toLocaleString()}`
                                    : "Resume has not been analyzed yet"}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-600" />

                        <span className="text-[11px] uppercase tracking-[0.25em] text-zinc-500">
                            AI Powered by LangChain + Groq
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ResumeAIHeader;
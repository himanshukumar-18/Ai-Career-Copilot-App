import { motion } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";

const CareerRoadmapHeader = ({
    activeRoleTitle,
    onRegenerate,
    isGenerating,
}) => {
    return (
        <div className="flex flex-col gap-6 border border-zinc-800 bg-[var(--surface)] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-red-500/30 bg-red-500/10 text-red-500">
                    <Sparkles className="h-6 w-6" />
                </div>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-black uppercase tracking-wider text-white sm:text-3xl">
                            AI Career Roadmap
                        </h1>
                        {activeRoleTitle && (
                            <span className="hidden border border-red-500/40 bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest text-red-400 sm:inline-block">
                                {activeRoleTitle}
                            </span>
                        )}
                    </div>
                    <p className="mt-1 text-sm text-zinc-400">
                        Step-by-step personalized learning path powered by AI mentor gap analysis.
                    </p>
                </div>
            </div>

            {activeRoleTitle && onRegenerate && (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onRegenerate}
                    disabled={isGenerating}
                    className="flex items-center justify-center gap-2 border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-200 transition-colors hover:border-red-500 hover:text-white disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 text-red-500 ${isGenerating ? "animate-spin" : ""}`} />
                    <span>{isGenerating ? "Regenerating..." : "Regenerate Path"}</span>
                </motion.button>
            )}
        </div>
    );
};

export default CareerRoadmapHeader;

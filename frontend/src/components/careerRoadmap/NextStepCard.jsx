import { motion } from "framer-motion";
import { Compass, ArrowRight, CheckCircle, Clock } from "lucide-react";

const NextStepCard = ({
    nextStepData,
    onCompleteStep,
    isCompleting,
}) => {
    if (!nextStepData) return null;

    const {
        current_step,
        next_step,
        current_phase_title,
        completion_percentage,
        completed_steps_count,
        total_steps_count,
        remaining_steps_count,
    } = nextStepData;

    const activeStep = current_step || next_step;

    return (
        <div className="border border-red-500/40 bg-red-500/5 p-6 shadow-xl shadow-red-500/5">
            <div className="flex flex-col justify-between gap-4 border-b border-red-500/20 pb-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center border border-red-500/30 bg-red-500/10 text-red-500">
                        <Compass className="h-5 w-5" />
                    </div>
                    <div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-red-400">
                            AI Recommendation Engine
                        </span>
                        <h3 className="text-base font-bold uppercase tracking-wider text-white">
                            What Should I Do Next?
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs text-zinc-400">
                    <span>Phase: <strong className="text-white">{current_phase_title}</strong></span>
                    <span>•</span>
                    <span>Progress: <strong className="text-red-400">{completion_percentage}%</strong></span>
                </div>
            </div>

            {activeStep ? (
                <div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="border border-zinc-800 bg-zinc-900 px-2 py-0.5 font-mono text-[11px] uppercase text-zinc-400">
                                Order #{activeStep.order}
                            </span>
                            <span className="border border-zinc-800 bg-zinc-900 px-2 py-0.5 font-mono text-[11px] uppercase text-zinc-400">
                                {activeStep.difficulty}
                            </span>
                            <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-500">
                                <Clock className="h-3 w-3" /> Est. {activeStep.estimated_hours}h
                            </span>
                        </div>

                        <h4 className="text-xl font-bold text-white">
                            {activeStep.title}
                        </h4>
                        <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
                            {activeStep.learning_objective || activeStep.description}
                        </p>
                    </div>

                    <div className="shrink-0">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onCompleteStep(activeStep)}
                            disabled={isCompleting}
                            className="flex items-center justify-center gap-2 border border-red-500 bg-red-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-red-600/20 hover:bg-red-500 disabled:opacity-50"
                        >
                            <CheckCircle className="h-4 w-4" />
                            <span>{isCompleting ? "Updating..." : "Mark Step Completed"}</span>
                        </motion.button>
                    </div>
                </div>
            ) : (
                <div className="mt-4 flex items-center gap-3 text-emerald-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-semibold">
                        Congratulations! You have completed all steps in this roadmap path!
                    </span>
                </div>
            )}
        </div>
    );
};

export default NextStepCard;

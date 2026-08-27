import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2, Clock, BookOpen, Wrench, Package, ExternalLink } from "lucide-react";
import RoadmapProjectCard from "./RoadmapProjectCard";

const RoadmapPhaseCard = ({
    phase,
    userStepProgressesMap = {},
    onCompleteStep,
    isCompleting,
}) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const steps = phase.steps || [];
    const completedCount = steps.filter(
        (s) => userStepProgressesMap[s.id]?.status === "completed"
    ).length;
    const isPhaseCompleted = steps.length > 0 && completedCount === steps.length;

    return (
        <div className="border border-zinc-800 bg-[var(--surface)]">
            {/* Header / Accordion Toggle */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex cursor-pointer items-center justify-between p-6 transition-colors hover:bg-zinc-900/40"
            >
                <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center font-mono text-sm font-bold border ${
                        isPhaseCompleted
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                            : "border-red-500/40 bg-red-500/10 text-red-500"
                    }`}>
                        {phase.order}
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold uppercase tracking-wider text-white">
                                {phase.title}
                            </h3>
                            {isPhaseCompleted && (
                                <span className="border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] uppercase text-emerald-400">
                                    Completed
                                </span>
                            )}
                        </div>
                        <p className="mt-1 text-xs text-zinc-400">
                            {phase.description}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden font-mono text-xs text-zinc-400 sm:flex sm:items-center sm:gap-3">
                        <span>{completedCount}/{steps.length} Steps</span>
                        <span>•</span>
                        <span>Est. {phase.estimated_hours}h</span>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-zinc-400 transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : ""
                    }`} />
                </div>
            </div>

            {/* Expandable Phase Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-zinc-800/80 p-6"
                    >
                        {phase.learning_objective && (
                            <div className="mb-6 border-l-2 border-red-500 bg-zinc-900/50 p-3 text-xs text-zinc-300">
                                <span className="font-bold text-white uppercase">Phase Objective: </span>
                                {phase.learning_objective}
                            </div>
                        )}

                        {/* Steps List */}
                        <div className="space-y-6">
                            {steps.map((step) => {
                                const stepProgress = userStepProgressesMap[step.id];
                                const isStepCompleted = stepProgress?.status === "completed";

                                return (
                                    <div
                                        key={step.id}
                                        className={`border p-5 transition-all ${
                                            isStepCompleted
                                                ? "border-emerald-500/30 bg-emerald-500/5"
                                                : "border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700"
                                        }`}
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-[10px] uppercase text-zinc-500">
                                                        Step {step.order}
                                                    </span>
                                                    <span className="border border-zinc-800 bg-zinc-900 px-2 py-0.5 font-mono text-[10px] uppercase text-zinc-400">
                                                        {step.difficulty || "Intermediate"}
                                                    </span>
                                                    <span className="flex items-center gap-1 font-mono text-[10px] text-zinc-500">
                                                        <Clock className="h-3 w-3" /> {step.estimated_hours}h
                                                    </span>
                                                </div>

                                                <h4 className="mt-2 text-base font-bold text-white">
                                                    {step.title}
                                                </h4>
                                                <p className="mt-1 text-xs leading-relaxed text-zinc-300">
                                                    {step.description}
                                                </p>
                                            </div>

                                            <div className="shrink-0">
                                                {isStepCompleted ? (
                                                    <div className="flex items-center gap-1.5 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-mono text-xs text-emerald-400">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        <span>Completed</span>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => onCompleteStep(step)}
                                                        disabled={isCompleting}
                                                        className="border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-200 transition-colors hover:border-red-500 hover:text-white disabled:opacity-50"
                                                    >
                                                        Mark Complete
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* What to Learn, Practice, Build */}
                                        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-zinc-800/80 pt-4 md:grid-cols-3">
                                            {/* What to Learn */}
                                            {step.what_to_learn?.length > 0 && (
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-zinc-300">
                                                        <BookOpen className="h-3.5 w-3.5 text-red-400" />
                                                        <span>What to Learn</span>
                                                    </div>
                                                    <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1">
                                                        {step.what_to_learn.map((item, idx) => (
                                                            <li key={idx}>{item}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* What to Practice */}
                                            {step.what_to_practice?.length > 0 && (
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-zinc-300">
                                                        <Wrench className="h-3.5 w-3.5 text-amber-400" />
                                                        <span>What to Practice</span>
                                                    </div>
                                                    <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1">
                                                        {step.what_to_practice.map((item, idx) => (
                                                            <li key={idx}>{item}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* What to Build */}
                                            {step.what_to_build?.length > 0 && (
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-zinc-300">
                                                        <Package className="h-3.5 w-3.5 text-emerald-400" />
                                                        <span>What to Build</span>
                                                    </div>
                                                    <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1">
                                                        {step.what_to_build.map((item, idx) => (
                                                            <li key={idx}>{item}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        {/* Project-Lab Benchmark Card if present */}
                                        {step.what_to_build?.length > 0 && (
                                            <div className="mt-4">
                                                <RoadmapProjectCard
                                                    projectTitle={step.what_to_build[0]}
                                                    techStack={step.what_to_learn}
                                                    difficulty={step.difficulty}
                                                />
                                            </div>
                                        )}

                                        {/* Curated Resources */}
                                        {step.resources?.length > 0 && (
                                            <div className="mt-4 border-t border-zinc-800/80 pt-3">
                                                <span className="font-mono text-[10px] uppercase text-zinc-500">
                                                    Recommended Resources:
                                                </span>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {step.resources.map((res) => (
                                                        <a
                                                            key={res.id || res.url}
                                                            href={res.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1.5 border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-300 transition-colors hover:border-red-500 hover:text-white"
                                                        >
                                                            <span>{res.title}</span>
                                                            <ExternalLink className="h-3 w-3 text-zinc-500" />
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RoadmapPhaseCard;

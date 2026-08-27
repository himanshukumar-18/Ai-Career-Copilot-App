import { motion } from "framer-motion";
import {
    BadgeCheck,
    BrainCircuit,
    FileSearch,
    Gauge,
} from "lucide-react";

const SCORE_ITEMS = [
    {
        key: "ats",
        label: "ATS Score",
        icon: FileSearch,
        description: "Applicant Tracking System compatibility",
    },
    {
        key: "grammar",
        label: "Grammar",
        icon: BadgeCheck,
        description: "Grammar and language quality",
    },
    {
        key: "readability",
        label: "Readability",
        icon: BrainCircuit,
        description: "Structure and clarity",
    },
    {
        key: "impact",
        label: "Impact",
        icon: Gauge,
        description: "Recruiter impression",
    },
];

const getStatusColor = (score) => {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 75) return "bg-yellow-500";
    if (score >= 60) return "bg-orange-500";
    return "bg-red-600";
};

const ResumeAIScoreGrid = ({
    ats = 0,
    grammar = 0,
    readability = 0,
    impact = 0,
}) => {
    const values = {
        ats,
        grammar,
        readability,
        impact,
    };

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
            {SCORE_ITEMS.map((item, index) => {
                const Icon = item.icon;
                const value = values[item.key] ?? 0;

                return (
                    <motion.div
                        key={item.key}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: index * 0.08,
                        }}
                        className="border border-zinc-800 bg-zinc-950 transition-colors hover:border-red-600"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
                            <div className="min-w-0">
                                <p className="truncate text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
                                    {item.label}
                                </p>
                            </div>

                            <Icon
                                size={18}
                                className="text-red-600"
                            />
                        </div>

                        {/* Body */}
                        <div className="p-5">
                            <div className="flex items-end gap-2">
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-5xl font-bold text-white"
                                >
                                    {value}
                                </motion.span>

                                <span className="mb-2 text-sm text-zinc-500">
                                    /100
                                </span>
                            </div>

                            <p className="mt-3 text-xs leading-5 text-zinc-500">
                                {item.description}
                            </p>

                            <div className="mt-5 h-2 overflow-hidden border border-zinc-800 bg-black">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${value}%`,
                                    }}
                                    transition={{
                                        duration: 0.9,
                                    }}
                                    className={`h-full ${getStatusColor(
                                        value
                                    )}`}
                                />
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </motion.section>
    );
};

export default ResumeAIScoreGrid;
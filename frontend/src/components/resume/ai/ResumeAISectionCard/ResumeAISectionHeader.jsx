import { motion } from "framer-motion";
import {
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    AlertTriangle,
    Sparkles,
} from "lucide-react";

const getScoreColor = (score) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 75) return "text-yellow-400";
    if (score >= 60) return "text-orange-400";
    return "text-red-500";
};

const getStatus = (score) => {
    if (score >= 90) {
        return {
            label: "Excellent",
            color:
                "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
            icon: CheckCircle2,
        };
    }

    if (score >= 75) {
        return {
            label: "Good",
            color:
                "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
            icon: Sparkles,
        };
    }

    return {
        label: "Needs Improvement",
        color:
            "border-red-600/30 bg-red-600/10 text-red-500",
        icon: AlertTriangle,
    };
};

const ResumeAISectionHeader = ({
    title,
    score = 0,
    expanded = false,
    onToggle,
    icon: Icon = Sparkles,
}) => {
    const status = getStatus(score);
    const StatusIcon = status.icon;

    return (
        <motion.button
            whileTap={{ scale: 0.995 }}
            type="button"
            onClick={onToggle}
            className="flex w-full items-center justify-between border-b border-zinc-800 bg-zinc-950 px-5 py-5 transition-colors hover:bg-zinc-900 sm:px-6"
        >
            {/* Left */}
            <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center border border-zinc-800 bg-black">
                    <Icon
                        size={20}
                        className="text-red-600"
                    />
                </div>

                <div className="min-w-0 text-left">
                    <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-zinc-500">
                        Resume Section
                    </p>

                    <h3 className="mt-1 truncate text-lg font-semibold text-white sm:text-xl">
                        {title}
                    </h3>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
                {/* Status */}
                <div
                    className={`hidden items-center gap-2 border px-3 py-2 text-xs font-medium uppercase tracking-[0.15em] sm:flex ${status.color}`}
                >
                    <StatusIcon size={14} />

                    {status.label}
                </div>

                {/* Score */}
                <div className="border border-zinc-800 bg-black px-4 py-2 text-center">
                    <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-500">
                        Score
                    </p>

                    <p
                        className={`mt-1 text-2xl font-bold ${getScoreColor(
                            score
                        )}`}
                    >
                        {score}
                    </p>
                </div>

                {/* Expand */}
                <div className="flex h-10 w-10 items-center justify-center border border-zinc-800 bg-black">
                    {expanded ? (
                        <ChevronUp
                            size={18}
                            className="text-zinc-400"
                        />
                    ) : (
                        <ChevronDown
                            size={18}
                            className="text-zinc-400"
                        />
                    )}
                </div>
            </div>
        </motion.button>
    );
};

export default ResumeAISectionHeader;
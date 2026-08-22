import React from "react";
import { Zap, Flame, ShieldAlert } from "lucide-react";

const DIFFICULTY_CONFIG = {
    easy: {
        label: "Easy",
        colorClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        icon: Zap,
    },
    medium: {
        label: "Medium",
        colorClass: "border-amber-500/30 bg-amber-500/10 text-amber-400",
        icon: Flame,
    },
    hard: {
        label: "Hard",
        colorClass: "border-red-500/30 bg-red-500/10 text-red-400",
        icon: ShieldAlert,
    },
};

export const ProjectDifficultyBadge = ({ difficulty, className = "" }) => {
    const key = (difficulty || "medium").toLowerCase();
    const config = DIFFICULTY_CONFIG[key] || DIFFICULTY_CONFIG.medium;
    const Icon = config.icon;

    return (
        <span
            className={`
                inline-flex items-center gap-1.5 px-2.5 py-1
                border font-mono text-[11px] uppercase tracking-wider
                ${config.colorClass}
                ${className}
            `}
        >
            <Icon className="h-3.5 w-3.5" />
            <span>{config.label}</span>
        </span>
    );
};

export default ProjectDifficultyBadge;

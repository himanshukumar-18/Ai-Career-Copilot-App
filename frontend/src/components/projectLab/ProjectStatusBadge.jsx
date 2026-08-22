import React from "react";
import { CircleDot, PlayCircle, CheckCircle2 } from "lucide-react";

const STATUS_CONFIG = {
    not_started: {
        label: "Not Started",
        colorClass: "border-zinc-700 bg-zinc-900/60 text-zinc-400",
        icon: CircleDot,
    },
    in_progress: {
        label: "In Progress",
        colorClass: "border-amber-500/40 bg-amber-500/10 text-amber-400",
        icon: PlayCircle,
    },
    completed: {
        label: "Completed",
        colorClass: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
        icon: CheckCircle2,
    },
};

export const ProjectStatusBadge = ({ status, className = "" }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.not_started;
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

export default ProjectStatusBadge;

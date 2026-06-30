import { AlertCircle, CheckCircle2, Cloud, Loader2 } from "lucide-react";

const STATUS_CONFIG = {
    idle: {
        icon: Cloud,
        label: "Ready",
        iconClass: "text-zinc-400",
        textClass: "text-zinc-400",
    },
    saving: {
        icon: Loader2,
        label: "Saving...",
        iconClass: "text-blue-400 animate-spin",
        textClass: "text-blue-400",
    },
    saved: {
        icon: CheckCircle2,
        label: "Saved",
        iconClass: "text-emerald-500",
        textClass: "text-emerald-500",
    },
    error: {
        icon: AlertCircle,
        label: "Save failed",
        iconClass: "text-red-500",
        textClass: "text-red-500",
    },
};

const formatLastSaved = (date) => {
    if (!date) return "Not saved yet";
    const savedDate = new Date(date);
    if (isNaN(savedDate.getTime())) return "Not saved yet";
    const diff = Math.floor((Date.now() - savedDate.getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return savedDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const ResumeAutoSaveIndicator = ({
    status = "idle",
    lastSaved = null,
}) => {
    const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.idle;
    const Icon = config.icon;

    return (
        <div
            className="flex items-center gap-3"
            role="status"
            aria-live="polite"
            aria-label={`Auto-save status: ${config.label}`}
        >
            <div className="flex items-center gap-2 border border-zinc-800 bg-zinc-900 px-3 py-1.5">
                <Icon size={16} className={config.iconClass} aria-hidden="true" />
                <span className={`text-sm font-medium ${config.textClass}`}>
                    {config.label}
                </span>
            </div>

            <span className="hidden text-xs text-zinc-500 lg:block">
                {formatLastSaved(lastSaved)}
            </span>
        </div>
    );
};

export default ResumeAutoSaveIndicator;
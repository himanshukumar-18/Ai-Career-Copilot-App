import React from "react";
import { X, Clock, ExternalLink, FileText, Calendar, Edit3, CheckCircle2, PlayCircle, CircleDot } from "lucide-react";
import Button from "../ui/Button";
import ProjectStatusBadge from "./ProjectStatusBadge";
import ProjectDifficultyBadge from "./ProjectDifficultyBadge";

export const ProjectDetailModal = ({
    isOpen,
    onClose,
    project,
    onOpenUpdateStatusModal,
}) => {
    if (!isOpen || !project) return null;

    const {
        title,
        description,
        difficulty,
        tech_stack = [],
        estimated_hours,
        status,
        repo_link,
        notes,
        started_at,
        completed_at,
        created_at,
        source_generation,
    } = project;

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="relative my-8 w-full max-w-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Header */}
                <div className="border-b border-[var(--border)] pb-4">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <ProjectStatusBadge status={status} />
                        <ProjectDifficultyBadge difficulty={difficulty} />
                    </div>

                    <h2 className="font-mono text-xl font-bold text-[var(--text-primary)] md:text-2xl">
                        {title}
                    </h2>
                </div>

                {/* Meta details bar */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4 font-mono text-xs text-[var(--text-secondary)]">
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-[var(--text-muted)]" />
                        <span>Est. Scope: {estimated_hours} Hours</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-[var(--text-muted)]" />
                        <span>Created: {formatDate(created_at)}</span>
                    </div>

                    {started_at && (
                        <div className="flex items-center gap-1.5 text-amber-400">
                            <PlayCircle className="h-4 w-4" />
                            <span>Started: {formatDate(started_at)}</span>
                        </div>
                    )}

                    {completed_at && (
                        <div className="flex items-center gap-1.5 text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Completed: {formatDate(completed_at)}</span>
                        </div>
                    )}
                </div>

                {/* Main Content Body */}
                <div className="mt-6 space-y-6 max-h-[500px] overflow-y-auto pr-2">
                    {/* Description */}
                    <div>
                        <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">
                            Project Description
                        </h3>
                        <div className="border border-[var(--border)] bg-[var(--background)] p-4 text-xs text-[var(--text-primary)] leading-relaxed whitespace-pre-line">
                            {description}
                        </div>
                    </div>

                    {/* Tech Stack */}
                    {tech_stack.length > 0 && (
                        <div>
                            <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">
                                Required Tech Stack
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {tech_stack.map((tech, idx) => (
                                    <span
                                        key={idx}
                                        className="border border-zinc-700 bg-zinc-900 px-3 py-1 font-mono text-xs text-zinc-200"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Features from Source Generation if available */}
                    {source_generation?.features?.length > 0 && (
                        <div>
                            <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">
                                Key Features to Build
                            </h3>
                            <ul className="border border-[var(--border)] bg-[var(--background)] p-4 list-disc list-inside space-y-1.5 text-xs text-zinc-300 font-mono">
                                {source_generation.features.map((feat, idx) => (
                                    <li key={idx}>{feat}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Learning Outcomes from Source Generation if available */}
                    {source_generation?.learning_outcomes?.length > 0 && (
                        <div>
                            <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">
                                Expected Learning Outcomes
                            </h3>
                            <ul className="border border-[var(--border)] bg-[var(--background)] p-4 list-disc list-inside space-y-1.5 text-xs text-zinc-300 font-mono">
                                {source_generation.learning_outcomes.map((out, idx) => (
                                    <li key={idx}>{out}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Repository Link */}
                    <div>
                        <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">
                            GitHub / Repository URL
                        </h3>
                        {repo_link ? (
                            <a
                                href={repo_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 border border-red-500/40 bg-red-500/10 px-4 py-2 font-mono text-xs text-red-400 hover:underline"
                            >
                                <ExternalLink className="h-4 w-4" />
                                <span>{repo_link}</span>
                            </a>
                        ) : (
                            <p className="text-xs text-[var(--text-muted)] font-mono italic">
                                No repository URL attached yet. You can add your GitHub repo link when updating status.
                            </p>
                        )}
                    </div>

                    {/* Student Notes */}
                    <div>
                        <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">
                            Study & Progress Notes
                        </h3>
                        {notes ? (
                            <div className="border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-xs text-[var(--text-secondary)] whitespace-pre-line">
                                {notes}
                            </div>
                        ) : (
                            <p className="text-xs text-[var(--text-muted)] font-mono italic">
                                No notes added yet.
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="mt-8 flex justify-between items-center border-t border-[var(--border)] pt-4">
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>

                    <Button
                        variant="danger"
                        onClick={() => {
                            onClose();
                            onOpenUpdateStatusModal(project);
                        }}
                    >
                        <Edit3 className="mr-2 h-4 w-4" />
                        Update Status & Notes
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailModal;

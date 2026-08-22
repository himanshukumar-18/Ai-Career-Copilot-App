import React from "react";
import { Clock, ExternalLink, FileText, Trash2, Eye, Edit3 } from "lucide-react";
import ProjectStatusBadge from "./ProjectStatusBadge";
import ProjectDifficultyBadge from "./ProjectDifficultyBadge";
import Button from "../ui/Button";

export const ProjectCard = ({
    project,
    onViewDetails,
    onUpdateStatus,
    onDelete,
}) => {
    if (!project) return null;

    const {
        title,
        description,
        difficulty,
        tech_stack = [],
        estimated_hours,
        status,
        repo_link,
        notes,
    } = project;

    return (
        <div className="group relative flex flex-col justify-between border border-[var(--border)] bg-[var(--surface)] p-5 transition-all duration-200 hover:border-[var(--border-light)]">
            <div>
                {/* Header badges */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <ProjectStatusBadge status={status} />
                    <ProjectDifficultyBadge difficulty={difficulty} />
                </div>

                {/* Title */}
                <h3 className="mt-4 font-mono text-base font-bold text-[var(--text-primary)] transition-colors group-hover:text-white">
                    {title}
                </h3>

                {/* Description */}
                <p className="mt-2 line-clamp-3 text-xs text-[var(--text-secondary)] leading-relaxed">
                    {description}
                </p>

                {/* Tech stack chips */}
                {tech_stack.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                        {tech_stack.slice(0, 5).map((tech, idx) => (
                            <span
                                key={idx}
                                className="border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 font-mono text-[10px] text-zinc-400"
                            >
                                {tech}
                            </span>
                        ))}
                        {tech_stack.length > 5 && (
                            <span className="border border-zinc-800 bg-zinc-900/80 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
                                +{tech_stack.length - 5}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Meta & Actions */}
            <div className="mt-6 border-t border-[var(--border)] pt-4">
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono mb-4">
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{estimated_hours} hours</span>
                    </div>

                    {repo_link ? (
                        <a
                            href={repo_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-red-400 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ExternalLink className="h-3 w-3" />
                            <span>Repo</span>
                        </a>
                    ) : notes ? (
                        <span className="inline-flex items-center gap-1 text-zinc-400">
                            <FileText className="h-3 w-3" />
                            <span>Notes</span>
                        </span>
                    ) : null}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        onClick={() => onViewDetails(project)}
                        className="flex-1 h-9 px-2 text-[11px]"
                    >
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        Details
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => onUpdateStatus(project)}
                        className="h-9 px-3 text-[11px]"
                        title="Update Status / Repo Link"
                    >
                        <Edit3 className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={() => onDelete(project)}
                        className="h-9 px-2.5 text-[11px]"
                        title="Delete Project"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;

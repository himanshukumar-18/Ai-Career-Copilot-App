import React from "react";
import { Sparkles, FolderGit2, PlayCircle, CheckCircle2, Clock } from "lucide-react";
import Button from "../ui/Button";

export const ProjectLabHeader = ({ stats = {}, onOpenGenerateModal }) => {
    return (
        <div className="border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                {/* Title and description */}
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center border border-red-500/40 bg-red-500/10 text-red-500">
                            <FolderGit2 className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="font-mono text-xl font-bold uppercase tracking-[0.15em] text-[var(--text-primary)] md:text-2xl">
                                Project Lab
                            </h1>
                            <p className="mt-0.5 text-xs font-mono text-[var(--text-secondary)]">
                                Practice real-world coding projects & build internship-ready portfolios
                            </p>
                        </div>
                    </div>
                </div>

                {/* Primary CTA */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="danger"
                        onClick={onOpenGenerateModal}
                        className="w-full sm:w-auto"
                    >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate AI Ideas
                    </Button>
                </div>
            </div>

            {/* Metric Summary Cards */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 md:mt-8">
                <div className="border border-[var(--border)] bg-[var(--background)] p-4">
                    <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider">
                        <span>Total Saved</span>
                        <FolderGit2 className="h-4 w-4 text-[var(--text-secondary)]" />
                    </div>
                    <div className="mt-2 font-mono text-2xl font-bold text-[var(--text-primary)]">
                        {stats.total || 0}
                    </div>
                </div>

                <div className="border border-[var(--border)] bg-[var(--background)] p-4">
                    <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider">
                        <span>In Progress</span>
                        <PlayCircle className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="mt-2 font-mono text-2xl font-bold text-amber-400">
                        {stats.inProgress || 0}
                    </div>
                </div>

                <div className="border border-[var(--border)] bg-[var(--background)] p-4">
                    <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider">
                        <span>Completed</span>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="mt-2 font-mono text-2xl font-bold text-emerald-400">
                        {stats.completed || 0}
                    </div>
                </div>

                <div className="border border-[var(--border)] bg-[var(--background)] p-4">
                    <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider">
                        <span>Est. Hours</span>
                        <Clock className="h-4 w-4 text-[var(--text-secondary)]" />
                    </div>
                    <div className="mt-2 font-mono text-2xl font-bold text-[var(--text-primary)]">
                        {stats.completedHours || 0}
                        <span className="text-xs font-normal text-[var(--text-muted)]">
                            {" "}/ {stats.totalHours || 0}h
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectLabHeader;

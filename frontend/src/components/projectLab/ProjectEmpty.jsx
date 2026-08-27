import React from "react";
import { FolderPlus, Sparkles, FilterX } from "lucide-react";
import Button from "../ui/Button";

export const ProjectEmpty = ({
    isFiltered = false,
    onOpenGenerateModal,
    onResetFilters,
}) => {
    return (
        <div className="border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
            {isFiltered ? (
                <div className="mx-auto max-w-md">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border border-amber-500/30 bg-amber-500/10 text-amber-400">
                        <FilterX className="h-7 w-7" />
                    </div>
                    <h3 className="font-mono text-base font-bold uppercase tracking-wider text-[var(--text-primary)]">
                        No Matching Projects
                    </h3>
                    <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                        No saved projects match your active search or filter criteria. Try clearing your filters or searching for something else.
                    </p>
                    <div className="mt-6 flex justify-center gap-3">
                        <Button variant="secondary" onClick={onResetFilters}>
                            Clear Filters
                        </Button>
                        <Button variant="danger" onClick={onOpenGenerateModal}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Ideas
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="mx-auto max-w-md">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border border-red-500/30 bg-red-500/10 text-red-500">
                        <FolderPlus className="h-8 w-8" />
                    </div>
                    <h3 className="font-mono text-lg font-bold uppercase tracking-wider text-[var(--text-primary)]">
                        Your Project Lab is Empty
                    </h3>
                    <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                        Generate tailored, internship-ready project ideas using AI based on your desired tech stack and difficulty level, then save them to track your progress!
                    </p>
                    <div className="mt-6">
                        <Button variant="danger" onClick={onOpenGenerateModal}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Your First Project
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectEmpty;

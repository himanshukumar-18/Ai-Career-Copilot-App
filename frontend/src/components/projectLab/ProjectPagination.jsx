import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../ui/Button";

export const ProjectPagination = ({ pagination, onPageChange }) => {
    if (!pagination || pagination.pages <= 1) return null;

    const { page, pages, count } = pagination;

    return (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border border-[var(--border)] bg-[var(--surface)] p-4 sm:flex-row">
            <div className="font-mono text-xs text-[var(--text-secondary)]">
                Showing page <span className="font-bold text-[var(--text-primary)]">{page}</span> of{" "}
                <span className="font-bold text-[var(--text-primary)]">{pages}</span> ({count} total items)
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                    className="h-9 px-3 text-xs"
                >
                    <ChevronLeft className="mr-1 h-3.5 w-3.5" />
                    Previous
                </Button>

                <div className="flex items-center gap-1 font-mono text-xs px-2 text-[var(--text-muted)]">
                    {page} / {pages}
                </div>

                <Button
                    variant="outline"
                    disabled={page >= pages}
                    onClick={() => onPageChange(page + 1)}
                    className="h-9 px-3 text-xs"
                >
                    Next
                    <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    );
};

export default ProjectPagination;

import React from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import Button from "../ui/Button";

export const DeleteProjectModal = ({
    isOpen,
    onClose,
    project,
    onConfirmDelete,
    isDeleting = false,
    deleteError = null,
}) => {
    if (!isOpen || !project) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-red-500/40 bg-red-500/10 text-red-500">
                        <AlertTriangle className="h-5 w-5" />
                    </div>

                    <div>
                        <h3 className="font-mono text-base font-bold uppercase tracking-wider text-[var(--text-primary)]">
                            Remove Project?
                        </h3>
                        <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                            Are you sure you want to remove <span className="font-mono font-bold text-white">"{project.title}"</span> from your Project Lab list?
                        </p>
                        <p className="mt-1 text-[11px] text-zinc-500 font-mono italic">
                            This action cannot be undone.
                        </p>
                    </div>
                </div>

                {deleteError && (
                    <div className="mt-4 border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-400 font-mono">
                        {deleteError}
                    </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={onConfirmDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete Project"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DeleteProjectModal;

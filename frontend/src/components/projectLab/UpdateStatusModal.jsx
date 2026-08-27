import React, { useState, useEffect } from "react";
import { X, Edit3, Loader2, PlayCircle, CheckCircle2, CircleDot } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";

export const UpdateStatusModal = ({
    isOpen,
    onClose,
    project,
    onUpdate,
    isUpdating = false,
    updateError = null,
}) => {
    const [status, setStatus] = useState("not_started");
    const [repoLink, setRepoLink] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (project) {
            setStatus(project.status || "not_started");
            setRepoLink(project.repo_link || "");
            setNotes(project.notes || "");
        }
    }, [project]);

    if (!isOpen || !project) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onUpdate({
                id: project.id,
                status,
                repo_link: repoLink,
                notes,
            });
        } catch {
            // error handled by hook / view
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="relative my-8 w-full max-w-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                    <div className="flex h-10 w-10 items-center justify-center border border-amber-500/30 bg-amber-500/10 text-amber-400">
                        <Edit3 className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="font-mono text-base font-bold uppercase tracking-wider text-[var(--text-primary)]">
                            Update Project Status
                        </h2>
                        <p className="text-xs text-[var(--text-secondary)] font-mono line-clamp-1">
                            {project.title}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    {/* Status Selection */}
                    <div>
                        <label className="block font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                            Current Status
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setStatus("not_started")}
                                className={`flex flex-col items-center gap-2 border p-3 font-mono text-xs transition-all ${
                                    status === "not_started"
                                        ? "border-zinc-500 bg-zinc-800 text-zinc-100 font-bold"
                                        : "border-[var(--border)] bg-[var(--background)] text-zinc-400 hover:border-zinc-700"
                                }`}
                            >
                                <CircleDot className="h-4 w-4" />
                                <span>Not Started</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setStatus("in_progress")}
                                className={`flex flex-col items-center gap-2 border p-3 font-mono text-xs transition-all ${
                                    status === "in_progress"
                                        ? "border-amber-500 bg-amber-500/20 text-amber-300 font-bold"
                                        : "border-[var(--border)] bg-[var(--background)] text-zinc-400 hover:border-zinc-700"
                                }`}
                            >
                                <PlayCircle className="h-4 w-4 text-amber-400" />
                                <span>In Progress</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setStatus("completed")}
                                className={`flex flex-col items-center gap-2 border p-3 font-mono text-xs transition-all ${
                                    status === "completed"
                                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold"
                                        : "border-[var(--border)] bg-[var(--background)] text-zinc-400 hover:border-zinc-700"
                                }`}
                            >
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                <span>Completed</span>
                            </button>
                        </div>
                    </div>

                    {/* Repository Link */}
                    <div>
                        <label className="block font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                            Repository / Live Project Link (Optional)
                        </label>
                        <Input
                            type="url"
                            placeholder="https://github.com/username/project-repo"
                            value={repoLink}
                            onChange={(e) => setRepoLink(e.target.value)}
                            disabled={isUpdating}
                        />
                    </div>

                    {/* Progress Notes */}
                    <div>
                        <label className="block font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                            Notes / Challenges / Progress Remarks (Optional)
                        </label>
                        <Textarea
                            rows={4}
                            placeholder="Record notes, key technical challenges solved, or architecture decisions..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            disabled={isUpdating}
                        />
                    </div>

                    {/* Error Banner */}
                    {updateError && (
                        <div className="border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-400 font-mono">
                            {updateError}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={isUpdating}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" variant="danger" disabled={isUpdating}>
                            {isUpdating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateStatusModal;

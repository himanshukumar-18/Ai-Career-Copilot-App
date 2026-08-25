import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, FileText } from "lucide-react";

const CompleteStepModal = ({
    isOpen,
    step,
    onClose,
    onConfirm,
    isSubmitting,
}) => {
    const [notes, setNotes] = useState("");

    if (!isOpen || !step) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(step.id, notes);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-lg border border-zinc-800 bg-[var(--surface)] p-6 shadow-2xl"
                >
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                        <div className="flex items-center gap-2 text-white">
                            <CheckCircle className="h-5 w-5 text-emerald-400" />
                            <h3 className="text-base font-bold uppercase tracking-wider">
                                Mark Step Completed
                            </h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-zinc-500 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <div>
                            <span className="font-mono text-[10px] uppercase text-zinc-500">
                                Target Step:
                            </span>
                            <p className="text-sm font-bold text-white">{step.title}</p>
                            <p className="text-xs text-zinc-400 mt-0.5">{step.learning_objective}</p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                                Optional Study Notes / Link (e.g. GitHub Repo):
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                placeholder="Write key learnings, concepts mastered, or project link..."
                                className="w-full border border-zinc-800 bg-zinc-900/60 p-3 text-xs text-white placeholder-zinc-600 focus:border-red-500 focus:outline-none"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-zinc-800 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="border border-emerald-500 bg-emerald-600 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-500 disabled:opacity-50"
                            >
                                {isSubmitting ? "Updating Progress..." : "Confirm Step Completed"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CompleteStepModal;

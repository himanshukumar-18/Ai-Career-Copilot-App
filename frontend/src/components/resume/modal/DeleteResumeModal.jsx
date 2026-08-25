import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Button from "../../ui/Button";
import { deleteResume } from "@/features/resume/resumeThunk";

const DeleteResumeModal = ({ open, onOpenChange, resume }) => {
    const dispatch = useDispatch();

    // ✅ Local loading — avoids false loading state from other resume actions
    const [loading, setLoading] = useState(false);

    // ===============================
    // Handlers
    // ===============================

    const handleClose = () => {
        if (loading) return;
        onOpenChange(false);
    };

    const handleDelete = async () => {
        if (!resume?.id) return;

        setLoading(true);

        const result = await dispatch(deleteResume(resume.id));

        setLoading(false);

        if (deleteResume.fulfilled.match(result)) {
            toast.success("Resume deleted successfully.");
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
            onOpenChange(false);
            return;
        }

        toast.error(
            result.payload?.message ?? "Unable to delete resume."
        );
    };

    // ===============================
    // Render
    // ===============================

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (loading) return;
                if (!value) handleClose();
                else onOpenChange(value);
            }}
        >
            <DialogContent
                onCloseAutoFocus={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => { if (loading) e.preventDefault(); }}
                onPointerDownOutside={(e) => { if (loading) e.preventDefault(); }}
                className="
                    w-[95vw]
                    max-w-md
                    border
                    border-zinc-800
                    bg-zinc-950
                    p-0
                    text-white
                    shadow-none
                "
            >
                {/* Loading Overlay */}
                {loading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="flex items-center gap-3 border border-zinc-800 bg-zinc-950 px-5 py-3">
                            <Loader2 className="h-5 w-5 animate-spin text-red-500" />
                            <span className="text-sm text-zinc-300">Deleting...</span>
                        </div>
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    {/* Header */}
                    <DialogHeader className="border-b border-zinc-800 p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center border border-red-900 bg-red-950/30">
                                <AlertTriangle className="text-red-500" size={22} />
                            </div>

                            <div>
                                <DialogTitle className="text-xl font-semibold">
                                    Delete Resume
                                </DialogTitle>
                                <DialogDescription className="mt-1 text-zinc-400">
                                    This action cannot be undone.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Body */}
                    <div className="space-y-5 p-6">
                        <p className="text-sm leading-7 text-zinc-400">
                            You are about to permanently delete this resume.
                        </p>

                        {/* Resume name card */}
                        <div className="border border-zinc-800 bg-zinc-900 p-4">
                            <p className="text-xs uppercase tracking-widest text-zinc-500">
                                Resume
                            </p>
                            <h3 className="mt-2 font-semibold text-white">
                                {resume?.title ?? "Untitled Resume"}  {/* ✅ fallback */}
                            </h3>
                        </div>

                        {/* Warning */}
                        <div className="border border-yellow-900 bg-yellow-950/20 p-4">
                            <p className="text-sm text-yellow-400">
                                This action cannot be undone. Any associated
                                information will no longer be available.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col-reverse gap-3 border-t border-zinc-800 p-6 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Resume
                                </>
                            )}
                        </Button>
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteResumeModal;
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    ChevronDown,
    FileDown,
    Loader2,
    MoreHorizontal,
    Save,
    Share2,
    Sparkles,
} from "lucide-react";

import Button from "../../ui/Button";
import { RESUME_LIST_PATH } from "../../../routes/paths";

const ResumeEditorHeader = ({
    isSaving = false,
    isPublished = false,
    isPublishing = false,
    onBack,
    onSave,
    onPublish,
    onExportPDF,
    onAIImprove,
}) => {
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const moreMenuRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                moreMenuRef.current &&
                !moreMenuRef.current.contains(event.target)
            ) {
                setIsMoreOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setIsMoreOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const handleMoreAction = (action) => {
        setIsMoreOpen(false);
        action?.();
    };

    return (
        <motion.header
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="sticky top-0 z-40 border-b border-zinc-800 bg-black/95 backdrop-blur-md"
        >
            <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
                {/* Left: back navigation */}
                <div className="flex min-w-0 items-center gap-3">
                    <Link to={RESUME_LIST_PATH}>
                        <Button
                            type="button"
                            onClick={onBack}
                            className="h-10"
                            aria-label="Back to resumes"
                        >
                            <ArrowLeft size={15} aria-hidden="true" />
                        </Button>
                    </Link>
                </div>

                {/* Right: primary actions */}
                <div className="flex shrink-0 items-center gap-2">
                    {/* Secondary actions menu */}
                    <div ref={moreMenuRef} className="relative">
                        <button
                            type="button"
                            onClick={() => setIsMoreOpen((value) => !value)}
                            aria-label="More resume actions"
                            aria-expanded={isMoreOpen}
                            aria-haspopup="menu"
                            className="inline-flex h-10 items-center justify-center gap-1 border border-zinc-800 px-3 text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-950 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500"
                        >
                            <MoreHorizontal size={17} aria-hidden="true" />
                            <ChevronDown
                                size={13}
                                className={`transition-transform ${isMoreOpen ? "rotate-180" : ""
                                    }`}
                                aria-hidden="true"
                            />
                        </button>

                        <AnimatePresence>
                            {isMoreOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.15 }}
                                    role="menu"
                                    className="absolute right-0 top-11 z-50 w-52 border border-zinc-800 bg-zinc-950 p-1.5 shadow-2xl"
                                >
                                    <button
                                        type="button"
                                        role="menuitem"
                                        disabled={isSaving || isPublishing}
                                        onClick={() => handleMoreAction(onAIImprove)}
                                        className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Sparkles size={16} />
                                        AI improve
                                    </button>

                                    <button
                                        type="button"
                                        role="menuitem"
                                        disabled={isSaving}
                                        onClick={() => handleMoreAction(onExportPDF)}
                                        className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <FileDown size={16} />
                                        Export PDF
                                    </button>

                                    <div className="my-1 border-t border-zinc-800" />

                                    <button
                                        type="button"
                                        role="menuitem"
                                        disabled={isSaving}
                                        onClick={() => handleMoreAction(onPublish)}
                                        className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Share2 size={16} />
                                        {isPublishing ? "Publishing..." : isPublished ? "Publish again" : "Publish resume"}
                                    </button>

                                    <button
                                        type="button"
                                        role="menuitem"
                                        disabled={isSaving}
                                        onClick={() => handleMoreAction(onSave)}
                                        className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isSaving ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <Save size={16} />
                                        )}
                                        {isSaving ? "Saving..." : "Save resume"}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.header>
    );
};

export default ResumeEditorHeader;

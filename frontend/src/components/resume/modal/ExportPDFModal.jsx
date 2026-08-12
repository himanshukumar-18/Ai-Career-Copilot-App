/**
 * ExportPDFModal.jsx
 *
 * Professional modal for selecting a PDF template and downloading a resume.
 *
 * Design language:
 *  - Matches existing dark zinc / red-500 accent design system
 *  - Uses existing Dialog, Button UI components
 *  - Uses existing useResumePDF hook — no duplicated logic
 *
 * Props:
 *   open         {boolean}   – controls modal visibility
 *   onOpenChange {function}  – called with (false) when user dismisses
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    CheckCircle2,
    Clock,
    Download,
    FileText,
    Loader2,
    RefreshCcw,
    X,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Button from "../../ui/Button";
import { useResumePDF } from "../../../hooks/useResumePDF";

// ---------------------------------------------------------------------------
// Template definitions
// ---------------------------------------------------------------------------

const TEMPLATES = [
    {
        id: "professional",
        label: "Professional",
        description: "ATS-friendly · Single column · Minimal · FAANG-ready",
        available: true,
    },
    {
        id: "modern",
        label: "Modern",
        description: "Clean two-tone layout with subtle accent color",
        available: false,
    },
    {
        id: "minimal",
        label: "Minimal",
        description: "Ultra-clean whitespace-first design",
        available: false,
    },
    {
        id: "executive",
        label: "Executive",
        description: "Premium layout for senior and C-level roles",
        available: false,
    },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TemplateCard({ template, selected, onSelect }) {
    const isDisabled = !template.available;

    return (
        <button
            type="button"
            disabled={isDisabled}
            onClick={() => !isDisabled && onSelect(template.id)}
            aria-label={`Select ${template.label} template`}
            aria-pressed={selected}
            className={[
                "relative w-full border p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500",
                isDisabled
                    ? "cursor-not-allowed border-zinc-800 opacity-40"
                    : selected
                    ? "border-red-500 bg-red-500/5"
                    : "border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/50",
            ].join(" ")}
        >
            {/* Selection indicator */}
            {selected && !isDisabled && (
                <span className="absolute right-3 top-3">
                    <CheckCircle2 size={16} className="text-red-500" aria-hidden="true" />
                </span>
            )}

            {/* Coming soon badge */}
            {isDisabled && (
                <span className="absolute right-3 top-3 flex items-center gap-1 text-[10px] uppercase tracking-widest text-zinc-500">
                    <Clock size={10} aria-hidden="true" />
                    Soon
                </span>
            )}

            <div className="flex items-start gap-3">
                {/* Thumbnail preview placeholder */}
                <div className="flex h-14 w-10 shrink-0 items-center justify-center border border-zinc-700 bg-zinc-900">
                    <FileText size={14} className="text-zinc-500" aria-hidden="true" />
                </div>

                <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-100">
                        {template.label}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
                        {template.description}
                    </p>
                </div>
            </div>
        </button>
    );
}

// ---------------------------------------------------------------------------
// Status panels
// ---------------------------------------------------------------------------

function LoadingPanel({ isPreparing }) {
    return (
        <motion.div
            key="loading"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 py-10 text-center"
            role="status"
            aria-live="polite"
        >
            <div className="flex h-14 w-14 items-center justify-center border border-zinc-800 bg-zinc-900">
                <Loader2 size={24} className="animate-spin text-red-500" aria-hidden="true" />
            </div>

            <div>
                <p className="text-sm font-semibold text-zinc-100">
                    {isPreparing ? "Preparing Resume…" : "Generating PDF…"}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                    {isPreparing
                        ? "Collecting your resume data."
                        : "Building your PDF. This takes a moment."}
                </p>
            </div>
        </motion.div>
    );
}

function SuccessPanel({ onClose }) {
    return (
        <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 py-10 text-center"
        >
            <div className="flex h-14 w-14 items-center justify-center border border-emerald-800 bg-emerald-950/50">
                <CheckCircle2 size={24} className="text-emerald-400" aria-hidden="true" />
            </div>

            <div>
                <p className="text-sm font-semibold text-zinc-100">
                    Resume downloaded successfully.
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                    Check your downloads folder.
                </p>
            </div>

            <Button type="button" variant="outline" onClick={onClose}>
                Close
            </Button>
        </motion.div>
    );
}

function ErrorPanel({ error, onRetry, onClose }) {
    return (
        <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 py-10 text-center"
            role="alert"
        >
            <div className="flex h-14 w-14 items-center justify-center border border-red-900 bg-red-950/40">
                <X size={22} className="text-red-400" aria-hidden="true" />
            </div>

            <div>
                <p className="text-sm font-semibold text-zinc-100">
                    Unable to generate PDF.
                </p>
                <p className="mt-1 max-w-xs text-xs leading-relaxed text-zinc-500">
                    {error || "An unexpected error occurred. Please try again."}
                </p>
            </div>

            <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="button" onClick={onRetry}>
                    <RefreshCcw size={15} className="mr-2" aria-hidden="true" />
                    Retry
                </Button>
            </div>
        </motion.div>
    );
}

// ---------------------------------------------------------------------------
// Main modal
// ---------------------------------------------------------------------------

const ExportPDFModal = ({ open, onOpenChange }) => {
    const [selectedTemplate, setSelectedTemplate] = useState("professional");

    const { error, generate, reset, isLoading, isPreparing, isSuccess, isError } =
        useResumePDF();

    // Reset state when modal is opened
    useEffect(() => {
        if (open) {
            reset();
        }
    }, [open, reset]);

    // Prevent closing while generating
    const handleOpenChange = (value) => {
        if (isLoading) return;
        onOpenChange(value);
    };

    const handleExport = async () => {
        await generate(selectedTemplate);
    };

    const handleRetry = async () => {
        reset();
        await generate(selectedTemplate);
    };

    const handleClose = () => {
        if (!isLoading) {
            onOpenChange(false);
        }
    };

    const showTemplateSelector = !isLoading && !isSuccess && !isError;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="w-[95vw] max-w-lg border-zinc-800 bg-zinc-950 p-0 text-white shadow-none"
                // Prevent focus trap issues during generation
                onInteractOutside={(e) => {
                    if (isLoading) e.preventDefault();
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* ── Modal header ──────────────────────────────────── */}
                    <DialogHeader className="border-b border-zinc-800 p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-zinc-800 bg-zinc-900">
                                <Download
                                    size={20}
                                    className="text-red-500"
                                    aria-hidden="true"
                                />
                            </div>

                            <div>
                                <DialogTitle className="text-xl font-bold">
                                    Export PDF
                                </DialogTitle>
                                <DialogDescription className="mt-0.5 text-sm text-zinc-400">
                                    Choose a template and download your resume.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* ── Modal body ────────────────────────────────────── */}
                    <div className="min-h-[260px] px-6 pb-2 pt-5">
                        <AnimatePresence mode="wait">
                            {isLoading && (
                                <LoadingPanel key="loading" isPreparing={isPreparing} />
                            )}

                            {isSuccess && (
                                <SuccessPanel key="success" onClose={handleClose} />
                            )}

                            {isError && (
                                <ErrorPanel
                                    key="error"
                                    error={error}
                                    onRetry={handleRetry}
                                    onClose={handleClose}
                                />
                            )}

                            {showTemplateSelector && (
                                <motion.div
                                    key="selector"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-zinc-500">
                                        Select Template
                                    </p>

                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        {TEMPLATES.map((template) => (
                                            <TemplateCard
                                                key={template.id}
                                                template={template}
                                                selected={selectedTemplate === template.id}
                                                onSelect={setSelectedTemplate}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ── Modal footer ──────────────────────────────────── */}
                    {showTemplateSelector && (
                        <div className="flex flex-col-reverse gap-3 border-t border-zinc-800 p-6 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>

                            <Button
                                id="export-pdf-btn"
                                type="button"
                                onClick={handleExport}
                                disabled={isLoading || !selectedTemplate}
                                className="min-w-[160px]"
                            >
                                <Download size={15} className="mr-2" aria-hidden="true" />
                                Download PDF
                            </Button>
                        </div>
                    )}
                </motion.div>
            </DialogContent>
        </Dialog>
    );
};

export default ExportPDFModal;

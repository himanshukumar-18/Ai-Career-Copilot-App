import { motion } from "framer-motion";
import {
    ArrowLeft,
    Brain,
    Eye,
    FileDown,
    Loader2,
    Save,
    Share2,
    Sparkles,
} from "lucide-react";
import Button from "@/components/ui/Button";
import ResumeAutoSaveIndicator from "./ResumeAutoSaveIndicator";

const getAtsColor = (score) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
};

const ResumeEditorHeader = ({
    resume,
    saveStatus = "saved",
    isSaving = false,
    atsScore = 0,
    onBack,
    onSave,
    onPreview,
    onPublish,
    onExportPDF,
    onAIImprove,
}) => {
    const resumeTitle = resume?.title?.trim() || "Untitled Resume";

    return (
        <motion.header
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-xl"
        >
            <div className="mx-auto flex h-20 max-w-[1800px] items-center justify-between px-6">

                {/* Left — back nav + resume identity */}
                <div className="flex items-center gap-5">
                    <Button
                        variant="outline"
                        onClick={onBack}
                        aria-label="Back to resumes"
                    >
                        <ArrowLeft size={18} />
                        Back
                    </Button>

                    <div className="flex flex-col gap-0.5">
                        <h1 className="text-xl font-semibold text-white leading-tight">
                            {resumeTitle}
                        </h1>
                        <ResumeAutoSaveIndicator
                            status={saveStatus}
                            loading={isSaving}
                        />
                    </div>
                </div>

                {/* Right — actions */}
                <div className="flex items-center gap-3">

                    {/* ATS Score badge — square, score-aware color */}
                    <div className="hidden border border-zinc-800 bg-zinc-900 px-4 py-2 lg:flex lg:items-center lg:gap-2">
                        <Brain className={getAtsColor(atsScore)} size={18} aria-hidden="true" />
                        <span className="text-sm text-zinc-400">ATS</span>
                        <span className={`font-semibold ${getAtsColor(atsScore)}`}>
                            {atsScore}%
                        </span>
                    </div>

                    <Button
                        variant="outline"
                        onClick={onAIImprove}
                        disabled={isSaving}
                        aria-label="Improve resume with AI"
                    >
                        <Sparkles size={17} />
                        AI Improve
                    </Button>

                    <Button
                        variant="outline"
                        onClick={onPreview}
                        aria-label="Preview resume"
                    >
                        <Eye size={17} />
                        Preview
                    </Button>

                    <Button
                        variant="outline"
                        onClick={onExportPDF}
                        disabled={isSaving}
                        aria-label="Export resume as PDF"
                    >
                        <FileDown size={17} />
                        PDF
                    </Button>

                    <Button
                        variant="outline"
                        onClick={onPublish}
                        disabled={isSaving}
                        aria-label="Publish resume"
                    >
                        <Share2 size={17} />
                        Publish
                    </Button>

                    <Button
                        onClick={onSave}
                        disabled={isSaving}
                        aria-label={isSaving ? "Saving resume…" : "Save resume"}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                                Saving…
                            </>
                        ) : (
                            <>
                                <Save size={18} aria-hidden="true" />
                                Save
                            </>
                        )}
                    </Button>

                </div>
            </div>
        </motion.header>
    );
};

export default ResumeEditorHeader;
import { motion } from "framer-motion";
import {
    Clipboard,
    CheckCircle2,
    Sparkles,
    FileText,
} from "lucide-react";

import Button from "../../../ui/Button";

const ResumeAIImprovedContent = ({
    content = "",
    improving = false,
    onCopy,
    onApply,
}) => {
    const hasContent = Boolean(content?.trim());

    const handleCopy = async () => {
        if (!hasContent) return;

        if (onCopy) {
            onCopy(content);
            return;
        }

        try {
            await navigator.clipboard.writeText(content);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <motion.section
            initial={{
                opacity: 0,
                y: 12,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.25,
            }}
            className="border border-zinc-800 bg-zinc-950"
        >
            {/* Header */}

            <div className="flex flex-col gap-4 border-b border-zinc-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-zinc-500">
                        AI Generated
                    </p>

                    <h4 className="mt-2 text-lg font-semibold text-white">
                        Improved Content
                    </h4>

                    <p className="mt-1 text-sm text-zinc-500">
                        Review the AI-generated version before applying it to
                        your resume.
                    </p>
                </div>

                {hasContent && (
                    <div className="flex flex-wrap gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleCopy}
                        >
                            <Clipboard size={15} />
                            Copy
                        </Button>

                        <Button
                            type="button"
                            disabled={improving}
                            onClick={() => onApply?.(content)}
                        >
                            <CheckCircle2 size={15} />
                            Apply Changes
                        </Button>
                    </div>
                )}
            </div>

            {/* Body */}

            {hasContent ? (
                <div className="p-5">
                    <div className="border border-red-600/20 bg-black">
                        <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3">
                            <Sparkles
                                size={16}
                                className="text-red-600"
                            />

                            <span className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-400">
                                AI Optimized Version
                            </span>
                        </div>

                        <div className="max-h-[420px] overflow-y-auto p-5">
                            <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-zinc-300">
                                {content}
                            </pre>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
                    <div className="flex h-16 w-16 items-center justify-center border border-zinc-800 bg-black">
                        <FileText
                            size={28}
                            className="text-zinc-700"
                        />
                    </div>

                    <h4 className="mt-6 text-lg font-semibold text-white">
                        No Improved Content Yet
                    </h4>

                    <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                        Click <span className="text-red-500">AI Improve</span>{" "}
                        to generate a professionally rewritten version of this
                        resume section.
                    </p>
                </div>
            )}
        </motion.section>
    );
};

export default ResumeAIImprovedContent;
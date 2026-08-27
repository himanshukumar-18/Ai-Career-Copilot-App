import { motion } from "framer-motion";
import {
    Sparkles,
    Check,
    X,
    Clipboard,
    RotateCcw,
    LoaderCircle,
} from "lucide-react";

import Button from "../../../ui/Button";

const ResumeAISectionActions = ({
    improving = false,
    hasImprovedContent = false,

    onImprove,
    onApply,
    onReject,
    onCopy,
    onRegenerate,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-t border-zinc-800 bg-zinc-950 px-5 py-5"
        >
            <div className="flex flex-wrap items-center gap-3">
                {/* AI Improve */}

                <Button
                    type="button"
                    onClick={onImprove}
                    disabled={improving}
                    className="min-w-[170px]"
                >
                    {improving ? (
                        <>
                            <LoaderCircle
                                size={16}
                                className="animate-spin"
                            />

                            Improving...
                        </>
                    ) : (
                        <>
                            <Sparkles size={16} />

                            AI Improve
                        </>
                    )}
                </Button>

                {/* Remaining actions only after AI response */}

                {hasImprovedContent && (
                    <>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onApply}
                        >
                            <Check size={16} />

                            Apply Changes
                        </Button>

                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onCopy}
                        >
                            <Clipboard size={16} />

                            Copy
                        </Button>

                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onRegenerate}
                        >
                            <RotateCcw size={16} />

                            Regenerate
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onReject}
                        >
                            <X size={16} />

                            Reject
                        </Button>
                    </>
                )}
            </div>

            {/* Footer Note */}

            <div className="mt-4 border-t border-zinc-800 pt-4">
                <p className="text-xs leading-6 text-zinc-500">
                    AI suggestions are generated to improve ATS compatibility,
                    readability, recruiter impact, and professional writing.
                    Always review changes before applying them to your resume.
                </p>
            </div>
        </motion.div>
    );
};

export default ResumeAISectionActions;
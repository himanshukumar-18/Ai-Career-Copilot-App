import { motion } from "framer-motion";
import {
    AlertTriangle,
    RefreshCw,
    XCircle,
} from "lucide-react";

import Button from "@/components/ui/Button";

const ResumeAIError = ({
    title = "Unable to analyze your resume",
    message = "Something went wrong while generating AI insights. Please try again in a few moments.",
    onRetry,
    onDismiss,
}) => {
    return (
        <motion.section
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            exit={{
                opacity: 0,
                y: 20,
            }}
            transition={{
                duration: 0.25,
            }}
            className="border border-red-600/30 bg-zinc-950"
        >
            {/* Header */}

            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center border border-red-600/30 bg-red-600/10">
                        <AlertTriangle
                            size={22}
                            className="text-red-500"
                        />
                    </div>

                    <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-zinc-500">
                            AI Resume Copilot
                        </p>

                        <h3 className="mt-2 text-xl font-semibold text-white">
                            Analysis Failed
                        </h3>
                    </div>
                </div>

                <XCircle
                    size={20}
                    className="text-red-500"
                />
            </div>

            {/* Body */}

            <div className="px-5 py-6">
                <h4 className="text-lg font-semibold text-white">
                    {title}
                </h4>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
                    {message}
                </p>

                {/* Common Reasons */}

                <div className="mt-6 border border-zinc-800 bg-black">
                    <div className="border-b border-zinc-800 px-4 py-3">
                        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
                            Possible Reasons
                        </p>
                    </div>

                    <ul className="space-y-3 p-5 text-sm text-zinc-400">
                        <li>
                            • The AI service is temporarily unavailable.
                        </li>

                        <li>
                            • Your internet connection was interrupted.
                        </li>

                        <li>
                            • Your resume data may be incomplete.
                        </li>

                        <li>
                            • The request timed out while processing.
                        </li>
                    </ul>
                </div>

                {/* Actions */}

                <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                        type="button"
                        onClick={onRetry}
                    >
                        <RefreshCw size={16} />

                        Try Again
                    </Button>

                    {onDismiss && (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onDismiss}
                        >
                            Close
                        </Button>
                    )}
                </div>
            </div>
        </motion.section>
    );
};

export default ResumeAIError;
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronDown,
    ChevronUp,
    Sparkles,
    Check,
    X,
    Clipboard,
    BadgeCheck,
    Lightbulb,
} from "lucide-react";

import Button from "../../../ui/Button";

const getScoreColor = (score = 0) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 75) return "text-yellow-400";
    if (score >= 60) return "text-orange-400";
    return "text-red-500";
};

const ResumeAISectionCard = ({
    id,
    title,
    section,

    improving = false,

    onImprove,
    onApply,
    onReject,
}) => {
    const [expanded, setExpanded] = useState(false);

    if (!section) return null;

    const {
        score = 0,
        feedback = "",
        suggestions = [],
        improved_content = "",
    } = section;

    const handleCopy = async () => {
        if (!improved_content) return;

        try {
            await navigator.clipboard.writeText(improved_content);
        } catch {
            // Clipboard access can be unavailable outside a secure browser context.
        }
    };

    return (
        <div className="border-b border-zinc-800 last:border-none">
            {/* -------------------------------- Header ------------------------------- */}

            <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="flex w-full items-center justify-between px-5 py-5 transition hover:bg-zinc-900"
            >
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center border border-zinc-800 bg-black">
                        <BadgeCheck
                            size={20}
                            className="text-red-600"
                        />
                    </div>

                    <div className="text-left">
                        <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                            Resume Section
                        </p>

                        <h4 className="mt-1 text-lg font-semibold text-white">
                            {title}
                        </h4>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                            Score
                        </p>

                        <span
                            className={`text-2xl font-bold ${getScoreColor(
                                score
                            )}`}
                        >
                            {score}
                        </span>
                    </div>

                    {expanded ? (
                        <ChevronUp className="text-zinc-500" />
                    ) : (
                        <ChevronDown className="text-zinc-500" />
                    )}
                </div>
            </button>

            {/* ------------------------------- Content ------------------------------ */}

            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        initial={{
                            height: 0,
                            opacity: 0,
                        }}
                        animate={{
                            height: "auto",
                            opacity: 1,
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                        }}
                        transition={{
                            duration: 0.25,
                        }}
                        className="overflow-hidden border-t border-zinc-800"
                    >
                        <div className="space-y-6 bg-black p-6">
                            {/* Feedback */}

                            <div>
                                <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                                    AI Feedback
                                </p>

                                <div className="border border-zinc-800 bg-zinc-950 p-4">
                                    <p className="leading-7 text-zinc-300">
                                        {feedback}
                                    </p>
                                </div>
                            </div>

                            {/* Suggestions */}

                            <div>
                                <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                                    Suggestions
                                </p>

                                <div className="space-y-3">
                                    {suggestions.map((item, index) => (
                                        <div
                                            key={`${item}-${index}`}
                                            className="flex items-start gap-3 border border-zinc-800 bg-zinc-950 p-4"
                                        >
                                            <Lightbulb
                                                size={18}
                                                className="mt-1 text-yellow-400"
                                            />

                                            <p className="leading-7 text-zinc-300">
                                                {item}
                                            </p>
                                        </div>
                                    ))}

                                    {!suggestions.length && (
                                        <p className="border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-500">
                                            No additional suggestions are available for this section.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Improved Content */}

                            {improved_content && (
                                <div>
                                    <div className="mb-3 flex items-center justify-between">
                                        <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                                            AI Improved Version
                                        </p>

                                        <button
                                            type="button"
                                            onClick={handleCopy}
                                            className="flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
                                        >
                                            <Clipboard size={15} />

                                            Copy
                                        </button>
                                    </div>

                                    <div className="border border-red-600/30 bg-red-600/5 p-5">
                                        <pre className="whitespace-pre-wrap font-sans leading-7 text-zinc-200">
                                            {improved_content}
                                        </pre>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}

                            <div className="flex flex-wrap gap-3 border-t border-zinc-800 pt-5">
                                <Button
                                    onClick={() =>
                                        onImprove?.(id)
                                    }
                                    disabled={improving}
                                >
                                    <Sparkles size={15} />

                                    {improving
                                        ? "Improving..."
                                        : "AI Improve"}
                                </Button>

                                {improved_content && (
                                    <>
                                        {id === "summary" && onApply && (
                                            <Button
                                                variant="secondary"
                                                onClick={() =>
                                                    onApply(id, improved_content)
                                                }
                                            >
                                                <Check size={15} />

                                                Apply Changes
                                            </Button>
                                        )}

                                        <Button
                                            variant="ghost"
                                            onClick={() =>
                                                onReject?.(id)
                                            }
                                        >
                                            <X size={15} />

                                            Reject
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ResumeAISectionCard;

import { motion } from "framer-motion";
import {
    Lightbulb,
    CheckCircle2,
    Sparkles,
} from "lucide-react";

const ResumeAISectionSuggestions = ({
    suggestions = [],
}) => {
    const hasSuggestions = suggestions.length > 0;

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

            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
                <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-zinc-500">
                        AI Suggestions
                    </p>

                    <h4 className="mt-2 text-lg font-semibold text-white">
                        Recommended Improvements
                    </h4>

                    <p className="mt-1 text-sm text-zinc-500">
                        AI generated suggestions to strengthen this section.
                    </p>
                </div>

                <Sparkles
                    size={20}
                    className="text-red-600"
                />
            </div>

            {/* Body */}

            {hasSuggestions ? (
                <div className="divide-y divide-zinc-800">
                    {suggestions.map((suggestion, index) => (
                        <motion.div
                            key={`${suggestion}-${index}`}
                            initial={{
                                opacity: 0,
                                x: -10,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            transition={{
                                delay: index * 0.06,
                            }}
                            className="flex items-start gap-4 p-5 transition-colors hover:bg-zinc-900/50"
                        >
                            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-yellow-500/20 bg-yellow-500/10">
                                <Lightbulb
                                    size={18}
                                    className="text-yellow-400"
                                />
                            </div>

                            <div className="flex-1">
                                <p className="leading-7 text-zinc-300">
                                    {suggestion}
                                </p>
                            </div>

                            <CheckCircle2
                                size={18}
                                className="mt-1 text-zinc-700"
                            />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex min-h-[180px] flex-col items-center justify-center px-6 text-center">
                    <Lightbulb
                        size={34}
                        className="text-zinc-700"
                    />

                    <h4 className="mt-5 text-lg font-semibold text-white">
                        No Suggestions Available
                    </h4>

                    <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                        AI didn't find any additional recommendations for this
                        section. You're already following many resume best
                        practices.
                    </p>
                </div>
            )}
        </motion.section>
    );
};

export default ResumeAISectionSuggestions;
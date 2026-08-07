import { motion } from "framer-motion";
import {
    ArrowRight,
    Sparkles,
    Wand2,
} from "lucide-react";

import Button from "../../ui/Button";

const ResumeAIRecommendations = ({
    recommendations = [],
    onImprove,
    improving = false,
}) => {
    const hasRecommendations =
        recommendations.length > 0;

    return (
        <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="border border-zinc-800 bg-zinc-950"
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
                <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-zinc-500">
                        AI Recommendations
                    </p>

                    <h3 className="mt-2 text-xl font-semibold text-white">
                        Suggested Improvements
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                        AI has identified the highest-impact improvements for your resume.
                    </p>
                </div>

                <Sparkles
                    size={20}
                    className="text-red-600"
                />
            </div>

            {/* Body */}
            <div className="p-5">
                {hasRecommendations ? (
                    <div className="space-y-4">
                        {recommendations.map((item, index) => (
                            <motion.div
                                key={`${item}-${index}`}
                                initial={{
                                    opacity: 0,
                                    y: 10,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    delay: index * 0.08,
                                }}
                                className="border border-zinc-800 bg-black transition hover:border-red-600"
                            >
                                <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center border border-red-600/30 bg-red-600/10">
                                            <Wand2
                                                size={18}
                                                className="text-red-500"
                                            />
                                        </div>

                                        <div>
                                            <h4 className="text-base font-semibold text-white">
                                                Recommendation {index + 1}
                                            </h4>

                                            <p className="mt-2 text-sm leading-6 text-zinc-400">
                                                {item}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() =>
                                            onImprove?.(item)
                                        }
                                        disabled={improving}
                                        className="h-10 whitespace-nowrap"
                                    >
                                        <Sparkles
                                            size={15}
                                        />

                                        AI Improve

                                        <ArrowRight
                                            size={15}
                                        />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex min-h-[220px] flex-col items-center justify-center border border-dashed border-zinc-800 bg-black px-6 text-center">
                        <Sparkles
                            size={36}
                            className="text-zinc-700"
                        />

                        <h4 className="mt-5 text-lg font-semibold text-white">
                            No recommendations available
                        </h4>

                        <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                            Run an AI analysis to receive personalized
                            recommendations that can improve ATS compatibility,
                            readability, and recruiter impact.
                        </p>
                    </div>
                )}
            </div>
        </motion.section>
    );
};

export default ResumeAIRecommendations;
import { motion } from "framer-motion";
import {
    BrainCircuit,
    Sparkles,
} from "lucide-react";

const shimmer = {
    initial: {
        x: "-100%",
    },
    animate: {
        x: "100%",
    },
};

const Skeleton = ({ className = "" }) => (
    <div
        className={`relative overflow-hidden border border-zinc-800 bg-black ${className}`}
    >
        <motion.div
            variants={shimmer}
            initial="initial"
            animate="animate"
            transition={{
                repeat: Infinity,
                duration: 1.3,
                ease: "linear",
            }}
            className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-red-600/20 to-transparent"
        />
    </div>
);

const ResumeAILoading = () => {
    return (
        <motion.div
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            className="border border-zinc-800 bg-zinc-950"
        >
            {/* Header */}

            <div className="border-b border-zinc-800 px-6 py-5">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center border border-zinc-800 bg-black">
                        <BrainCircuit
                            size={22}
                            className="animate-pulse text-red-600"
                        />
                    </div>

                    <div>
                        <p className="text-[10px] uppercase tracking-[0.32em] text-zinc-500">
                            AI Resume Copilot
                        </p>

                        <h2 className="mt-1 text-xl font-semibold text-white">
                            Analyzing Resume...
                        </h2>

                        <p className="mt-1 text-sm text-zinc-500">
                            AI is reviewing your resume and generating
                            personalized insights.
                        </p>
                    </div>
                </div>
            </div>

            {/* Overall Score */}

            <div className="border-b border-zinc-800 p-6">
                <Skeleton className="h-10 w-52" />

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <Skeleton
                            key={item}
                            className="h-32"
                        />
                    ))}
                </div>
            </div>

            {/* Sections */}

            <div className="space-y-4 p-6">
                {[1, 2, 3, 4, 5].map((item) => (
                    <Skeleton
                        key={item}
                        className="h-20"
                    />
                ))}
            </div>

            {/* Footer */}

            <div className="border-t border-zinc-800 bg-black px-6 py-5">
                <div className="flex items-center gap-3">
                    <Sparkles
                        size={18}
                        className="animate-pulse text-red-600"
                    />

                    <motion.span
                        animate={{
                            opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.6,
                        }}
                        className="text-sm text-zinc-400"
                    >
                        Generating ATS analysis, strengths, weaknesses,
                        recommendations and AI improvements...
                    </motion.span>
                </div>
            </div>
        </motion.div>
    );
};

export default ResumeAILoading;
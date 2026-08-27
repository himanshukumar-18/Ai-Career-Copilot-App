import { motion } from "framer-motion";
import { Award, TrendingUp } from "lucide-react";

const getGrade = (score) => {
    if (score >= 90)
        return {
            label: "Excellent",
            color: "text-emerald-400",
        };

    if (score >= 75)
        return {
            label: "Good",
            color: "text-yellow-400",
        };

    if (score >= 60)
        return {
            label: "Average",
            color: "text-orange-400",
        };

    return {
        label: "Needs Improvement",
        color: "text-red-500",
    };
};

const ResumeAIScoreCard = ({
    score = 0,
    ats = 0,
    grammar = 0,
    readability = 0,
    impact = 0,
}) => {
    const grade = getGrade(score);

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
                        AI Resume Score
                    </p>

                    <h3 className="mt-2 text-xl font-semibold text-white">
                        Overall Analysis
                    </h3>
                </div>

                <Award
                    size={20}
                    className="text-red-600"
                />
            </div>

            {/* Body */}
            <div className="grid gap-8 p-6 lg:grid-cols-[260px_1fr]">
                {/* Left */}
                <div className="flex flex-col items-center justify-center border border-zinc-800 bg-black px-6 py-8">
                    <motion.h2
                        initial={{ scale: 0.85 }}
                        animate={{ scale: 1 }}
                        transition={{
                            duration: 0.35,
                        }}
                        className="text-7xl font-bold tracking-tight text-white"
                    >
                        {score}
                    </motion.h2>

                    <span className="mt-2 text-sm uppercase tracking-[0.28em] text-zinc-500">
                        Overall Score
                    </span>

                    <span
                        className={`mt-5 text-sm font-semibold ${grade.color}`}
                    >
                        {grade.label}
                    </span>
                </div>

                {/* Right */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <ScoreItem
                        label="ATS Score"
                        value={ats}
                    />

                    <ScoreItem
                        label="Grammar"
                        value={grammar}
                    />

                    <ScoreItem
                        label="Readability"
                        value={readability}
                    />

                    <ScoreItem
                        label="Impact"
                        value={impact}
                    />
                </div>
            </div>
        </motion.section>
    );
};

function ScoreItem({ label, value }) {
    return (
        <div className="border border-zinc-800 bg-black p-5 transition hover:border-red-600">
            <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                    {label}
                </span>

                <TrendingUp
                    size={15}
                    className="text-red-600"
                />
            </div>

            <div className="mt-5 flex items-end gap-2">
                <span className="text-4xl font-bold text-white">
                    {value}
                </span>

                <span className="mb-1 text-sm text-zinc-500">
                    /100
                </span>
            </div>

            <div className="mt-5 h-2 overflow-hidden border border-zinc-800 bg-zinc-900">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{
                        duration: 0.8,
                        ease: "easeOut",
                    }}
                    className="h-full bg-red-600"
                />
            </div>
        </div>
    );
}

export default ResumeAIScoreCard;
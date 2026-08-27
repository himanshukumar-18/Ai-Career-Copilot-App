import { motion } from "framer-motion";
import { AlertTriangle, ShieldAlert } from "lucide-react";

const ResumeAIWeaknesses = ({ weaknesses = [] }) => {
    const hasWeaknesses = weaknesses.length > 0;

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
                        AI Analysis
                    </p>

                    <h3 className="mt-2 text-xl font-semibold text-white">
                        Improvement Areas
                    </h3>
                </div>

                <ShieldAlert
                    size={20}
                    className="text-red-600"
                />
            </div>

            {/* Body */}
            <div className="p-5">
                {hasWeaknesses ? (
                    <div className="space-y-4">
                        {weaknesses.map((weakness, index) => (
                            <motion.div
                                key={`${weakness}-${index}`}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    delay: index * 0.08,
                                }}
                                className="flex items-start gap-4 border border-zinc-800 bg-black p-4 transition-colors hover:border-red-600"
                            >
                                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center border border-red-600/30 bg-red-600/10">
                                    <AlertTriangle
                                        size={18}
                                        className="text-red-500"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm leading-6 text-zinc-300">
                                        {weakness}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex min-h-[180px] flex-col items-center justify-center border border-dashed border-zinc-800 bg-black px-6 text-center">
                        <ShieldAlert
                            size={34}
                            className="text-zinc-700"
                        />

                        <h4 className="mt-5 text-lg font-semibold text-white">
                            No improvement areas found
                        </h4>

                        <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                            Great work! AI didn't detect any major issues in
                            your resume. Continue refining your content to keep
                            it competitive.
                        </p>
                    </div>
                )}
            </div>
        </motion.section>
    );
};

export default ResumeAIWeaknesses;
import { motion } from "framer-motion";
import {
    BrainCircuit,
    MessageSquareText,
} from "lucide-react";

const ResumeAISectionFeedback = ({
    feedback = "",
}) => {
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
                        AI Review
                    </p>

                    <h4 className="mt-2 text-lg font-semibold text-white">
                        Feedback
                    </h4>
                </div>

                <BrainCircuit
                    size={20}
                    className="text-red-600"
                />
            </div>

            {/* Body */}

            {feedback ? (
                <div className="p-5">
                    <div className="border border-zinc-800 bg-black p-5">
                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-red-600/20 bg-red-600/10">
                                <MessageSquareText
                                    size={18}
                                    className="text-red-500"
                                />
                            </div>

                            <div>
                                <p className="text-sm leading-7 text-zinc-300">
                                    {feedback}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex min-h-[180px] flex-col items-center justify-center px-6 text-center">
                    <MessageSquareText
                        size={34}
                        className="text-zinc-700"
                    />

                    <h4 className="mt-5 text-lg font-semibold text-white">
                        No Feedback Available
                    </h4>

                    <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                        AI feedback will appear here after the resume
                        analysis is completed.
                    </p>
                </div>
            )}
        </motion.section>
    );
};

export default ResumeAISectionFeedback;
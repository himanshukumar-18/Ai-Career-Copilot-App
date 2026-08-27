import { motion } from "framer-motion";
import {
    Search,
    Tags,
    CircleAlert,
} from "lucide-react";

const ResumeAIKeywords = ({
    keywords = [],
}) => {
    const hasKeywords = keywords.length > 0;

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
                        ATS Optimization
                    </p>

                    <h3 className="mt-2 text-xl font-semibold text-white">
                        Missing Keywords
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                        Recommended keywords that may improve ATS compatibility.
                    </p>
                </div>

                <Search
                    size={20}
                    className="text-red-600"
                />
            </div>

            {/* Body */}
            <div className="p-5">
                {hasKeywords ? (
                    <>
                        <div className="mb-5 flex items-center gap-2 border border-red-600/20 bg-red-600/5 px-4 py-3">
                            <CircleAlert
                                size={18}
                                className="text-red-500"
                            />

                            <p className="text-sm text-zinc-300">
                                Adding these keywords naturally throughout your
                                resume can improve visibility in Applicant
                                Tracking Systems.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {keywords.map((keyword, index) => (
                                <motion.div
                                    key={`${keyword}-${index}`}
                                    initial={{
                                        opacity: 0,
                                        scale: 0.9,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                    }}
                                    transition={{
                                        delay: index * 0.05,
                                    }}
                                    className="group flex items-center gap-2 border border-zinc-800 bg-black px-4 py-2 transition-all duration-200 hover:border-red-600"
                                >
                                    <Tags
                                        size={15}
                                        className="text-red-500"
                                    />

                                    <span className="text-sm font-medium text-zinc-200">
                                        {keyword}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex min-h-[180px] flex-col items-center justify-center border border-dashed border-zinc-800 bg-black px-6 text-center">
                        <Search
                            size={34}
                            className="text-zinc-700"
                        />

                        <h4 className="mt-5 text-lg font-semibold text-white">
                            No missing keywords
                        </h4>

                        <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                            Excellent! Your resume already includes the important
                            keywords needed for ATS optimization.
                        </p>
                    </div>
                )}
            </div>
        </motion.section>
    );
};

export default ResumeAIKeywords;
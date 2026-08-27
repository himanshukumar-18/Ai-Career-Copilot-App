import { motion } from "framer-motion";

const ResumeProgress = ({
    value = 0,
    label = "Completion",
    showPercentage = true,
}) => {
    const progress = Math.max(0, Math.min(value, 100));

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                    {label}
                </p>

                {showPercentage && (
                    <span className="text-sm font-semibold text-white">
                        {progress}%
                    </span>
                )}
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 overflow-hidden rounded-full border border-zinc-800 bg-zinc-900">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{
                        duration: 0.6,
                        ease: "easeOut",
                    }}
                    className="absolute left-0 top-0 h-full rounded-full bg-red-600"
                />
            </div>
        </div>
    );
};

export default ResumeProgress;
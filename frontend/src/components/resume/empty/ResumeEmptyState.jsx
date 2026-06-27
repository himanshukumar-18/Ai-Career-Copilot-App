import { FilePlus2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import Button from "@/components/ui/Button";

const ResumeEmptyState = ({ onCreateResume }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="
        flex
        items-center
        justify-center
      "
        >
            <div
                className="
          w-full
          border
          border-zinc-800
          bg-[var(--surface)]
          p-20
          text-center
        "
            >
                {/* Icon */}
                <div
                    className="
            mx-auto
            flex
            h-20
            w-20
            items-center
            justify-center
            border
            border-zinc-800
            bg-zinc-900
          "
                >
                    <FilePlus2
                        size={36}
                        className="text-red-500"
                    />
                </div>

                {/* Badge */}
                <div className="mt-6 inline-flex items-center gap-2  border border-zinc-800 bg-zinc-900 px-4 py-2">
                    <Sparkles
                        size={16}
                        className="text-red-500"
                    />

                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
                        Resume Builder
                    </span>
                </div>

                {/* Heading */}
                <h2 className="mt-6 text-3xl font-bold text-white">
                    No Resume Found
                </h2>

                {/* Description */}
                <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-zinc-400">
                    Create your first professional resume and start building an
                    ATS-friendly profile that is ready for recruiters and job
                    applications.
                </p>

                {/* Action */}
                <div className="mt-10">
                    <Button
                        onClick={onCreateResume}
                        className="inline-flex items-center gap-2"
                    >
                        <FilePlus2 size={18} />

                        <span>Create Resume</span>
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default ResumeEmptyState;
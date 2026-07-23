import { motion } from "framer-motion";
import {
  Sparkles,
  Clock3,
} from "lucide-react";

const Roadmap = () => {
  return (
    <div className="min-h-[calc(100vh-80px)">
      <div className="mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-zinc-800 bg-[var(--surface)]"
        >
          {/* Coming Soon */}
          <div className="flex flex-col items-center justify-center px-8 py-24 text-center">

            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
            >
              <Sparkles className="h-20 w-20 text-red-500" />
            </motion.div>

            <h2 className="mt-8 text-5xl font-black uppercase tracking-[0.12em] text-white md:text-7xl">
              Coming Soon
            </h2>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
              Your personalized AI roadmap is under development. It will guide
              you step-by-step toward becoming a professional software engineer
              with structured learning plans, real-world projects, interview
              preparation, and career milestones.
            </p>

            <div className="mt-10 flex items-center gap-3 border border-red-500/30 bg-red-500/10 px-6 py-3">
              <Clock3 className="h-5 w-5 text-red-500" />
              <span className="text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
                Under Development
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Roadmap;
import { motion } from "framer-motion";
import { Sparkles, Brain, CheckCircle2 } from "lucide-react";

const RoadmapGenerateCard = ({ roleTitle }) => {
    const steps = [
        "Analyzing student profile & projects",
        "Evaluating missing & strong skills",
        "Ordering phases & prerequisite steps",
        "Synthesizing practice tasks & capstones",
    ];

    return (
        <div className="flex flex-col items-center justify-center border border-zinc-800 bg-[var(--surface)] p-12 text-center">
            <motion.div
                animate={{ rotate: [0, 180, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="flex h-16 w-16 items-center justify-center border border-red-500/40 bg-red-500/10 text-red-500"
            >
                <Brain className="h-8 w-8" />
            </motion.div>

            <h3 className="mt-6 text-xl font-black uppercase tracking-wider text-white">
                AI Mentor Crafting Your Path
            </h3>
            <p className="mt-2 max-w-md text-sm text-zinc-400">
                Generating personalized <span className="text-red-400 font-semibold">{roleTitle || "Career Goal"}</span> roadmap via LangChain & ChatGroq...
            </p>

            <div className="mt-8 grid w-full max-w-md grid-cols-1 gap-3 text-left">
                {steps.map((text, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.4 }}
                        className="flex items-center gap-3 border border-zinc-800/80 bg-zinc-900/60 p-3 text-xs text-zinc-300"
                    >
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-red-500" />
                        <span>{text}</span>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 flex items-center gap-2 border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-mono uppercase tracking-widest text-red-400">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>LangChain + ChatGroq Active</span>
            </div>
        </div>
    );
};

export default RoadmapGenerateCard;

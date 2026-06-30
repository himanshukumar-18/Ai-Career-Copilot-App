import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight } from "lucide-react";

const ResumeSectionItem = ({
    icon: Icon,
    title,
    active = false,
    completed = false,
    disabled = false,
    badge = null,
    onClick,
}) => {
    return (
        <motion.button
            whileHover={!disabled ? { x: 3 } : {}}
            whileTap={!disabled ? { x: 1 } : {}}
            type="button"
            disabled={disabled}
            onClick={onClick}
            aria-current={active ? "page" : undefined}
            aria-disabled={disabled}
            className={`
        group flex w-full items-center justify-between
        border px-4 py-3 text-left
        transition-all duration-200
        ${active
                    ? "border-red-500 bg-red-500/10"
                    : "border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800"
                }
        ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
      `}
        >
            {/* Left */}
            <div className="flex items-center gap-3">
                <div
                    aria-hidden="true"
                    className={`
            flex h-10 w-10 items-center justify-center
            transition-colors
            ${active
                            ? "bg-red-500 text-white"
                            : "bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-white"
                        }
          `}
                >
                    {Icon && <Icon size={18} />}
                </div>

                <div>
                    <p
                        className={`text-sm font-medium ${active ? "text-white" : "text-zinc-300"
                            }`}
                    >
                        {title}
                    </p>

                    {badge && (
                        <span className="mt-1 inline-flex border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                            {badge}
                        </span>
                    )}
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
                {completed && (
                    <CheckCircle2
                        size={16}
                        className="text-emerald-500"
                        aria-label="Section complete"
                    />
                )}
                <ChevronRight
                    size={16}
                    aria-hidden="true"
                    className={`transition-transform ${active
                            ? "translate-x-1 text-red-400"
                            : "text-zinc-600 group-hover:translate-x-1 group-hover:text-zinc-400"
                        }`}
                />
            </div>
        </motion.button>
    );
};

export default ResumeSectionItem;
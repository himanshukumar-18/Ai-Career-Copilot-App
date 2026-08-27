import { useState } from "react";
import { motion } from "framer-motion";
import { Server, Layout, Cpu, Code, ArrowRight, Search, Sparkles } from "lucide-react";

const getRoleIcon = (iconName) => {
    switch (iconName?.toLowerCase()) {
        case "server":
            return <Server className="h-5 w-5 text-red-500" />;
        case "layout":
            return <Layout className="h-5 w-5 text-red-500" />;
        case "cpu":
            return <Cpu className="h-5 w-5 text-red-500" />;
        default:
            return <Code className="h-5 w-5 text-red-500" />;
    }
};

const POPULAR_SUGGESTIONS = [
    "Backend Developer",
    "Frontend Developer",
    "Full Stack Developer",
    "DevOps & Cloud Engineer",
    "Data Scientist & AI Engineer",
    "Mobile App Developer",
    "Cybersecurity Specialist",
    "Golang Microservices Developer",
    "Flutter Mobile Engineer",
];

const CareerRoleSelector = ({
    roles = [],
    selectedRoleSlug,
    onSelectRole,
    onGenerate,
    isGenerating,
    rolesError,
    onRetry,
}) => {
    const [customInput, setCustomInput] = useState("");

    const handleCustomInputSubmit = (e) => {
        e.preventDefault();
        const trimmed = customInput.trim();
        if (trimmed) {
            onGenerate(trimmed);
        }
    };

    const handleSuggestionClick = (title) => {
        setCustomInput(title);
        // Find matching role slug if present in backend list
        const match = roles.find(
            (r) => r.title.toLowerCase() === title.toLowerCase() || r.slug === title.toLowerCase()
        );
        if (match) {
            onSelectRole(match.slug);
        } else {
            onSelectRole(title);
        }
    };

    const activeTarget = customInput.trim() || selectedRoleSlug;

    return (
        <div className="border border-zinc-800 bg-[var(--surface)] p-6">
            {/* Title Section */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="flex items-center gap-2 text-xl font-bold uppercase tracking-wider text-white">
                        <Sparkles className="h-5 w-5 text-red-500" />
                        Select or Type Target Career Goal
                    </h2>
                    <p className="mt-1 text-sm text-zinc-400">
                        Choose a featured track below or type any custom role/technology stack.
                    </p>
                </div>
            </div>

            {/* Custom Input Search Bar */}
            <form onSubmit={handleCustomInputSubmit} className="mb-6 space-y-3">
                <div className="relative flex items-center">
                    <Search className="absolute left-4 h-5 w-5 text-zinc-500" />
                    <input
                        type="text"
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder="Type any custom career role or tech stack... e.g. Golang Developer, Flutter App Engineer, AI/ML Architect"
                        className="w-full border border-zinc-800 bg-zinc-900/90 py-3.5 pl-12 pr-36 text-sm text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/50"
                    />
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={!customInput.trim() || isGenerating}
                        className="absolute right-2 border border-red-500 bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-red-500 disabled:opacity-40"
                    >
                        {isGenerating ? "Generating..." : "Generate Custom Path"}
                    </motion.button>
                </div>

                {/* Popular Suggestion Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Quick Suggestions:</span>
                    {POPULAR_SUGGESTIONS.map((suggestion) => (
                        <button
                            key={suggestion}
                            type="button"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-xs text-zinc-300 hover:border-zinc-700 hover:text-white transition-all"
                        >
                            + {suggestion}
                        </button>
                    ))}
                </div>
            </form>

            <div className="mb-4 border-t border-zinc-800/80 pt-4">
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 mb-4">
                    Featured Career Paths
                </h3>
            </div>

            {/* Featured Roles Grid */}
            {roles.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {roles.map((role) => {
                        const isSelected = role.slug === selectedRoleSlug && !customInput;
                        return (
                            <motion.div
                                key={role.id}
                                whileHover={{ y: -2 }}
                                onClick={() => {
                                    setCustomInput("");
                                    onSelectRole(role.slug);
                                }}
                                className={`cursor-pointer border p-5 transition-all ${
                                    isSelected
                                        ? "border-red-500 bg-red-500/5 shadow-lg shadow-red-500/10"
                                        : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex h-9 w-9 items-center justify-center border border-zinc-800 bg-zinc-900">
                                        {getRoleIcon(role.icon_name)}
                                    </div>
                                    <span className="border border-zinc-800 bg-zinc-900 px-2 py-0.5 font-mono text-[10px] uppercase text-zinc-400">
                                        {role.difficulty || "Intermediate"}
                                    </span>
                                </div>

                                <h3 className="mt-3 text-base font-bold text-white">
                                    {role.title}
                                </h3>
                                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                                    {role.description}
                                </p>

                                <div className="mt-4 flex items-center justify-between border-t border-zinc-800/80 pt-3 text-xs text-zinc-500">
                                    <span>Est. {role.estimated_duration_weeks || 16} Weeks</span>
                                    <span className="flex items-center gap-1 text-red-400 font-semibold">
                                        Select <ArrowRight className="h-3 w-3" />
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className="border border-zinc-800/80 bg-zinc-900/40 p-8 text-center">
                    <p className="text-sm text-zinc-400">
                        {rolesError ? rolesError.message || "Failed to load featured career roles." : "No featured roles available right now."}
                    </p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="mt-4 border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-200 hover:border-red-500 hover:text-white"
                        >
                            Retry Loading Roles
                        </button>
                    )}
                </div>
            )}

            {/* Bottom Generate Button for Selected Card */}
            {activeTarget && !customInput && (
                <div className="mt-6 flex justify-end border-t border-zinc-800/80 pt-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onGenerate(activeTarget)}
                        disabled={isGenerating}
                        className="flex items-center gap-2 border border-red-500 bg-red-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-red-600/20 hover:bg-red-500 disabled:opacity-50"
                    >
                        <span>{isGenerating ? "Analyzing & Generating..." : `Generate AI Roadmap for ${activeTarget}`}</span>
                        <ArrowRight className="h-4 w-4" />
                    </motion.button>
                </div>
            )}
        </div>
    );
};

export default CareerRoleSelector;

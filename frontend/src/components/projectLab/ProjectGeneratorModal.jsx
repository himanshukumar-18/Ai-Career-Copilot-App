import React, { useState } from "react";
import { Sparkles, Plus, X, BookmarkCheck, Loader2, Clock, Check } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import ProjectDifficultyBadge from "./ProjectDifficultyBadge";

const COMMON_TECHS = [
    "Python", "Django", "React", "Node.js", "TypeScript",
    "PostgreSQL", "FastAPI", "Docker", "Tailwind CSS", "Next.js"
];

export const ProjectGeneratorModal = ({
    isOpen,
    onClose,
    onGenerate,
    onSaveProject,
    generatedProjects = [],
    isGenerating = false,
    isSaving = false,
    generateError = null,
    savedProjectIds = [],
}) => {
    const [techInput, setTechInput] = useState("");
    const [techStack, setTechStack] = useState(["Python", "Django", "React"]);
    const [difficulty, setDifficulty] = useState("medium");
    const [count, setCount] = useState(3);
    const [savedLocalIds, setSavedLocalIds] = useState([]);

    if (!isOpen) return null;

    const handleAddTech = (techToAdd) => {
        const trimmed = (techToAdd || techInput).trim();
        if (trimmed && !techStack.includes(trimmed) && techStack.length < 10) {
            setTechStack([...techStack, trimmed]);
            setTechInput("");
        }
    };

    const handleRemoveTech = (techToRemove) => {
        setTechStack(techStack.filter((t) => t !== techToRemove));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            handleAddTech();
        }
    };

    const handleSubmitGeneration = (e) => {
        e.preventDefault();
        if (techStack.length === 0) return;
        onGenerate({
            tech_stack: techStack,
            difficulty,
            count: Number(count),
        });
    };

    const handleSave = async (generatedId) => {
        try {
            await onSaveProject(generatedId);
            setSavedLocalIds((prev) => [...prev, generatedId]);
        } catch {
            // error handled by parent / hook
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="relative my-8 w-full max-w-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                    <div className="flex h-10 w-10 items-center justify-center border border-red-500/30 bg-red-500/10 text-red-500">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="font-mono text-lg font-bold uppercase tracking-wider text-[var(--text-primary)]">
                            AI Project Generator
                        </h2>
                        <p className="text-xs text-[var(--text-secondary)] font-mono">
                            Generate tailored coding projects for your portfolio
                        </p>
                    </div>
                </div>

                {/* Generation Request Form */}
                <form onSubmit={handleSubmitGeneration} className="mt-6 space-y-5">
                    {/* Tech Stack Input */}
                    <div>
                        <label className="block font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                            Tech Stack (1 - 10 technologies)
                        </label>
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Type technology and press Enter (e.g. Docker)..."
                                value={techInput}
                                onChange={(e) => setTechInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isGenerating}
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => handleAddTech()}
                                disabled={!techInput.trim() || isGenerating}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Selected Tech Chips */}
                        <div className="mt-3 flex flex-wrap gap-2">
                            {techStack.map((tech, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center gap-1.5 border border-zinc-700 bg-zinc-900 px-2.5 py-1 font-mono text-xs text-zinc-200"
                                >
                                    <span>{tech}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTech(tech)}
                                        className="text-zinc-400 hover:text-red-400"
                                        disabled={isGenerating}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                        </div>

                        {/* Common Quick Picks */}
                        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                            <span className="font-mono text-[10px] uppercase text-[var(--text-muted)] mr-1">
                                Quick add:
                            </span>
                            {COMMON_TECHS.map((tech) => (
                                <button
                                    key={tech}
                                    type="button"
                                    onClick={() => handleAddTech(tech)}
                                    disabled={techStack.includes(tech) || isGenerating}
                                    className="border border-zinc-800 bg-black/40 px-2 py-0.5 font-mono text-[10px] text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 disabled:opacity-40"
                                >
                                    + {tech}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Difficulty & Count Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Difficulty */}
                        <div>
                            <label className="block font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                                Difficulty Level
                            </label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                disabled={isGenerating}
                                className="w-full h-11 border border-[var(--border)] bg-[var(--surface)] px-3 font-mono text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                            >
                                <option value="easy">Easy (Scope: 10 - 30 hrs)</option>
                                <option value="medium">Medium (Scope: 30 - 80 hrs)</option>
                                <option value="hard">Hard (Scope: 80 - 150 hrs)</option>
                            </select>
                        </div>

                        {/* Count */}
                        <div>
                            <label className="block font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                                Number of Projects
                            </label>
                            <select
                                value={count}
                                onChange={(e) => setCount(Number(e.target.value))}
                                disabled={isGenerating}
                                className="w-full h-11 border border-[var(--border)] bg-[var(--surface)] px-3 font-mono text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                            >
                                <option value={1}>1 Project Idea</option>
                                <option value={2}>2 Project Ideas</option>
                                <option value={3}>3 Project Ideas</option>
                                <option value={4}>4 Project Ideas</option>
                                <option value={5}>5 Project Ideas</option>
                            </select>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {generateError && (
                        <div className="border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-400 font-mono">
                            {generateError}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={isGenerating}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="danger"
                            disabled={techStack.length === 0 || isGenerating}
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating Ideas...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Generate Projects
                                </>
                            )}
                        </Button>
                    </div>
                </form>

                {/* Generated Projects Results Display */}
                {generatedProjects.length > 0 && (
                    <div className="mt-8 border-t border-[var(--border)] pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                                Generated Project Suggestions ({generatedProjects.length})
                            </h3>
                            <span className="font-mono text-[10px] text-[var(--text-muted)]">
                                Click "Save Project" to add to your workspace
                            </span>
                        </div>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                            {generatedProjects.map((item) => {
                                const isSaved =
                                    savedLocalIds.includes(item.id) ||
                                    savedProjectIds.includes(item.id);

                                return (
                                    <div
                                        key={item.id}
                                        className="border border-[var(--border)] bg-[var(--background)] p-4"
                                    >
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-2">
                                                <ProjectDifficultyBadge difficulty={item.difficulty} />
                                                <span className="font-mono text-xs text-[var(--text-muted)] flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {item.estimated_hours}h
                                                </span>
                                            </div>

                                            <Button
                                                variant={isSaved ? "secondary" : "primary"}
                                                disabled={isSaved || isSaving}
                                                onClick={() => handleSave(item.id)}
                                                className="h-8 px-3 text-[11px] self-start sm:self-auto"
                                            >
                                                {isSaved ? (
                                                    <>
                                                        <Check className="mr-1 h-3.5 w-3.5 text-emerald-400" />
                                                        Saved
                                                    </>
                                                ) : (
                                                    <>
                                                        <BookmarkCheck className="mr-1 h-3.5 w-3.5" />
                                                        Save Project
                                                    </>
                                                )}
                                            </Button>
                                        </div>

                                        <h4 className="mt-3 font-mono text-sm font-bold text-[var(--text-primary)]">
                                            {item.title}
                                        </h4>
                                        <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
                                            {item.description}
                                        </p>

                                        {/* Features List */}
                                        {item.features?.length > 0 && (
                                            <div className="mt-3">
                                                <span className="font-mono text-[10px] uppercase text-[var(--text-muted)] block mb-1">
                                                    Key Features:
                                                </span>
                                                <ul className="list-disc list-inside text-xs text-zinc-400 space-y-0.5">
                                                    {item.features.map((feat, idx) => (
                                                        <li key={idx}>{feat}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Tech Stack */}
                                        {item.tech_stack?.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-1">
                                                {item.tech_stack.map((t, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="border border-zinc-800 bg-zinc-900 px-2 py-0.5 font-mono text-[10px] text-zinc-400"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectGeneratorModal;

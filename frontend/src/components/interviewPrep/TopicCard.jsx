import React, { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen, CheckSquare, Sparkles, Folder } from "lucide-react";
import ResourceCard from "./ResourceCard";

const TopicCard = ({ topic, onGenerateQuestions, isGeneratingQuestions }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const {
        id,
        title,
        category,
        difficulty,
        priority,
        proficiency_status,
        what_to_study = [],
        what_to_practice = [],
        resources = [],
    } = topic;

    const getProficiencyBadge = (status) => {
        switch (status) {
            case "priority":
                return "bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/40";
            case "weak":
                return "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/40";
            case "strong":
                return "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/40";
            case "missing":
                return "bg-purple-500/10 text-purple-400 border-purple-500/40";
            default:
                return "bg-gray-500/10 text-gray-400 border-gray-500/40";
        }
    };

    return (
        <div className="border border-[var(--border)] bg-[var(--surface)] mb-4">
            {/* Header / Click to Expand */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
            >
                <div className="flex items-start md:items-center gap-3">
                    <span className="font-mono text-xs text-[var(--text-muted)] border border-[var(--border)] px-2 py-1">
                        #{priority}
                    </span>
                    <div>
                        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                            {title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1 font-mono text-[11px]">
                            <span className="text-[var(--text-muted)] capitalize">
                                Category: {category}
                            </span>
                            <span className="text-[var(--text-muted)]">•</span>
                            <span className="text-[var(--text-muted)] capitalize">
                                Difficulty: {difficulty}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider border ${getProficiencyBadge(proficiency_status)}`}>
                        {proficiency_status}
                    </span>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onGenerateQuestions(id);
                        }}
                        disabled={isGeneratingQuestions}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--background)] border border-[var(--accent)] text-[var(--accent-light)] hover:bg-[var(--accent)] hover:text-white text-xs font-mono uppercase tracking-wider transition-all disabled:opacity-50"
                    >
                        <Sparkles size={12} />
                        <span>Questions</span>
                    </button>

                    <button className="text-[var(--text-muted)] hover:text-white">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                </div>
            </div>

            {/* Expanded Body */}
            {isExpanded && (
                <div className="border-t border-[var(--border)] p-5 bg-[var(--background)]/50 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* What to study */}
                        <div>
                            <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-3 flex items-center gap-1.5">
                                <BookOpen size={14} className="text-[var(--accent)]" />
                                Concepts to Master
                            </h4>
                            <ul className="space-y-2">
                                {what_to_study.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-xs text-[var(--text-primary)] font-mono bg-[var(--surface)] p-2.5 border border-[var(--border)]">
                                        <span className="text-[var(--accent)]">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* What to practice */}
                        <div>
                            <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-3 flex items-center gap-1.5">
                                <CheckSquare size={14} className="text-[var(--success)]" />
                                Practice Exercises
                            </h4>
                            <ul className="space-y-2">
                                {what_to_practice.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-xs text-[var(--text-primary)] font-mono bg-[var(--surface)] p-2.5 border border-[var(--border)]">
                                        <span className="text-[var(--success)]">✓</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Resources */}
                    {resources.length > 0 && (
                        <div>
                            <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-3 flex items-center gap-1.5">
                                <Folder size={14} className="text-blue-400" />
                                Curated Resources ({resources.length})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {resources.map((res) => (
                                    <ResourceCard key={res.id || res.title} resource={res} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TopicCard;

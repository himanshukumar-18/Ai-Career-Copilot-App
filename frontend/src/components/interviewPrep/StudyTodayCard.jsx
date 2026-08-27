import React from "react";
import { BookOpen, ArrowRight, ExternalLink, Award } from "lucide-react";

const StudyTodayCard = ({ studyToday }) => {
    if (!studyToday || !studyToday.has_plan) return null;

    const {
        target_role,
        priority_topic,
        category,
        what_to_study = [],
        what_to_practice = [],
        resources = [],
    } = studyToday;

    return (
        <div className="border border-[var(--border)] bg-[var(--surface)] p-6 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-[var(--border)]">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="p-1 bg-[var(--accent)]/10 text-[var(--accent)] font-mono text-[10px] uppercase tracking-wider border border-[var(--accent)]/20 px-2 py-0.5">
                            Daily Focus Focus
                        </span>
                        <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                            Target: {target_role}
                        </span>
                    </div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <BookOpen size={20} className="text-[var(--accent)]" />
                        Today's Recommended Focus Area: <span className="text-[var(--accent-light)]">{priority_topic}</span>
                    </h2>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[var(--border)] bg-[var(--background)] font-mono text-xs text-[var(--text-secondary)] capitalize">
                    <Award size={14} className="text-[var(--warning)]" />
                    <span>Category: {category}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Concepts to Study */}
                <div>
                    <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-3 flex items-center gap-1.5">
                        <ArrowRight size={12} className="text-[var(--accent)]" />
                        Core Concepts to Study Today
                    </h3>
                    <ul className="space-y-2">
                        {what_to_study.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-[var(--text-primary)] bg-[var(--background)] p-2.5 border border-[var(--border)]">
                                <span className="font-mono text-[var(--accent)] font-bold">{idx + 1}.</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Tasks to Practice & Resources */}
                <div>
                    <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-3 flex items-center gap-1.5">
                        <ArrowRight size={12} className="text-[var(--success)]" />
                        Practice Tasks & Resources
                    </h3>
                    <ul className="space-y-2 mb-4">
                        {what_to_practice.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-[var(--text-primary)] bg-[var(--background)] p-2.5 border border-[var(--border)]">
                                <span className="font-mono text-[var(--success)] font-bold">✓</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>

                    {resources.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {resources.map((r, idx) => (
                                <a
                                    key={idx}
                                    href={r.url || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border)] bg-[var(--background)] hover:border-[var(--accent)] text-xs text-[var(--text-secondary)] hover:text-white transition-all font-mono"
                                >
                                    <span>{r.title}</span>
                                    <ExternalLink size={12} />
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudyTodayCard;

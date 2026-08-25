import React from "react";
import { AlertCircle, CheckCircle, HelpCircle, Flame } from "lucide-react";

const SkillGapAnalysis = ({ topics = [] }) => {
    if (!topics.length) return null;

    const priorityTopics = topics.filter((t) => t.proficiency_status === "priority");
    const weakTopics = topics.filter((t) => t.proficiency_status === "weak");
    const strongTopics = topics.filter((t) => t.proficiency_status === "strong");
    const missingTopics = topics.filter((t) => t.proficiency_status === "missing");

    return (
        <div className="border border-[var(--border)] bg-[var(--surface)] p-6 mb-8">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">
                AI Skill Gap Diagnostics
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-mono mb-6">
                Automated alignment analysis comparing candidate profile & project portfolio against target role standards.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Priority Focus */}
                <div className="border border-[var(--accent)]/40 bg-[var(--accent)]/5 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Flame size={16} className="text-[var(--accent)]" />
                        <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--accent)] font-bold">
                            Priority Focus ({priorityTopics.length})
                        </h3>
                    </div>
                    <ul className="space-y-2">
                        {priorityTopics.map((t) => (
                            <li key={t.id} className="text-xs text-white font-mono bg-[var(--background)] p-2 border border-[var(--border)]">
                                {t.title}
                            </li>
                        ))}
                        {priorityTopics.length === 0 && (
                            <li className="text-xs text-[var(--text-muted)] font-mono">None flagged.</li>
                        )}
                    </ul>
                </div>

                {/* Weak Areas */}
                <div className="border border-[var(--warning)]/40 bg-[var(--warning)]/5 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertCircle size={16} className="text-[var(--warning)]" />
                        <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--warning)] font-bold">
                            Weak Areas ({weakTopics.length})
                        </h3>
                    </div>
                    <ul className="space-y-2">
                        {weakTopics.map((t) => (
                            <li key={t.id} className="text-xs text-white font-mono bg-[var(--background)] p-2 border border-[var(--border)]">
                                {t.title}
                            </li>
                        ))}
                        {weakTopics.length === 0 && (
                            <li className="text-xs text-[var(--text-muted)] font-mono">No weak areas identified.</li>
                        )}
                    </ul>
                </div>

                {/* Strong Areas */}
                <div className="border border-[var(--success)]/40 bg-[var(--success)]/5 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <CheckCircle size={16} className="text-[var(--success)]" />
                        <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--success)] font-bold">
                            Strong Areas ({strongTopics.length})
                        </h3>
                    </div>
                    <ul className="space-y-2">
                        {strongTopics.map((t) => (
                            <li key={t.id} className="text-xs text-white font-mono bg-[var(--background)] p-2 border border-[var(--border)]">
                                {t.title}
                            </li>
                        ))}
                        {strongTopics.length === 0 && (
                            <li className="text-xs text-[var(--text-muted)] font-mono">Build foundational skills first.</li>
                        )}
                    </ul>
                </div>

                {/* Missing Competencies */}
                <div className="border border-purple-500/40 bg-purple-500/5 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <HelpCircle size={16} className="text-purple-400" />
                        <h3 className="font-mono text-xs uppercase tracking-wider text-purple-400 font-bold">
                            Missing Skills ({missingTopics.length})
                        </h3>
                    </div>
                    <ul className="space-y-2">
                        {missingTopics.map((t) => (
                            <li key={t.id} className="text-xs text-white font-mono bg-[var(--background)] p-2 border border-[var(--border)]">
                                {t.title}
                            </li>
                        ))}
                        {missingTopics.length === 0 && (
                            <li className="text-xs text-[var(--text-muted)] font-mono">No missing skills.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SkillGapAnalysis;

import { CheckCircle, AlertCircle, Zap, ShieldAlert } from "lucide-react";

const SkillGapAnalysis = ({ skillGap = {} }) => {
    const strongSkills = skillGap.strong_skills || [];
    const missingSkills = skillGap.missing_skills || [];
    const prioritySkills = skillGap.priority_skills || [];
    const weakSkills = skillGap.weak_skills || [];

    if (!strongSkills.length && !missingSkills.length && !prioritySkills.length) {
        return null;
    }

    return (
        <div className="border border-zinc-800 bg-[var(--surface)] p-6">
            <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                    <h3 className="text-lg font-bold uppercase tracking-wider text-white">
                        AI Skill Gap Analysis
                    </h3>
                    <p className="text-xs text-zinc-400">
                        Target role capabilities vs your current profile & projects.
                    </p>
                </div>
                <span className="border border-red-500/30 bg-red-500/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-red-400">
                    AI Diagnostic
                </span>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* 1. Strong Skills */}
                <div className="border border-zinc-800 bg-zinc-900/40 p-4">
                    <div className="mb-3 flex items-center gap-2 text-emerald-400">
                        <CheckCircle className="h-4 w-4" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">
                            Strong Skills ({strongSkills.length})
                        </h4>
                    </div>
                    {strongSkills.length ? (
                        <div className="flex flex-wrap gap-1.5">
                            {strongSkills.map((s, idx) => (
                                <span
                                    key={idx}
                                    className="border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 font-mono text-[11px] text-emerald-300"
                                >
                                    {s}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs italic text-zinc-500">None identified yet.</p>
                    )}
                </div>

                {/* 2. Priority Focus Skills */}
                <div className="border border-zinc-800 bg-zinc-900/40 p-4">
                    <div className="mb-3 flex items-center gap-2 text-amber-400">
                        <Zap className="h-4 w-4" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">
                            Priority Focus ({prioritySkills.length})
                        </h4>
                    </div>
                    {prioritySkills.length ? (
                        <div className="flex flex-wrap gap-1.5">
                            {prioritySkills.map((s, idx) => (
                                <span
                                    key={idx}
                                    className="border border-amber-500/30 bg-amber-500/10 px-2 py-1 font-mono text-[11px] text-amber-300"
                                >
                                    {s}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs italic text-zinc-500">None prioritized.</p>
                    )}
                </div>

                {/* 3. Missing Skills */}
                <div className="border border-zinc-800 bg-zinc-900/40 p-4">
                    <div className="mb-3 flex items-center gap-2 text-red-400">
                        <ShieldAlert className="h-4 w-4" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">
                            Missing Skills ({missingSkills.length})
                        </h4>
                    </div>
                    {missingSkills.length ? (
                        <div className="flex flex-wrap gap-1.5">
                            {missingSkills.map((s, idx) => (
                                <span
                                    key={idx}
                                    className="border border-red-500/30 bg-red-500/10 px-2 py-1 font-mono text-[11px] text-red-300"
                                >
                                    {s}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs italic text-zinc-500">No missing skills detected.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SkillGapAnalysis;

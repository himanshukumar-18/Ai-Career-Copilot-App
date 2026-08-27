import React, { useState } from "react";
import { X, Sparkles, Briefcase, FileText, Check } from "lucide-react";

const QUICK_ROLE_PILLS = [
    "Backend Developer",
    "Frontend Developer",
    "Full Stack Developer",
    "Data Scientist & AI Engineer",
    "DevOps & Cloud Engineer",
    "Mobile App Developer",
    "Cybersecurity Analyst",
    "Product Manager",
];

const InterviewSetupModal = ({ isOpen, onClose, onGenerate, isGenerating }) => {
    const [targetRole, setTargetRole] = useState("Backend Developer");
    const [experienceLevel, setExperienceLevel] = useState("intermediate");
    const [companyName, setCompanyName] = useState("");
    const [jobDescription, setJobDescription] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!targetRole.trim()) return;

        onGenerate({
            target_role: targetRole.trim(),
            experience_level: experienceLevel,
            company_name: companyName.trim(),
            job_description: jobDescription.trim(),
            force_regenerate: true,
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
            <div className="border border-[var(--border)] bg-[var(--surface)] w-full max-w-2xl p-6 sm:p-8 relative shadow-2xl my-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-[var(--accent)]" />
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
                        Target Role & JD Analysis
                    </span>
                </div>

                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">
                    Generate AI Interview Prep Plan
                </h2>
                <p className="text-xs text-[var(--text-muted)] mb-6">
                    Our AI mentor will analyze your candidate profile, resume claims, portfolio projects, and target role to create custom topics and questions.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Target Role Input */}
                    <div>
                        <label className="block font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                            Target Career Role / Position <span className="text-[var(--accent)]">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                            placeholder="e.g. Senior Backend Engineer, AI/ML Specialist..."
                            className="w-full bg-[var(--background)] border border-[var(--border)] px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all font-mono"
                        />
                    </div>

                    {/* Quick Suggestion Pills */}
                    <div>
                        <span className="block text-xs text-[var(--text-muted)] mb-2">Quick Role Suggestions:</span>
                        <div className="flex flex-wrap gap-2">
                            {QUICK_ROLE_PILLS.map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => setTargetRole(role)}
                                    className={`px-3 py-1.5 text-xs font-mono border transition-all ${
                                        targetRole === role
                                            ? "border-[var(--accent)] bg-[var(--accent)]/10 text-white"
                                            : "border-[var(--border)] text-[var(--text-muted)] hover:border-white/40 hover:text-white"
                                    }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Experience Level & Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                                Experience Level
                            </label>
                            <select
                                value={experienceLevel}
                                onChange={(e) => setExperienceLevel(e.target.value)}
                                className="w-full bg-[var(--background)] border border-[var(--border)] px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all font-mono"
                            >
                                <option value="beginner">Beginner (0-1 yrs)</option>
                                <option value="intermediate">Intermediate (1-3 yrs)</option>
                                <option value="advanced">Advanced / Senior (3+ yrs)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                                Target Company (Optional)
                            </label>
                            <input
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="e.g. Google, Amazon, Startup..."
                                className="w-full bg-[var(--background)] border border-[var(--border)] px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all font-mono"
                            />
                        </div>
                    </div>

                    {/* Job Description Optional Input */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                                <FileText size={14} className="text-[var(--accent)]" />
                                Paste Job Description (Optional)
                            </label>
                            <span className="text-[10px] text-[var(--text-muted)] font-mono">Tailors questions directly to JD</span>
                        </div>
                        <textarea
                            rows={4}
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste specific job requirements or responsibilities here for JD-specific interview probing..."
                            className="w-full bg-[var(--background)] border border-[var(--border)] p-4 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all font-mono resize-y"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 border border-[var(--border)] text-xs font-mono uppercase text-[var(--text-muted)] hover:text-white transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isGenerating || !targetRole.trim()}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--accent)] text-white text-xs font-mono uppercase tracking-wider hover:bg-[var(--accent-light)] transition-all disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <span>Generating AI Plan...</span>
                            ) : (
                                <>
                                    <Sparkles size={14} />
                                    <span>Synthesize Plan</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InterviewSetupModal;

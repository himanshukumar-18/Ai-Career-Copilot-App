import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileText, Globe, ExternalLink, Loader2 } from "lucide-react";

import Panel from "../../components/ui/Panel";
import Button from "../../components/ui/Button";

import { fetchAdminResumesThunk } from "../../features/admin/adminThunk";
import { selectAdminResumesData, selectAdminIsLoading } from "../../features/admin/adminSelectors";

const AdminResumes = () => {
    const dispatch = useDispatch();

    const resumesData = useSelector(selectAdminResumesData);
    const isLoading = useSelector(selectAdminIsLoading);

    useEffect(() => {
        dispatch(fetchAdminResumesThunk());
    }, [dispatch]);

    const resumes = resumesData?.resumes || [];
    const publishedResumes = resumesData?.published_resumes || [];

    return (
        <div className="space-y-6 font-sans">
            {/* Header */}
            <div className="border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-semibold">
                            Resume Monitoring
                        </span>
                    </div>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
                        Resumes & Public Publishing Overview
                    </h1>

                    <p className="mt-1 text-xs text-[var(--text-muted)] font-mono">
                        Inspect student resumes, template distribution, completion metrics, and public links.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 font-mono text-xs text-white">
                        <span>Total: </span>
                        <span className="font-bold text-[var(--accent)]">{resumesData?.total_count || 0}</span>
                    </div>

                    <div className="border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-mono text-xs text-emerald-400">
                        <span>Published: </span>
                        <span className="font-bold">{resumesData?.published_count || 0}</span>
                    </div>
                </div>
            </div>

            {/* Resume Lists */}
            {isLoading && resumes.length === 0 ? (
                <div className="py-16 text-center">
                    <Loader2 size={24} className="animate-spin text-[var(--accent)] mx-auto mb-2" />
                    <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">
                        Querying Resumes Database...
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Published Resumes Panel */}
                    <Panel className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
                            <Globe size={18} className="text-emerald-400" />
                            <h2 className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-white">
                                Publicly Published Student Resumes ({publishedResumes.length})
                            </h2>
                        </div>

                        {publishedResumes.length === 0 ? (
                            <div className="py-6 text-center font-mono text-xs text-[var(--text-muted)]">
                                No public resumes published yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                                {publishedResumes.map((r) => (
                                    <div
                                        key={`pub-${r.id}`}
                                        className="p-3.5 border border-emerald-500/30 bg-[var(--surface)]/30 flex flex-col justify-between space-y-2"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="font-bold text-white text-sm">{r.title}</p>
                                                <p className="text-[var(--text-muted)] text-[11px]">{r.student_name} ({r.student_email})</p>
                                            </div>

                                            <span className="text-[9px] uppercase tracking-wider border border-emerald-500/40 text-emerald-400 bg-emerald-500/10 px-2 py-0.5">
                                                Public
                                            </span>
                                        </div>

                                        <div className="pt-2 border-t border-[var(--border)]/50 flex items-center justify-between text-[11px]">
                                            <span className="text-[var(--text-muted)]">
                                                Template: {r.template || "Standard"}
                                            </span>

                                            <a
                                                href={`/public/resume/${r.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[var(--accent)] hover:underline flex items-center gap-1 font-semibold"
                                            >
                                                <span>View Live Resume</span>
                                                <ExternalLink size={12} />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Panel>

                    {/* All Resumes Table */}
                    <Panel className="p-0 overflow-hidden">
                        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText size={18} className="text-[var(--accent)]" />
                                <h2 className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-white">
                                    All Student Resumes Audit
                                </h2>
                            </div>
                        </div>

                        {resumes.length === 0 ? (
                            <div className="py-12 text-center font-mono text-xs text-[var(--text-muted)]">
                                No resumes created in platform.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[var(--border)] bg-[var(--surface)]/50 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                                            <th className="py-3 px-4">Resume Title</th>
                                            <th className="py-3 px-4">Student</th>
                                            <th className="py-3 px-4">Template</th>
                                            <th className="py-3 px-4">Completion</th>
                                            <th className="py-3 px-4">Public</th>
                                            <th className="py-3 px-4 text-right">Updated</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-[var(--border)]/60 font-mono text-xs">
                                        {resumes.map((r) => (
                                            <tr key={r.id} className="hover:bg-[var(--surface)]/30 transition-colors">
                                                <td className="py-3.5 px-4 font-semibold text-white">
                                                    {r.title}
                                                </td>

                                                <td className="py-3.5 px-4 text-[var(--text-secondary)]">
                                                    {r.student_name}
                                                </td>

                                                <td className="py-3.5 px-4 text-[var(--text-muted)] uppercase text-[10px]">
                                                    {r.template || "Standard"}
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-1.5 border border-[var(--border)] bg-[var(--background)] overflow-hidden">
                                                            <div
                                                                className="h-full bg-[var(--accent)]"
                                                                style={{ width: `${r.completion_percentage || 0}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-[11px] text-white font-bold">{r.completion_percentage || 0}%</span>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    {r.is_public ? (
                                                        <span className="text-[10px] text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5">
                                                            YES
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] text-[var(--text-muted)] border border-[var(--border)] px-1.5 py-0.5">
                                                            PRIVATE
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="py-3.5 px-4 text-right text-[var(--text-muted)] text-[11px]">
                                                    {r.updated_at ? new Date(r.updated_at).toLocaleDateString() : "-"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Panel>
                </div>
            )}
        </div>
    );
};

export default AdminResumes;

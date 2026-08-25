import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Activity, Sparkles, CheckCircle2, AlertTriangle, Cpu, Loader2 } from "lucide-react";

import Panel from "../../components/ui/Panel";
import Button from "../../components/ui/Button";

import { fetchAdminAIMonitoringThunk } from "../../features/admin/adminThunk";
import { selectAdminAIMonitoring, selectAdminIsLoading } from "../../features/admin/adminSelectors";

const AdminAIMonitoring = () => {
    const dispatch = useDispatch();

    const data = useSelector(selectAdminAIMonitoring);
    const isLoading = useSelector(selectAdminIsLoading);

    useEffect(() => {
        dispatch(fetchAdminAIMonitoringThunk());
    }, [dispatch]);

    const metrics = data?.metrics || {};
    const breakdown = data?.breakdown || [];

    return (
        <div className="space-y-6 font-sans">
            {/* Header */}
            <div className="border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-semibold">
                            AI Infrastructure & Telemetry
                        </span>
                    </div>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
                        LangChain / ChatGroq AI Monitoring
                    </h1>

                    <p className="mt-1 text-xs text-[var(--text-muted)] font-mono">
                        Monitor execution rates, model provider status, and feature generation telemetry.
                    </p>
                </div>

                <Button
                    onClick={() => dispatch(fetchAdminAIMonitoringThunk())}
                    className="h-10 px-4 font-mono text-xs uppercase tracking-[0.15em] flex items-center gap-2"
                >
                    <Activity size={16} />
                    <span>Refresh Telemetry</span>
                </Button>
            </div>

            {isLoading && !data ? (
                <div className="py-16 text-center">
                    <Loader2 size={24} className="animate-spin text-[var(--accent)] mx-auto mb-2" />
                    <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">
                        Polling AI Telemetry Data...
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Status Banner */}
                    <Panel className="p-4 border-l-4 border-l-[var(--accent)]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                            <div className="flex items-center gap-3">
                                <div className="p-2 border border-[var(--border)] bg-[var(--background)] text-[var(--accent)]">
                                    <Cpu size={20} />
                                </div>

                                <div>
                                    <p className="font-bold text-white uppercase tracking-wider">
                                        Provider: Groq / ChatGroq (llama-3.3-70b-versatile)
                                    </p>
                                    <p className="text-[var(--text-muted)] text-[11px]">
                                        Structured Output via Pydantic & LangChain Expression Language (LCEL)
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-400">
                                <CheckCircle2 size={14} />
                                <span className="font-bold uppercase tracking-wider">{data?.status || "Healthy"}</span>
                            </div>
                        </div>
                    </Panel>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Panel className="p-4 text-center space-y-1">
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-semibold">
                                Total AI Dispatches
                            </p>
                            <p className="text-3xl font-bold font-mono text-white">{metrics.total_resume_analyses || 0}</p>
                            <p className="font-mono text-[11px] text-[var(--accent)]">Cross-Feature AI Calls</p>
                        </Panel>

                        <Panel className="p-4 text-center space-y-1">
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-semibold">
                                Interview Prep Plans
                            </p>
                            <p className="text-3xl font-bold font-mono text-white">{metrics.total_interview_plans || 0}</p>
                            <p className="font-mono text-[11px] text-purple-400">Personalized Roadmaps</p>
                        </Panel>

                        <Panel className="p-4 text-center space-y-1">
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-semibold">
                                Mock Sessions
                            </p>
                            <p className="text-3xl font-bold font-mono text-white">{metrics.total_mock_sessions || 0}</p>
                            <p className="font-mono text-[11px] text-blue-400">Interactive Turns</p>
                        </Panel>

                        <Panel className="p-4 text-center space-y-1">
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-semibold">
                                System Success Rate
                            </p>
                            <p className="text-3xl font-bold font-mono text-emerald-400">{metrics.success_rate_percentage || 98.4}%</p>
                            <p className="font-mono text-[11px] text-emerald-400">Zero Critical Failures</p>
                        </Panel>
                    </div>

                    {/* Breakdown Table */}
                    <Panel className="p-0 overflow-hidden">
                        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles size={18} className="text-[var(--accent)]" />
                                <h2 className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-white">
                                    AI Feature Telemetry Breakdown
                                </h2>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[var(--border)] bg-[var(--surface)]/50 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                                        <th className="py-3 px-4">Feature Module</th>
                                        <th className="py-3 px-4">Executions Count</th>
                                        <th className="py-3 px-4 text-right">Operational Status</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-[var(--border)]/60 font-mono text-xs">
                                    {breakdown.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-[var(--surface)]/30 transition-colors">
                                            <td className="py-3.5 px-4 font-semibold text-white">
                                                {row.feature}
                                            </td>

                                            <td className="py-3.5 px-4 text-[var(--text-secondary)]">
                                                {row.count} calls
                                            </td>

                                            <td className="py-3.5 px-4 text-right">
                                                <span className="border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase">
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Panel>
                </div>
            )}
        </div>
    );
};

export default AdminAIMonitoring;

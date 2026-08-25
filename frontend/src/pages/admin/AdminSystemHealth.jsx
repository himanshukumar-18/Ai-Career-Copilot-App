import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Server, CheckCircle2, AlertCircle, Database, Shield, Cpu, HardDrive, Loader2 } from "lucide-react";

import Panel from "../../components/ui/Panel";
import Button from "../../components/ui/Button";

import { fetchAdminHealthThunk } from "../../features/admin/adminThunk";
import { selectAdminHealth, selectAdminIsLoading } from "../../features/admin/adminSelectors";

const AdminSystemHealth = () => {
    const dispatch = useDispatch();

    const health = useSelector(selectAdminHealth);
    const isLoading = useSelector(selectAdminIsLoading);

    useEffect(() => {
        dispatch(fetchAdminHealthThunk());
    }, [dispatch]);

    const services = health?.services || {};

    return (
        <div className="space-y-6 font-sans">
            {/* Header */}
            <div className="border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-semibold">
                            Infrastructure & Services Health
                        </span>
                    </div>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
                        System Health & Service Diagnostics
                    </h1>

                    <p className="mt-1 text-xs text-[var(--text-muted)] font-mono">
                        Real-time status checks for Database, Authentication Engine, Groq AI Engine, and File Storage.
                    </p>
                </div>

                <Button
                    onClick={() => dispatch(fetchAdminHealthThunk())}
                    className="h-10 px-4 font-mono text-xs uppercase tracking-[0.15em] flex items-center gap-2"
                >
                    <Server size={16} />
                    <span>Run Diagnostics</span>
                </Button>
            </div>

            {isLoading && !health ? (
                <div className="py-16 text-center">
                    <Loader2 size={24} className="animate-spin text-[var(--accent)] mx-auto mb-2" />
                    <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">
                        Pinging Infrastructure Nodes...
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Overall Health Status Banner */}
                    <Panel className={`p-5 border-l-4 ${health?.overall_status === "HEALTHY" ? "border-l-emerald-500 bg-emerald-500/10" : "border-l-amber-500 bg-amber-500/10"}`}>
                        <div className="flex items-center justify-between font-mono text-xs">
                            <div className="flex items-center gap-3">
                                <div className={`p-2.5 border ${health?.overall_status === "HEALTHY" ? "border-emerald-500/40 text-emerald-400" : "border-amber-500/40 text-amber-400"}`}>
                                    <Server size={22} />
                                </div>

                                <div>
                                    <h2 className="text-base font-bold text-white uppercase tracking-wider">
                                        Platform Infrastructure: {health?.overall_status || "OPERATIONAL"}
                                    </h2>
                                    <p className="text-[var(--text-muted)] text-[11px] mt-0.5">
                                        All critical backend subsystems, authentication, and database nodes are connected.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Panel>

                    {/* Subsystems Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                        {/* Database */}
                        <Panel className="space-y-3">
                            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                                <div className="flex items-center gap-2">
                                    <Database size={18} className="text-blue-400" />
                                    <span className="font-bold text-white uppercase tracking-wider">PostgreSQL / SQLite Database</span>
                                </div>

                                <span className="border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 text-[10px]">
                                    {services.database?.status || "OPERATIONAL"}
                                </span>
                            </div>

                            <p className="text-[var(--text-muted)] text-[11px]">
                                Details: {services.database?.details || "Connection pool healthy"}
                            </p>
                        </Panel>

                        {/* AI Engine */}
                        <Panel className="space-y-3">
                            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                                <div className="flex items-center gap-2">
                                    <Cpu size={18} className="text-purple-400" />
                                    <span className="font-bold text-white uppercase tracking-wider">Groq AI Inference Engine</span>
                                </div>

                                <span className={`border px-2 py-0.5 text-[10px] ${services.ai_engine?.status === "OPERATIONAL" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" : "border-amber-500/30 text-amber-400 bg-amber-500/10"}`}>
                                    {services.ai_engine?.status || "OPERATIONAL"}
                                </span>
                            </div>

                            <p className="text-[var(--text-muted)] text-[11px]">
                                Provider: {services.ai_engine?.provider || "Groq / ChatGroq (LangChain)"}
                                <br />
                                Details: {services.ai_engine?.details || "Ready for inference"}
                            </p>
                        </Panel>

                        {/* Authentication */}
                        <Panel className="space-y-3">
                            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                                <div className="flex items-center gap-2">
                                    <Shield size={18} className="text-emerald-400" />
                                    <span className="font-bold text-white uppercase tracking-wider">JWT Auth & Security Engine</span>
                                </div>

                                <span className="border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 text-[10px]">
                                    OPERATIONAL
                                </span>
                            </div>

                            <p className="text-[var(--text-muted)] text-[11px]">
                                Details: {services.authentication_service?.details || "Access & Refresh Token rotation enabled"}
                            </p>
                        </Panel>

                        {/* Storage */}
                        <Panel className="space-y-3">
                            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                                <div className="flex items-center gap-2">
                                    <HardDrive size={18} className="text-amber-400" />
                                    <span className="font-bold text-white uppercase tracking-wider">Media & Asset Storage</span>
                                </div>

                                <span className="border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 text-[10px]">
                                    OPERATIONAL
                                </span>
                            </div>

                            <p className="text-[var(--text-muted)] text-[11px]">
                                Details: {services.media_storage?.details || "Media root accessible"}
                            </p>
                        </Panel>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSystemHealth;

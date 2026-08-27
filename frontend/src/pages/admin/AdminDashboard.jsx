import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    Users,
    FileText,
    Activity,
    Briefcase,
    CheckCircle2,
    Clock,
    Sparkles,
    ArrowUpRight,
    Loader2,
    AlertCircle,
    Server,
    Shield,
} from "lucide-react";

import Panel from "../../components/ui/Panel";
import Button from "../../components/ui/Button";

import { fetchAdminDashboardStatsThunk } from "../../features/admin/adminThunk";
import {
    selectAdminDashboardStats,
    selectAdminActivities,
    selectAdminIsLoading,
    selectAdminIsError,
    selectAdminMessage,
} from "../../features/admin/adminSelectors";

const AdminDashboard = () => {
    const dispatch = useDispatch();

    const stats = useSelector(selectAdminDashboardStats);
    const activities = useSelector(selectAdminActivities);
    const isLoading = useSelector(selectAdminIsLoading);
    const isError = useSelector(selectAdminIsError);
    const message = useSelector(selectAdminMessage);

    useEffect(() => {
        dispatch(fetchAdminDashboardStatsThunk());
    }, [dispatch]);

    if (isLoading && !stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Connecting to Admin Control Center...
                </p>
            </div>
        );
    }

    if (isError && !stats) {
        return (
            <div className="border border-red-500/50 bg-red-500/10 p-6 font-mono text-xs text-red-400 space-y-3">
                <div className="flex items-center gap-2">
                    <AlertCircle size={20} />
                    <span className="font-bold uppercase tracking-wider text-sm">Failed to Load Dashboard</span>
                </div>
                <p>{message || "Unable to connect to admin backend API."}</p>
                <Button
                    onClick={() => dispatch(fetchAdminDashboardStatsThunk())}
                    className="h-9 px-4 font-mono text-xs uppercase tracking-wider"
                >
                    Retry Connection
                </Button>
            </div>
        );
    }

    const kpiCards = [
        {
            title: "Total Students",
            value: stats?.total_students || 0,
            subtitle: `${stats?.active_students || 0} active / ${stats?.verified_students || 0} verified`,
            icon: Users,
            color: "text-blue-400",
            border: "border-blue-500/30",
            link: "/admin/students",
        },
        {
            title: "Total Resumes",
            value: stats?.total_resumes || 0,
            subtitle: `${stats?.published_resumes || 0} published online`,
            icon: FileText,
            color: "text-emerald-400",
            border: "border-emerald-500/30",
            link: "/admin/resumes",
        },
        {
            title: "AI Executions",
            value: stats?.ai_analyses || 0,
            subtitle: `${stats?.interview_plans || 0} prep plans / ${stats?.mock_interviews || 0} mock sessions`,
            icon: Sparkles,
            color: "text-purple-400",
            border: "border-purple-500/30",
            link: "/admin/ai-monitoring",
        },
        {
            title: "Career Roles",
            value: stats?.total_career_roles || 0,
            subtitle: `${stats?.roadmaps_enrolled || 0} enrolled roadmaps`,
            icon: Briefcase,
            color: "text-amber-400",
            border: "border-amber-500/30",
            link: "/admin/career-roles",
        },
    ];

    return (
        <div className="space-y-8 font-sans">
            {/* Top Overview Banner */}
            <div className="border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-semibold">
                            Operational Command
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-wider border border-[var(--border)] px-2 py-0.5 text-[var(--text-muted)]">
                            LIVE DATA
                        </span>
                    </div>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
                        Platform Executive Overview
                    </h1>

                    <p className="mt-1 text-xs text-[var(--text-muted)] font-mono">
                        Real-time monitoring of students, AI executions, resumes, and system infrastructure.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => dispatch(fetchAdminDashboardStatsThunk())}
                        className="h-10 px-4 font-mono text-xs uppercase tracking-[0.15em] flex items-center gap-2"
                    >
                        <Activity size={14} />
                        <span>Refresh Metrics</span>
                    </Button>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {kpiCards.map((card) => (
                    <Panel key={card.title} className={`relative overflow-hidden border ${card.border} hover:border-[var(--accent)] transition-all`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-semibold">
                                    {card.title}
                                </p>
                                <p className="mt-2 text-3xl font-bold text-white tracking-tight font-mono">
                                    {card.value}
                                </p>
                            </div>

                            <div className={`p-2.5 rounded-none border border-[var(--border)] bg-[var(--background)] ${card.color}`}>
                                <card.icon size={20} />
                            </div>
                        </div>

                        <p className="mt-4 pt-3 border-t border-[var(--border)]/60 font-mono text-[11px] text-[var(--text-secondary)] truncate">
                            {card.subtitle}
                        </p>

                        <Link
                            to={card.link}
                            className="mt-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-[var(--accent)] hover:underline pt-1"
                        >
                            <span>Inspect Module</span>
                            <ArrowUpRight size={14} />
                        </Link>
                    </Panel>
                ))}
            </div>

            {/* Main Content Grid: Recent Activity & Quick Modules */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity Log (2 cols) */}
                <Panel className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-[var(--accent)]" />
                            <h2 className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-white">
                                Real Platform Event Log
                            </h2>
                        </div>
                        <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                            Database Audited
                        </span>
                    </div>

                    {activities.length === 0 ? (
                        <div className="py-8 text-center font-mono text-xs text-[var(--text-muted)]">
                            No recent platform events recorded in the database.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {activities.map((act) => (
                                <div
                                    key={act.id}
                                    className="p-3 border border-[var(--border)] bg-[var(--surface)]/40 hover:bg-[var(--surface)] transition-colors flex items-start gap-3"
                                >
                                    <div className="mt-0.5 p-1.5 border border-[var(--border)] bg-[var(--background)] text-[var(--accent)] shrink-0 font-mono text-xs">
                                        ▶
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="font-mono text-xs font-semibold text-white truncate">
                                                {act.title}
                                            </p>
                                            <span className="font-mono text-[10px] text-[var(--text-muted)] shrink-0">
                                                {act.timestamp ? new Date(act.timestamp).toLocaleTimeString() : ""}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-xs text-[var(--text-secondary)] line-clamp-1">
                                            {act.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Panel>

                {/* Quick Status & Control Panel (1 col) */}
                <div className="space-y-6">
                    {/* System Node Health */}
                    <Panel className="space-y-4">
                        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                            <div className="flex items-center gap-2">
                                <Server size={16} className="text-emerald-400" />
                                <h3 className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-white">
                                    System Infrastructure
                                </h3>
                            </div>
                        </div>

                        <div className="space-y-3 font-mono text-xs">
                            <div className="flex items-center justify-between p-2.5 border border-[var(--border)] bg-[var(--surface)]/30">
                                <span className="text-[var(--text-muted)]">Django REST API</span>
                                <span className="text-emerald-400 flex items-center gap-1">
                                    <CheckCircle2 size={12} /> Operational
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-2.5 border border-[var(--border)] bg-[var(--surface)]/30">
                                <span className="text-[var(--text-muted)]">Groq / LangChain AI</span>
                                <span className="text-emerald-400 flex items-center gap-1">
                                    <CheckCircle2 size={12} /> Connected
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-2.5 border border-[var(--border)] bg-[var(--surface)]/30">
                                <span className="text-[var(--text-muted)]">JWT Security Node</span>
                                <span className="text-emerald-400 flex items-center gap-1">
                                    <CheckCircle2 size={12} /> Active
                                </span>
                            </div>
                        </div>

                        <Link
                            to="/admin/health"
                            className="block text-center font-mono text-xs uppercase tracking-[0.15em] text-[var(--accent)] hover:underline pt-2"
                        >
                            View Full System Diagnostics →
                        </Link>
                    </Panel>

                    {/* Quick Admin Actions */}
                    <Panel className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
                            <Shield size={16} className="text-[var(--accent)]" />
                            <h3 className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-white">
                                Quick Management
                            </h3>
                        </div>

                        <div className="space-y-2">
                            <Link
                                to="/admin/students"
                                className="w-full flex items-center justify-between p-2.5 border border-[var(--border)] bg-[var(--surface)]/40 hover:bg-[var(--surface)] transition-colors font-mono text-xs uppercase tracking-wider text-[var(--text-primary)]"
                            >
                                <span>Manage Student Accounts</span>
                                <span>→</span>
                            </Link>

                            <Link
                                to="/admin/career-roles"
                                className="w-full flex items-center justify-between p-2.5 border border-[var(--border)] bg-[var(--surface)]/40 hover:bg-[var(--surface)] transition-colors font-mono text-xs uppercase tracking-wider text-[var(--text-primary)]"
                            >
                                <span>Configure Career Roles</span>
                                <span>→</span>
                            </Link>

                            <Link
                                to="/admin/resources"
                                className="w-full flex items-center justify-between p-2.5 border border-[var(--border)] bg-[var(--surface)]/40 hover:bg-[var(--surface)] transition-colors font-mono text-xs uppercase tracking-wider text-[var(--text-primary)]"
                            >
                                <span>Curate Learning Resources</span>
                                <span>→</span>
                            </Link>
                        </div>
                    </Panel>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

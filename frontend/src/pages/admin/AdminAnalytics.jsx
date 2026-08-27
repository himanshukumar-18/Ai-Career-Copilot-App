import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BarChart3, TrendingUp, Layers, Loader2 } from "lucide-react";

import Panel from "../../components/ui/Panel";
import Button from "../../components/ui/Button";

import { fetchAdminAnalyticsThunk } from "../../features/admin/adminThunk";
import { selectAdminAnalytics, selectAdminIsLoading } from "../../features/admin/adminSelectors";

const AdminAnalytics = () => {
    const dispatch = useDispatch();

    const data = useSelector(selectAdminAnalytics);
    const isLoading = useSelector(selectAdminIsLoading);

    useEffect(() => {
        dispatch(fetchAdminAnalyticsThunk());
    }, [dispatch]);

    const featureAdoption = data?.feature_adoption || [];
    const rolePopularity = data?.role_popularity || [];

    const maxAdoption = Math.max(...featureAdoption.map((f) => f.usage_count || 1), 1);

    return (
        <div className="space-y-6 font-sans">
            {/* Header */}
            <div className="border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-semibold">
                            Platform Analytics & Growth
                        </span>
                    </div>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
                        Feature Adoption & Student Growth
                    </h1>

                    <p className="mt-1 text-xs text-[var(--text-muted)] font-mono">
                        Inspect feature adoption volume across Resume Builder, Project-Lab, Roadmaps, and Interview Prep.
                    </p>
                </div>

                <Button
                    onClick={() => dispatch(fetchAdminAnalyticsThunk())}
                    className="h-10 px-4 font-mono text-xs uppercase tracking-[0.15em] flex items-center gap-2"
                >
                    <BarChart3 size={16} />
                    <span>Re-calculate Metrics</span>
                </Button>
            </div>

            {isLoading && !data ? (
                <div className="py-16 text-center">
                    <Loader2 size={24} className="animate-spin text-[var(--accent)] mx-auto mb-2" />
                    <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">
                        Generating Analytics Engine Visuals...
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Feature Adoption Chart */}
                    <Panel className="space-y-4">
                        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                            <div className="flex items-center gap-2">
                                <TrendingUp size={18} className="text-[var(--accent)]" />
                                <h2 className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-white">
                                    Feature Adoption Volume
                                </h2>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            {featureAdoption.map((item) => {
                                const pct = Math.round(((item.usage_count || 0) / maxAdoption) * 100);

                                return (
                                    <div key={item.feature} className="space-y-1 font-mono text-xs">
                                        <div className="flex items-center justify-between">
                                            <span className="text-white font-medium">{item.feature}</span>
                                            <span className="text-[var(--accent)] font-bold">{item.usage_count} uses</span>
                                        </div>

                                        <div className="h-3 w-full border border-[var(--border)] bg-[var(--background)] p-0.5 overflow-hidden">
                                            <div
                                                className="h-full bg-[var(--accent)] transition-all duration-700"
                                                style={{ width: `${Math.max(pct, 4)}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Panel>

                    {/* Career Role Popularity */}
                    <Panel className="space-y-4">
                        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                            <div className="flex items-center gap-2">
                                <Layers size={18} className="text-blue-400" />
                                <h2 className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-white">
                                    Career Domain Popularity
                                </h2>
                            </div>
                        </div>

                        {rolePopularity.length === 0 ? (
                            <div className="py-8 text-center font-mono text-xs text-[var(--text-muted)]">
                                No career role enrollment data logged yet.
                            </div>
                        ) : (
                            <div className="space-y-3 pt-2">
                                {rolePopularity.map((r, idx) => (
                                    <div
                                        key={idx}
                                        className="p-3 border border-[var(--border)] bg-[var(--surface)]/30 flex items-center justify-between font-mono text-xs"
                                    >
                                        <span className="font-semibold text-white">{r.title}</span>
                                        <span className="border border-blue-500/30 text-blue-400 bg-blue-500/10 px-2 py-0.5 text-[11px]">
                                            {r.enrolled} Enrolled Students
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Panel>
                </div>
            )}
        </div>
    );
};

export default AdminAnalytics;

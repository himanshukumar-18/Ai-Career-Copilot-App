import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BookOpen, ExternalLink, Loader2, AlertCircle, Layers } from "lucide-react";

import Panel from "../../components/ui/Panel";
import Button from "../../components/ui/Button";

import { fetchAdminResourcesThunk } from "../../features/admin/adminThunk";
import { selectAdminResources, selectAdminIsLoading } from "../../features/admin/adminSelectors";

const AdminResources = () => {
    const dispatch = useDispatch();

    const resources = useSelector(selectAdminResources);
    const isLoading = useSelector(selectAdminIsLoading);

    useEffect(() => {
        dispatch(fetchAdminResourcesThunk());
    }, [dispatch]);

    const roadmapResources = resources?.roadmap_resources || [];
    const prepResources = resources?.prep_resources || [];

    return (
        <div className="space-y-6 font-sans">
            {/* Header */}
            <div className="border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-semibold">
                            Curated Content Library
                        </span>
                    </div>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
                        Curated Learning & Prep Resources
                    </h1>

                    <p className="mt-1 text-xs text-[var(--text-muted)] font-mono">
                        Inspect learning materials, documentation links, and interview prep reference items.
                    </p>
                </div>

                <Button
                    onClick={() => dispatch(fetchAdminResourcesThunk())}
                    className="h-10 px-4 font-mono text-xs uppercase tracking-[0.15em] flex items-center gap-2"
                >
                    <BookOpen size={16} />
                    <span>Refresh Library</span>
                </Button>
            </div>

            {/* Content Sections */}
            {isLoading && roadmapResources.length === 0 && prepResources.length === 0 ? (
                <div className="py-16 text-center">
                    <Loader2 size={24} className="animate-spin text-[var(--accent)] mx-auto mb-2" />
                    <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">
                        Querying Resources Database...
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Roadmap Resources */}
                    <Panel className="space-y-4">
                        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                            <div className="flex items-center gap-2">
                                <Layers size={18} className="text-[var(--accent)]" />
                                <h2 className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-white">
                                    Career Roadmap Step Resources ({roadmapResources.length})
                                </h2>
                            </div>
                        </div>

                        {roadmapResources.length === 0 ? (
                            <div className="py-6 text-center font-mono text-xs text-[var(--text-muted)]">
                                No roadmap step resources curated.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                                {roadmapResources.map((res) => (
                                    <div
                                        key={`rr-${res.id}`}
                                        className="p-3 border border-[var(--border)] bg-[var(--surface)]/30 hover:bg-[var(--surface)] transition-colors flex flex-col justify-between space-y-2"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="font-semibold text-white line-clamp-1">{res.title}</span>
                                                <span className="text-[9px] uppercase tracking-wider border border-[var(--border)] px-1.5 py-0.5 text-[var(--text-muted)]">
                                                    {res.resource_type || "Article"}
                                                </span>
                                            </div>

                                            {res.description && (
                                                <p className="mt-1 text-[11px] text-[var(--text-muted)] line-clamp-2 font-sans">
                                                    {res.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="pt-2 border-t border-[var(--border)]/50 flex items-center justify-between text-[10px]">
                                            <span className="text-[var(--text-muted)] truncate">
                                                Provider: {res.provider || "Web"}
                                            </span>

                                            {res.url && (
                                                <a
                                                    href={res.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[var(--accent)] hover:underline flex items-center gap-1"
                                                >
                                                    <span>Open Link</span>
                                                    <ExternalLink size={10} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Panel>

                    {/* Interview Prep Resources */}
                    <Panel className="space-y-4">
                        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                            <div className="flex items-center gap-2">
                                <BookOpen size={18} className="text-purple-400" />
                                <h2 className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-white">
                                    Interview Prep Recommended Resources ({prepResources.length})
                                </h2>
                            </div>
                        </div>

                        {prepResources.length === 0 ? (
                            <div className="py-6 text-center font-mono text-xs text-[var(--text-muted)]">
                                No interview preparation resources stored.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                                {prepResources.map((res) => (
                                    <div
                                        key={`pr-${res.id}`}
                                        className="p-3 border border-[var(--border)] bg-[var(--surface)]/30 hover:bg-[var(--surface)] transition-colors flex flex-col justify-between space-y-2"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="font-semibold text-white line-clamp-1">{res.title}</span>
                                                <span className="text-[9px] uppercase tracking-wider border border-purple-500/30 text-purple-400 bg-purple-500/10 px-1.5 py-0.5">
                                                    {res.resource_type || "Video"}
                                                </span>
                                            </div>

                                            {res.description && (
                                                <p className="mt-1 text-[11px] text-[var(--text-muted)] line-clamp-2 font-sans">
                                                    {res.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="pt-2 border-t border-[var(--border)]/50 flex items-center justify-between text-[10px]">
                                            <span className="text-[var(--text-muted)] truncate">
                                                Topic: {res.topic_title || "General"}
                                            </span>

                                            {res.url && (
                                                <a
                                                    href={res.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[var(--accent)] hover:underline flex items-center gap-1"
                                                >
                                                    <span>Open Link</span>
                                                    <ExternalLink size={10} />
                                                </a>
                                            )}
                                        </div>
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

export default AdminResources;

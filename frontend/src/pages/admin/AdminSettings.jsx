import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Settings, Shield, Sliders, Cpu, Loader2 } from "lucide-react";
import { toast } from "sonner";

import Panel from "../../components/ui/Panel";
import Button from "../../components/ui/Button";

import { fetchAdminSettingsThunk } from "../../features/admin/adminThunk";
import { selectAdminSettings, selectAdminIsLoading } from "../../features/admin/adminSelectors";

const AdminSettings = () => {
    const dispatch = useDispatch();

    const settingsData = useSelector(selectAdminSettings);
    const isLoading = useSelector(selectAdminIsLoading);

    useEffect(() => {
        dispatch(fetchAdminSettingsThunk());
    }, [dispatch]);

    const handleSaveSettings = () => {
        toast.success("Platform settings updated successfully.");
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Header */}
            <div className="border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-semibold">
                            Platform Configuration
                        </span>
                    </div>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
                        Admin Settings & Feature Flags
                    </h1>

                    <p className="mt-1 text-xs text-[var(--text-muted)] font-mono">
                        Configure non-sensitive platform parameters, feature switches, and AI defaults.
                    </p>
                </div>

                <Button
                    onClick={handleSaveSettings}
                    className="h-10 px-4 font-mono text-xs uppercase tracking-[0.15em] flex items-center gap-2"
                >
                    <Settings size={16} />
                    <span>Save Configurations</span>
                </Button>
            </div>

            {isLoading && !settingsData ? (
                <div className="py-16 text-center">
                    <Loader2 size={24} className="animate-spin text-[var(--accent)] mx-auto mb-2" />
                    <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">
                        Fetching Admin Settings...
                    </p>
                </div>
            ) : (
                <div className="space-y-6 font-mono text-xs">
                    {/* General Platform Settings */}
                    <Panel className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
                            <Sliders size={18} className="text-[var(--accent)]" />
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                                Platform Metadata
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 text-[var(--text-muted)] uppercase">Platform Name</label>
                                <input
                                    type="text"
                                    readOnly
                                    value={settingsData?.platform_name || "AI Career Copilot"}
                                    className="w-full bg-[var(--surface)] border border-[var(--border)] p-2.5 text-white font-mono text-xs cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-[var(--text-muted)] uppercase">System Build Version</label>
                                <input
                                    type="text"
                                    readOnly
                                    value={settingsData?.version || "2.4.0"}
                                    className="w-full bg-[var(--surface)] border border-[var(--border)] p-2.5 text-white font-mono text-xs cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </Panel>

                    {/* AI Model Configurations */}
                    <Panel className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
                            <Cpu size={18} className="text-purple-400" />
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                                AI Model Provider & Target Defaults
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 text-[var(--text-muted)] uppercase">AI Orchestrator</label>
                                <input
                                    type="text"
                                    readOnly
                                    value={settingsData?.ai_provider || "Groq / ChatGroq (LangChain)"}
                                    className="w-full bg-[var(--surface)] border border-[var(--border)] p-2.5 text-white font-mono text-xs cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-[var(--text-muted)] uppercase">Default LLM Model</label>
                                <input
                                    type="text"
                                    readOnly
                                    value={settingsData?.ai_default_model || "llama-3.3-70b-versatile"}
                                    className="w-full bg-[var(--surface)] border border-[var(--border)] p-2.5 text-white font-mono text-xs cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </Panel>

                    {/* Feature Toggles */}
                    <Panel className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
                            <Shield size={18} className="text-emerald-400" />
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                                Security & Feature Toggles
                            </h2>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 border border-[var(--border)] bg-[var(--surface)]/30">
                                <div>
                                    <p className="font-bold text-white uppercase">Public Registration</p>
                                    <p className="text-[11px] text-[var(--text-muted)]">Allow new student registrations via /register endpoint</p>
                                </div>

                                <span className="border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 text-[11px] uppercase">
                                    Enabled
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 border border-[var(--border)] bg-[var(--surface)]/30">
                                <div>
                                    <p className="font-bold text-white uppercase">Maintenance Mode</p>
                                    <p className="text-[11px] text-[var(--text-muted)]">Temporarily disable student access for maintenance</p>
                                </div>

                                <span className="border border-[var(--border)] text-[var(--text-muted)] px-2.5 py-1 text-[11px] uppercase">
                                    Disabled
                                </span>
                            </div>
                        </div>
                    </Panel>
                </div>
            )}
        </div>
    );
};

export default AdminSettings;

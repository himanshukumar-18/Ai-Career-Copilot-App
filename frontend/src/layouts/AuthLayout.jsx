import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">

            <div className="grid min-h-screen lg:grid-cols-[420px_1fr]">

                {/* Left Panel */}

                <aside className="hidden lg:flex flex-col border-r border-[var(--border)]">

                    {/* Header */}

                    <div className="border-b border-[var(--border)] p-6">

                        <p className="font-mono text-xs tracking-[0.25em] text-[var(--accent)] uppercase">
                            AI Career Copilot
                        </p>

                    </div>

                    {/* System Information */}

                    <div className="flex-1 p-6">

                        <div className="space-y-8">

                            <div>

                                <p className="font-mono text-xs tracking-[0.2em] text-[var(--text-muted)] uppercase">
                                    System
                                </p>

                                <h1 className="mt-3 text-3xl font-semibold">
                                    Career Intelligence Platform
                                </h1>

                            </div>

                            <div className="border border-[var(--border)]">

                                <div className="border-b border-[var(--border)] px-4 py-3">

                                    <p className="font-mono text-xs uppercase tracking-[0.2em]">
                                        Platform Capabilities
                                    </p>

                                </div>

                                <div className="p-4 space-y-4">

                                    <div>
                                        <p className="font-medium">
                                            AI Resume Analysis
                                        </p>

                                        <p className="text-sm text-[var(--text-muted)] mt-1">
                                            Get personalized feedback on your resume.
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-medium">
                                            Skill Gap Detection
                                        </p>

                                        <p className="text-sm text-[var(--text-muted)] mt-1">
                                            Discover missing skills for your target role.
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-medium">
                                            Career Roadmaps
                                        </p>

                                        <p className="text-sm text-[var(--text-muted)] mt-1">
                                            Generate AI-powered learning paths.
                                        </p>
                                    </div>

                                </div>

                            </div>

                            <div className="border border-[var(--border)]">

                                <div className="border-b border-[var(--border)] px-4 py-3">

                                    <p className="font-mono text-xs uppercase tracking-[0.2em]">
                                        Mission
                                    </p>

                                </div>

                                <div className="p-4">

                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                        Analyze skills, optimize resumes,
                                        generate learning roadmaps and
                                        accelerate career growth through
                                        AI-powered intelligence.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Footer */}

                    <div className="border-t border-[var(--border)] p-6">

                        <p className="font-mono text-xs tracking-[0.2em] text-[var(--text-muted)] uppercase text-center">
                            Built with ❤️ by Himanshu Kumar • AI Career Copilot
                        </p>

                    </div>

                </aside>

                {/* Right Panel */}

                <main className="flex items-center justify-center p-6 md:p-10">

                    <div className="w-full max-w-md">

                        {/* Mobile Header */}

                        <div className="lg:hidden border border-[var(--border)] mb-6 p-4">

                            <p className="font-mono text-xs tracking-[0.25em] uppercase text-[var(--accent)]">
                                AI Career Copilot
                            </p>

                        </div>

                        <Outlet />

                    </div>

                </main>

            </div>

        </div>
    );
};

export default AuthLayout;
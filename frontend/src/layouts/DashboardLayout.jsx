import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
    return (
        <div className="h-screen bg-[var(--background)] flex overflow-hidden">

            {/* SIDEBAR */}

            <aside
                className="
                    w-72
                    shrink-0
                    border-r
                    border-[var(--border)]
                    h-screen
                    overflow-y-auto
                "
            >

                <div className="h-full flex flex-col">

                    {/* Logo */}

                    <div className="border-b border-[var(--border)] p-6">

                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent)]">
                            AI Career Copilot
                        </p>

                    </div>

                    {/* Navigation */}

                    <nav className="flex-1 p-4 space-y-2">

                        <button className="w-full text-left border border-[var(--border)] px-4 py-3 hover:bg-white hover:text-black transition-all">
                            Dashboard
                        </button>

                        <button className="w-full text-left border border-[var(--border)] px-4 py-3 hover:bg-white hover:text-black transition-all">
                            Resume Builder
                        </button>

                        <button className="w-full text-left border border-[var(--border)] px-4 py-3 hover:bg-white hover:text-black transition-all">
                            Skills
                        </button>

                        <button className="w-full text-left border border-[var(--border)] px-4 py-3 hover:bg-white hover:text-black transition-all">
                            Projects
                        </button>

                        <button className="w-full text-left border border-[var(--border)] px-4 py-3 hover:bg-white hover:text-black transition-all">
                            Roadmap
                        </button>

                    </nav>

                    {/* Footer */}

                    <div className="border-t border-[var(--border)] p-4">

                        <p className="text-xs text-[var(--text-muted)]">
                            Made with ❤️ by Himanshu
                        </p>

                    </div>

                </div>

            </aside>

            {/* WORKSPACE */}

            <main
                className="
                    flex-1
                    h-screen
                    overflow-y-auto
                "
            >

                <div className="p-6 lg:p-8">

                    <Outlet />

                </div>

            </main>

        </div>
    );
};

export default DashboardLayout;
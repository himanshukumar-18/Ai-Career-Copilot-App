import { useState, useEffect, useCallback } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Menu,
    X,
    LayoutDashboard,
    Users,
    Briefcase,
    BookOpen,
    FileText,
    Activity,
    BarChart3,
    Server,
    Settings,
    LogOut,
    Shield,
    ChevronRight,
} from "lucide-react";

import { logout } from "../features/auth/authSlice";

const AdminLayout = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    const { user } = useSelector((state) => state.auth);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleCloseDrawer = useCallback(() => {
        setIsSidebarOpen(false);
    }, []);

    // Close drawer on route change
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    // Close drawer on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isSidebarOpen) {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isSidebarOpen]);

    const navSections = [
        {
            title: "OVERVIEW",
            items: [
                { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
                { name: "Analytics & Adoption", path: "/admin/analytics", icon: BarChart3 },
            ],
        },
        {
            title: "USER MANAGEMENT",
            items: [
                { name: "Student Accounts", path: "/admin/students", icon: Users },
            ],
        },
        {
            title: "CONTENT & PRODUCT",
            items: [
                { name: "Career Roles", path: "/admin/career-roles", icon: Briefcase },
                { name: "Curated Resources", path: "/admin/resources", icon: BookOpen },
                { name: "Resumes & Published", path: "/admin/resumes", icon: FileText },
            ],
        },
        {
            title: "AI & SYSTEM",
            items: [
                { name: "AI Monitoring", path: "/admin/ai-monitoring", icon: Activity },
                { name: "System Health", path: "/admin/health", icon: Server },
                { name: "Admin Settings", path: "/admin/settings", icon: Settings },
            ],
        },
    ];

    const userInitial = user?.first_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "A";
    const fullName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Administrator";

    return (
        <div className="h-screen bg-[var(--background)] text-[var(--text-primary)] flex overflow-hidden font-sans">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    role="presentation"
                    aria-hidden="true"
                    className="fixed inset-0 bg-black/80 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
                    onClick={handleCloseDrawer}
                />
            )}

            {/* Admin Sidebar */}
            <aside
                id="admin-sidebar"
                aria-label="Admin Navigation Drawer"
                className={`
                    fixed lg:static
                    top-0 left-0
                    h-screen
                    w-72
                    bg-[var(--background)]
                    border-r
                    border-[var(--border)]
                    z-50
                    flex
                    flex-col
                    transition-transform
                    duration-300
                    ease-in-out
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                {/* Header Branding */}
                <div className="border-b border-[var(--border)] p-5 flex items-center justify-between bg-[var(--surface)]/40">
                    <Link to="/admin" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-none border border-[var(--accent)] bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                            <Shield size={18} />
                        </div>

                        <div>
                            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)] block">
                                Control Center
                            </span>
                            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--text-muted)] block">
                                Platform Admin v2.4
                            </span>
                        </div>
                    </Link>

                    <button
                        onClick={handleCloseDrawer}
                        aria-label="Close Navigation Menu"
                        className="lg:hidden p-2 text-[var(--text-muted)] hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Admin User Overview */}
                <div className="border-b border-[var(--border)] p-4 flex items-center gap-3 bg-[var(--surface)]/20">
                    <div className="w-10 h-10 border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center font-mono font-bold text-[var(--accent)] shrink-0">
                        {userInitial}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-white truncate">{fullName}</p>
                        <p className="font-mono text-[10px] text-[var(--text-muted)] truncate">{user?.email}</p>
                    </div>

                    <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5">
                        ROOT
                    </span>
                </div>

                {/* Navigation Sections */}
                <div className="flex-1 overflow-y-auto scrollbar-hide px-3 py-4 space-y-6">
                    {navSections.map((section) => (
                        <div key={section.title}>
                            <p className="px-3 mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-semibold">
                                {section.title}
                            </p>

                            <nav className="space-y-1">
                                {section.items.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.path === "/admin"}
                                        onClick={handleCloseDrawer}
                                        className={({ isActive }) =>
                                            `
                                            flex
                                            items-center
                                            justify-between
                                            px-3.5
                                            py-2.5
                                            font-mono
                                            text-xs
                                            uppercase
                                            tracking-[0.12em]
                                            transition-all
                                            duration-150
                                            ${isActive
                                                ? "border-l-2 border-[var(--accent)] bg-[var(--surface)] text-white font-bold"
                                                : "border-l-2 border-transparent text-[var(--text-secondary)] hover:text-white hover:bg-[var(--surface)]/50"
                                            }
                                        `
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <item.icon
                                                        size={16}
                                                        className={isActive ? "text-[var(--accent)] shrink-0" : "text-[var(--text-muted)] shrink-0"}
                                                    />
                                                    <span className="truncate">{item.name}</span>
                                                </div>

                                                {isActive && (
                                                    <ChevronRight size={14} className="text-[var(--accent)] shrink-0" />
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                            </nav>
                        </div>
                    ))}
                </div>

                {/* Sidebar Footer */}
                <div className="border-t border-[var(--border)] p-3 flex items-center justify-between bg-[var(--background)]">
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-muted)]">
                        AI Security Active
                    </span>

                    <button
                        onClick={handleLogout}
                        className="font-mono text-xs uppercase tracking-wider text-red-400 hover:text-red-300 flex items-center gap-1.5 px-2 py-1 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 h-screen flex flex-col min-w-0 overflow-hidden">
                {/* Top Bar Header */}
                <header className="h-16 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen(true)}
                            aria-expanded={isSidebarOpen}
                            aria-controls="admin-sidebar"
                            aria-label="Open Admin Menu"
                            className="lg:hidden p-2 -ml-2 text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                        >
                            <Menu size={22} />
                        </button>

                        <div className="flex items-center gap-2 min-w-0 font-mono text-xs uppercase tracking-[0.15em]">
                            <span className="text-[var(--text-muted)] hidden sm:inline">Admin /</span>
                            <span className="text-[var(--accent)] font-semibold truncate">
                                {location.pathname === "/admin"
                                    ? "Dashboard"
                                    : location.pathname.replace("/admin/", "").replace("-", " ")}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* System Health Badge */}
                        <div className="hidden sm:flex items-center gap-2 border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] text-emerald-400">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>System Operational</span>
                        </div>

                        <Link
                            to="/dashboard"
                            className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--text-muted)] hover:text-white transition-colors border border-[var(--border)] px-3 py-1.5 hover:border-[var(--border-light)] hidden md:inline-block"
                        >
                            View Student Portal
                        </Link>
                    </div>
                </header>

                {/* Main Workspace Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

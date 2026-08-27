import { useState, useEffect, useCallback } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Menu,
    X,
    LayoutDashboard,
    FileText,
    FolderGit2,
    Map,
    LogOut,
    Settings,
    Sparkles,
    FileSearch,
    User,
    ChevronRight,
} from "lucide-react";

import { getProfileThunk } from "../features/profile/profileThunk";
import { logout } from "../features/auth/authSlice";

const DashboardLayout = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    const { user } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.profile);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleCloseDrawer = useCallback(() => {
        setIsSidebarOpen(false);
    }, []);

    useEffect(() => {
        if (!profile) {
            dispatch(getProfileThunk());
        }
    }, [dispatch, profile]);

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

    const mainNavItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Resume Builder",
            path: "/resume",
            icon: FileText,
        },
        {
            name: "Project Lab",
            path: "/project-lab",
            icon: FolderGit2,
        },
        {
            name: "Career Roadmap",
            path: "/roadmap",
            icon: Map,
        },
        {
            name: "Interview Prep",
            path: "/interview-prep",
            icon: Sparkles,
        },
    ];

    const profileFields = [
        profile?.profile_picture,
        profile?.headline,
        profile?.bio,
        profile?.phone,
        profile?.location,
        profile?.career_goal,
        profile?.github_url,
        profile?.linkedin_url,
        profile?.portfolio_url,
    ];

    const completedFields = profileFields.filter(
        (field) => field && String(field).trim() !== ""
    ).length;

    const profileCompletion = Math.round(
        (completedFields / profileFields.length) * 100
    );

    const userInitial = user?.first_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U";
    const fullName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Operator";

    return (
        <div className="h-screen bg-[var(--background)] text-[var(--text-primary)] flex overflow-hidden">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    role="presentation"
                    aria-hidden="true"
                    className="fixed inset-0 bg-black/75 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
                    onClick={handleCloseDrawer}
                />
            )}

            {/* Sidebar */}
            <aside
                id="student-sidebar"
                aria-label="Student Navigation Drawer"
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
                {/* Mobile Drawer Header */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-[var(--border)]">
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-bold">
                            AI Career Copilot
                        </span>
                    </div>

                    <button
                        onClick={handleCloseDrawer}
                        aria-label="Close Navigation Menu"
                        className="p-2 text-[var(--text-muted)] hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Desktop Logo Header */}
                <div className="hidden lg:block border-b border-[var(--border)] p-6">
                    <Link to="/dashboard" className="block text-center">
                        <span className="font-mono uppercase tracking-[0.25em] text-xs font-bold text-[var(--accent)] block">
                            AI Career Copilot
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] mt-1 block">
                            Intelligence Terminal
                        </span>
                    </Link>
                </div>

                {/* Profile Overview Card */}
                <div className="border-b border-[var(--border)] p-5 flex flex-col items-center text-center bg-[var(--surface)]/30">
                    <Link
                        to="/profile"
                        onClick={handleCloseDrawer}
                        className="group relative flex flex-col items-center focus:outline-none"
                    >
                        <div className="w-16 h-16 rounded-full overflow-hidden border border-[var(--border)] group-hover:border-[var(--accent)] transition-colors flex items-center justify-center bg-[var(--surface)] shrink-0">
                            {profile?.profile_picture ? (
                                <img
                                    src={profile.profile_picture}
                                    alt={fullName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="font-mono text-xl font-bold text-[var(--accent)]">
                                    {userInitial}
                                </span>
                            )}
                        </div>

                        <h2 className="mt-3 text-sm font-semibold text-white group-hover:text-[var(--accent)] transition-colors line-clamp-1">
                            {fullName}
                        </h2>
                    </Link>

                    <p className="mt-0.5 font-mono text-[10px] text-[var(--accent)] uppercase tracking-[0.15em] line-clamp-1">
                        {profile?.headline || "Career Operator"}
                    </p>

                    <div className="mt-2 inline-flex items-center gap-1.5 border border-[var(--border)] px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--text-muted)]">
                        <span>Role:</span>
                        <span className="text-[var(--text-primary)] font-semibold">{user?.role || "Student"}</span>
                    </div>

                    {/* Profile Completion Bar */}
                    <div className="w-full mt-4 pt-3 border-t border-[var(--border)]/60">
                        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-muted)] mb-1.5">
                            <span>Completion</span>
                            <span className="text-white font-bold">{profileCompletion}%</span>
                        </div>

                        <div className="h-1.5 w-full border border-[var(--border)] bg-[var(--background)] overflow-hidden">
                            <div
                                className="h-full bg-[var(--accent)] transition-all duration-500"
                                style={{ width: `${profileCompletion}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Scrollable Navigation Area */}
                <div className="flex-1 overflow-y-auto scrollbar-hide px-3 py-4 space-y-6">
                    {/* Main System Navigation */}
                    <div>
                        <p className="px-3 mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                            System Navigation
                        </p>

                        <nav className="space-y-1">
                            {mainNavItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
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

                    {/* Account & System Section */}
                    <div>
                        <p className="px-3 mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                            Account & System
                        </p>

                        <div className="space-y-1">
                            <NavLink
                                to="/profile"
                                onClick={handleCloseDrawer}
                                className={({ isActive }) =>
                                    `
                                    flex
                                    items-center
                                    gap-3
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
                                <Settings size={16} className="text-[var(--text-muted)] shrink-0" />
                                <span>Profile & Settings</span>
                            </NavLink>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="
                                    w-full
                                    flex
                                    items-center
                                    gap-3
                                    px-3.5
                                    py-2.5
                                    font-mono
                                    text-xs
                                    uppercase
                                    tracking-[0.12em]
                                    text-red-400
                                    hover:text-red-300
                                    hover:bg-red-500/10
                                    border-l-2
                                    border-transparent
                                    transition-all
                                    duration-150
                                    cursor-pointer
                                "
                            >
                                <LogOut size={16} className="shrink-0" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Footer */}
                <div className="border-t border-[var(--border)] p-3.5 text-center bg-[var(--background)]">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                        I ❤️ AI Career Copilot
                    </p>
                </div>
            </aside>

            {/* Mobile Header (Fixed Top) */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-md flex items-center justify-between px-4 z-30">
                <button
                    type="button"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-expanded={isSidebarOpen}
                    aria-controls="student-sidebar"
                    aria-label="Open Navigation Menu"
                    className="p-2 -ml-2 text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                >
                    <Menu size={22} />
                </button>

                <Link to="/dashboard" className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                        AI Career Copilot
                    </span>
                </Link>

                <Link
                    to="/profile"
                    aria-label="View Profile"
                    className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center font-mono text-xs font-bold text-[var(--accent)]"
                >
                    {userInitial}
                </Link>
            </header>

            {/* Main Content Workspace Area */}
            <main className="flex-1 h-screen overflow-y-auto">
                <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
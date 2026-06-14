import { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Menu, X } from "lucide-react";

import { logout } from "../features/auth/authSlice";
import path from "node:path";

const DashboardLayout = () => {
    const dispatch = useDispatch();

    const { user } = useSelector(
        (state) => state.auth
    );

    const [isSidebarOpen, setIsSidebarOpen] =
        useState(false);

    const handleLogout = () => {
        dispatch(logout());
    };

    const navItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
        },
        {
            name: "Resume Builder",
            path: "/resume",
        },
        {
            name: "Skills",
            path: "/skills",
        },
        {
            name: "Career Roadmap",
            path: "/roadmap",
        }
    ];

    return (
        <div className="h-screen bg-[var(--background)] flex overflow-hidden">

            {/* Mobile Overlay */}

            {isSidebarOpen && (
                <div
                    className="
                        fixed
                        inset-0
                        bg-black/60
                        z-40
                        lg:hidden
                    "
                    onClick={() =>
                        setIsSidebarOpen(false)
                    }
                />
            )}

            {/* Sidebar */}

            <aside
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

                    ${isSidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                    }
                `}
            >

                {/* Mobile Close */}

                <div
                    className="
                        lg:hidden
                        flex
                        justify-end
                        p-4
                        border-b
                        border-[var(--border)]
                    "
                >
                    <button
                        onClick={() =>
                            setIsSidebarOpen(false)
                        }
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Logo */}

                <div className="border-b border-[var(--border)] p-6">

                    <h1
                        className="
                            font-mono
                            uppercase
                            tracking-[0.25em]
                            text-xs
                            text-[var(--accent)]
                            text-center
                        "
                    >
                        AI Career Copilot
                    </h1>

                </div>

                {/* Profile */}

                <Link
                    to="/profile"
                    onClick={() =>
                        setIsSidebarOpen(false)
                    }
                    className="
                        block
                        border-b
                        border-[var(--border)]
                        p-6
                        text-center
                        hover:bg-white/5
                        transition-all
                    "
                >

                    <div
                        className="
                            w-16
                            h-16
                            mx-auto
                            border
                            border-[var(--border)]
                            rounded-full
                            flex
                            items-center
                            justify-center
                            text-xl
                            font-semibold
                        "
                    >
                        {user?.first_name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                    </div>

                    <h2 className="mt-4 font-semibold">

                        {user?.first_name}
                        {" "}
                        {user?.last_name}

                    </h2>

                    <div
                        className="
                            mt-2
                            inline-flex
                            border
                            border-[var(--border)]
                            px-3
                            py-1
                            text-xs
                            uppercase
                            tracking-[0.15em]
                            text-[var(--text-muted)]
                        "
                    >
                        {user?.role || "Student"}
                    </div>

                    <p
                        className="
                            mt-3
                            text-xs
                            text-[var(--text-muted)]
                            break-all
                        "
                    >
                        {user?.email}
                    </p>

                </Link>

                {/* Navigation */}

                <nav className="flex-1 p-4 space-y-3">

                    {navItems.map((item) => (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() =>
                                setIsSidebarOpen(false)
                            }
                            className={({ isActive }) =>
                                `
                                block
                                border
                                px-4
                                py-3
                                transition-all

                                ${isActive
                                    ? "border-white text-white"
                                    : "border-[var(--border)] text-[var(--text-muted)] hover:text-white"
                                }
                            `
                            }
                        >
                            {item.name}
                        </NavLink>

                    ))}

                </nav>

                {/* Logout */}

                <div className="border-t border-[var(--border)] p-4">

                    <button
                        onClick={handleLogout}
                        className="
                            w-full
                            border
                            border-red-500
                            px-4
                            py-3
                            text-red-500
                            hover:bg-red-500
                            hover:text-black
                            transition-all
                        "
                    >
                        Logout
                    </button>

                </div>

                {/* Footer */}

                <div className="border-t border-[var(--border)] p-4">

                    <p className="font-mono text-xs tracking-[0.2em] text-[var(--text-muted)] uppercase text-center">
                        Built with ❤️ by Himanshu Kumar • AI Career Copilot
                    </p>

                </div>

            </aside>

            {/* Mobile Header */}

            <div
                className="
                    lg:hidden
                    fixed
                    top-0
                    left-0
                    right-0
                    h-16
                    border-b
                    border-[var(--border)]
                    bg-[var(--background)]
                    flex
                    items-center
                    justify-between
                    px-4
                    z-30
                "
            >

                <button
                    onClick={() =>
                        setIsSidebarOpen(true)
                    }
                >
                    <Menu size={22} />
                </button>

                <h1
                    className="
                        font-mono
                        text-xs
                        uppercase
                        tracking-[0.2em]
                    "
                >
                    AI Career Copilot
                </h1>

                <div className="w-6" />

            </div>

            {/* Workspace */}

            <main
                className="
                    flex-1
                    h-screen
                    overflow-y-auto
                "
            >

                <div
                    className="
                        p-5
                        lg:p-8
                        pt-24
                        lg:pt-8
                    "
                >

                    <Outlet />

                </div>

            </main>

        </div>
    );
};

export default DashboardLayout;
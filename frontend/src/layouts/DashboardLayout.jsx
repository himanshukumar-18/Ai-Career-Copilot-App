import { useState, useEffect } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    Menu,
    X,
    LayoutDashboard,
    FileText,
    FolderGit2,
    Map,
    LogOut,
    Settings
} from "lucide-react";

import { getProfileThunk } from "../features/profile/profileThunk";
import { logout } from "../features/auth/authSlice";


const DashboardLayout = () => {
    const dispatch = useDispatch();

    const { user } = useSelector(
        (state) => state.auth
    );

    const { profile } = useSelector(
        (state) => state.profile
    )

    const [isSidebarOpen, setIsSidebarOpen] =
        useState(false);

    const handleLogout = () => {
        dispatch(logout());
    };

    useEffect(() => {

        if (!profile) {

            dispatch(
                getProfileThunk()
            );

        }

    }, [
        dispatch,
        profile,
    ]);

    const navItems = [
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

    const completedFields =
        profileFields.filter(
            (field) =>
                field &&
                String(field).trim() !== ""
        ).length;

    const profileCompletion =
        Math.round(
            (completedFields /
                profileFields.length) *
            100
        );

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

                <div
                    className="
        border-b
        border-[var(--border)]
        p-6

        flex
        flex-col
        items-center
        justify-center
    "
                >

                    <div
                        className="
                                    w-24
                                    h-24
                                    rounded-full

                                    overflow-hidden

                                    border
                                    border-[var(--border)]

                                    flex
                                    items-center
                                    justify-center

                                    bg-[var(--surface)]
    "
                    >
                        {
                            profile?.profile_picture ? (

                                <img
                                    src={profile.profile_picture}
                                    alt="Profile"
                                    className="
        w-full
        h-full
        object-cover
    "
                                />

                            ) : (

                                <div
                                    className="
                h-12
                w-12

                rounded-full

                flex
                items-center
                justify-center
            "
                                >
                                    {
                                        user?.first_name
                                            ?.charAt(0)
                                            .toUpperCase() ||
                                        "U"
                                    }
                                </div>

                            )
                        }
                    </div>

                    <h2 className="mt-4 font-semibold">

                        {user?.first_name}
                        {" "}
                        {user?.last_name}

                    </h2>

                    <p
                        className="
        mt-1
        text-xs
        text-[var(--accent)]
        uppercase
        tracking-[0.15em]
    "
                    >
                        {
                            profile?.headline ||
                            "Career Operator"
                        }
                    </p>

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

                    <div className="w-full mt-5">

                        <div
                            className="
            flex
            justify-between
            text-[10px]
            uppercase
            tracking-[0.15em]
            text-[var(--text-muted)]
        "
                        >
                            <span>
                                Profile
                            </span>

                            <span>
                                {profileCompletion}%
                            </span>
                        </div>

                        <div
                            className="
            mt-2
            h-2

            border
            border-[var(--border)]

            overflow-hidden
        "
                        >
                            <div
                                className="
                h-full
                bg-[var(--accent)]
                transition-all
                duration-500
            "
                                style={{
                                    width: `${profileCompletion}%`,
                                }}
                            />
                        </div>

                    </div>

                </div>

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
                            <div
                                className="
        flex
        items-center
        gap-3
    "
                            >
                                <item.icon size={16} />

                                <span>
                                    {item.name}
                                </span>
                            </div>
                        </NavLink>

                    ))}

                </nav>

                {/* Logout */}

                <div
                    className="
        mt-auto
        p-4
        space-y-3
    "
                >

                    <Link
                        to="/profile"
                        onClick={() =>
                            setIsSidebarOpen(false)
                        }
                        className="
        w-full

        border
        border-[var(--border)]

        px-4
        py-3

        flex
        items-center
        justify-center
        gap-2

        text-sm

        hover:bg-white/5

        transition-all
    "
                    >
                        <Settings size={16} />

                        Profile
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="
        w-full

        border
        border-red-500/50

        px-4
        py-3

        flex
        items-center
        justify-center
        gap-2

        text-sm
        text-red-400

        hover:bg-red-500/10

        transition-all
    "
                    >
                        <LogOut size={16} />

                        Logout
                    </button>

                </div>

                {/* Footer */}

                <div className="border-t border-[var(--border)] p-4">

                    <div
                        className="
        text-center
        text-[10px]
        uppercase
        tracking-[0.2em]
        text-[var(--text-muted)]
    "
                    >
                        <p>AI Career Copilot v1.0</p>

                        <p className="mt-2">
                            Powered by React + Django
                        </p>
                    </div>

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
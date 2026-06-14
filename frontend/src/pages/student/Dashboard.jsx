import { useSelector } from "react-redux";

const Dashboard = () => {

    const { user } = useSelector(
        (state) => state.auth
    );

    const quickActions = [
        {
            title: "Profile",
            description:
                "Manage your personal information and career details."
        },
        {
            title: "Resume Builder",
            description:
                "Create an ATS-friendly professional resume."
        },
        {
            title: "Skills",
            description:
                "Track and manage your technical skills."
        },
        {
            title: "AI Analysis",
            description:
                "Get AI-powered career recommendations."
        }
    ];

    return (
        <div className="space-y-6">

            {/* Welcome Section */}

            <section className="border border-[var(--border)]">

                <div className="border-b border-[var(--border)] px-6 py-4">

                    <p
                        className="
                            font-mono
                            text-xs
                            uppercase
                            tracking-[0.2em]
                            text-[var(--accent)]
                        "
                    >
                        Student Dashboard
                    </p>

                </div>

                <div className="p-6">

                    <h1 className="text-3xl lg:text-4xl font-semibold">
                        Welcome Back,
                        {" "}
                        {user?.first_name || "Student"}
                        👋
                    </h1>

                    <p className="mt-3 text-[var(--text-muted)] max-w-2xl">
                        Continue building your skills,
                        improve your resume and receive
                        AI-powered career guidance.
                    </p>

                </div>

            </section>

            {/* Quick Access */}

            <section
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    xl:grid-cols-4
                    gap-5
                "
            >

                {quickActions.map((item) => (

                    <div
                        key={item.title}
                        className="
                            border
                            border-[var(--border)]
                        "
                    >

                        <div
                            className="
                                border-b
                                border-[var(--border)]
                                px-4
                                py-3
                            "
                        >

                            <p
                                className="
                                    font-mono
                                    text-xs
                                    uppercase
                                    tracking-[0.15em]
                                "
                            >
                                {item.title}
                            </p>

                        </div>

                        <div className="p-5">

                            <p className="text-sm text-[var(--text-muted)]">
                                {item.description}
                            </p>

                        </div>

                    </div>

                ))}

            </section>

            {/* Main Grid */}

            <section
                className="
                    grid
                    grid-cols-1
                    xl:grid-cols-3
                    gap-6
                "
            >

                {/* Left Side */}

                <div className="xl:col-span-2 space-y-6">

                    {/* AI Career Assistant */}

                    <div className="border border-[var(--border)]">

                        <div
                            className="
                                border-b
                                border-[var(--border)]
                                px-5
                                py-3
                            "
                        >

                            <p
                                className="
                                    font-mono
                                    text-xs
                                    uppercase
                                    tracking-[0.15em]
                                "
                            >
                                AI Career Assistant
                            </p>

                        </div>

                        <div className="p-5">

                            <h2 className="text-xl font-semibold">
                                Personalized Career Guidance
                            </h2>

                            <p className="mt-3 text-[var(--text-muted)]">
                                Analyze your profile,
                                discover skill gaps,
                                and generate personalized
                                learning roadmaps.
                            </p>

                        </div>

                    </div>

                    {/* Learning Progress */}

                    <div className="border border-[var(--border)]">

                        <div
                            className="
                                border-b
                                border-[var(--border)]
                                px-5
                                py-3
                            "
                        >

                            <p
                                className="
                                    font-mono
                                    text-xs
                                    uppercase
                                    tracking-[0.15em]
                                "
                            >
                                Learning Progress
                            </p>

                        </div>

                        <div className="p-5">

                            <div
                                className="
                                    h-3
                                    border
                                    border-[var(--border)]
                                "
                            >

                                <div
                                    className="
                                        h-full
                                        w-[35%]
                                        bg-white
                                    "
                                />

                            </div>

                            <p className="mt-4 text-sm text-[var(--text-muted)]">
                                Complete your profile and
                                skills to unlock AI recommendations.
                            </p>

                        </div>

                    </div>

                </div>

                {/* Right Side */}

                <div className="space-y-6">

                    {/* Profile Overview */}

                    <div className="border border-[var(--border)]">

                        <div
                            className="
                                border-b
                                border-[var(--border)]
                                px-5
                                py-3
                            "
                        >

                            <p
                                className="
                                    font-mono
                                    text-xs
                                    uppercase
                                    tracking-[0.15em]
                                "
                            >
                                Profile Overview
                            </p>

                        </div>

                        <div className="p-5 space-y-4">

                            <div>

                                <p className="text-xs text-[var(--text-muted)]">
                                    Full Name
                                </p>

                                <p className="mt-1">
                                    {user?.first_name}
                                    {" "}
                                    {user?.last_name}
                                </p>

                            </div>

                            <div>

                                <p className="text-xs text-[var(--text-muted)]">
                                    Email
                                </p>

                                <p className="mt-1 break-all">
                                    {user?.email}
                                </p>

                            </div>

                            <div>

                                <p className="text-xs text-[var(--text-muted)]">
                                    Role
                                </p>

                                <p className="mt-1">
                                    {user?.role}
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* Recommended Next Step */}

                    <div className="border border-[var(--border)]">

                        <div
                            className="
                                border-b
                                border-[var(--border)]
                                px-5
                                py-3
                            "
                        >

                            <p
                                className="
                                    font-mono
                                    text-xs
                                    uppercase
                                    tracking-[0.15em]
                                "
                            >
                                Next Step
                            </p>

                        </div>

                        <div className="p-5">

                            <p className="text-[var(--text-muted)]">
                                Complete your profile,
                                add skills and generate
                                your first AI career analysis.
                            </p>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
};

export default Dashboard;
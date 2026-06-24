import { useSelector } from "react-redux";
import { Link } from "react-router-dom";


const Dashboard = () => {

    const { user } = useSelector(
        (state) => state.auth
    );

    const { profile } = useSelector(
        (state) => state.profile
    );

    const quickActions = [
        {
            title: "Profile",
            description:
                "Manage your personal information and career details.",
            link: "/profile"
        },
        {
            title: "Resume Builder",
            description:
                "Create an ATS-friendly professional resume.",
            link: "/resume-builder"
        },
        {
            title: "Skills",
            description:
                "Track and manage your technical skills.",
            link: "/skills"
        },
        {
            title: "AI Analysis",
            description:
                "Get AI-powered career recommendations.",
            link: "/ai-analysis"
        }
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
        <div className="space-y-6">

            {/* Welcome Section */}

            <section className="border bg-[var(--surface)] border-[var(--border)]">

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
                        {
                            user?.first_name?.trim()
                                ? user.first_name
                                : user?.email?.split("@")[0]
                        }
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
                            bg-[var(--surface)]
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
                            <Link
                                to={item.link} >
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
                            </Link>

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

                <div className="xl:col-span-2 space-y-6 ">

                    {/* AI Career Assistant */}

                    <div className="border border-[var(--border)] bg-[var(--surface)]">

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

                        <div className="p-5 ">

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

                    <div className="border border-[var(--border)] bg-[var(--surface)]">

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
            flex
            items-center
            justify-between

            mb-3

            text-xs
            uppercase
            tracking-[0.15em]

            text-[var(--text-muted)]
        "
                            >
                                <span>
                                    Profile Completion
                                </span>

                                <span>
                                    {profileCompletion}%
                                </span>
                            </div>

                            <div
                                className="
            h-3

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
                duration-700
            "
                                    style={{
                                        width: `${profileCompletion}%`,
                                    }}
                                />

                            </div>

                            <p
                                className="
            mt-4

            text-sm

            text-[var(--text-muted)]
        "
                            >
                                {
                                    profileCompletion === 100

                                        ? "Your profile is fully completed. You can now access advanced AI recommendations."

                                        : `Complete ${9 - completedFields} more section${9 - completedFields > 1 ? "s" : ""} to unlock better AI recommendations.`
                                }
                            </p>

                        </div>

                    </div>

                </div>

                {/* Right Side */}

                <div className="space-y-6">

                    {/* Profile Overview */}

                    <div className="border border-[var(--border)] bg-[var(--surface)]">

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

                    <div className="border border-[var(--border)] bg-[var(--surface)]">

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
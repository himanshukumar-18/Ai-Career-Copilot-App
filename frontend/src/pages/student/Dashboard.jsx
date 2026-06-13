import { useSelector } from "react-redux";
import Button from "../../components/ui/Button";

const Dashboard = () => {

    const { user } = useSelector(
        (state) => state.auth
    );

    return (
        <div className="space-y-6">

            {/* HERO SECTION */}

            <section className="border border-[var(--border)]">

                <div className="border-b border-[var(--border)] px-6 py-4">

                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent)]">
                        Career Intelligence Center
                    </p>

                </div>

                <div className="p-6">

                    <h1 className="text-4xl font-semibold">
                        Welcome Back,
                        {" "}
                        {user?.first_name || "Student"}
                        {" "}
                        👋
                    </h1>

                    <p className="mt-3 text-[var(--text-muted)] max-w-2xl">
                        Manage your skills, projects, resume,
                        and receive AI-powered career guidance.
                    </p>

                    <div className="mt-6">
                        <Button>
                            Start AI Analysis
                        </Button>
                    </div>

                </div>

            </section>

            {/* QUICK MODULES */}

            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                {[
                    "Resume Builder",
                    "Skills Tracker",
                    "Projects",
                    "Career Roadmap"
                ].map((item) => (

                    <div
                        key={item}
                        className="border border-[var(--border)]"
                    >

                        <div className="border-b border-[var(--border)] px-5 py-3">

                            <p className="font-mono text-xs uppercase tracking-[0.2em]">
                                Module
                            </p>

                        </div>

                        <div className="p-5">

                            <h2 className="text-xl font-semibold">
                                {item}
                            </h2>

                            <p className="mt-2 text-sm text-[var(--text-muted)]">
                                Open and manage your {item.toLowerCase()}.
                            </p>

                        </div>

                    </div>

                ))}

            </section>

            {/* MAIN CONTENT */}

            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* LEFT */}

                <div className="xl:col-span-2 space-y-6">

                    {/* AI ANALYSIS */}

                    <div className="border border-[var(--border)]">

                        <div className="border-b border-[var(--border)] px-5 py-3">

                            <p className="font-mono text-xs uppercase tracking-[0.2em]">
                                AI Analysis
                            </p>

                        </div>

                        <div className="p-5">

                            <h2 className="text-2xl font-semibold">
                                Career Recommendations
                            </h2>

                            <p className="mt-3 text-[var(--text-muted)]">
                                Upload your resume and skills to receive
                                personalized career suggestions, skill-gap
                                analysis, and custom learning roadmaps.
                            </p>

                            <div className="mt-6">
                                <Button>
                                    Analyze Profile
                                </Button>
                            </div>

                        </div>

                    </div>

                    {/* RECENT ACTIVITY */}

                    <div className="border border-[var(--border)]">

                        <div className="border-b border-[var(--border)] px-5 py-3">

                            <p className="font-mono text-xs uppercase tracking-[0.2em]">
                                Activity Log
                            </p>

                        </div>

                        <div className="p-5 space-y-4">

                            <div className="border-b border-[var(--border)] pb-3">
                                Completed Authentication Module
                            </div>

                            <div className="border-b border-[var(--border)] pb-3">
                                Connected React With Django API
                            </div>

                            <div>
                                Started Dashboard Development
                            </div>

                        </div>

                    </div>

                </div>

                {/* RIGHT */}

                <div className="space-y-6">

                    {/* PROFILE */}

                    <div className="border border-[var(--border)]">

                        <div className="border-b border-[var(--border)] px-5 py-3">

                            <p className="font-mono text-xs uppercase tracking-[0.2em]">
                                Profile
                            </p>

                        </div>

                        <div className="p-5 space-y-5">

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

                                <p className="mt-1">
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

                    {/* PROGRESS */}

                    <div className="border border-[var(--border)]">

                        <div className="border-b border-[var(--border)] px-5 py-3">

                            <p className="font-mono text-xs uppercase tracking-[0.2em]">
                                Progress
                            </p>

                        </div>

                        <div className="p-5">

                            <div className="h-3 border border-[var(--border)]">

                                <div className="h-full w-[35%] bg-white" />

                            </div>

                            <p className="mt-3 text-sm text-[var(--text-muted)]">
                                35% Profile Completion
                            </p>

                        </div>

                    </div>

                    {/* GOAL */}

                    <div className="border border-[var(--border)]">

                        <div className="border-b border-[var(--border)] px-5 py-3">

                            <p className="font-mono text-xs uppercase tracking-[0.2em]">
                                Next Goal
                            </p>

                        </div>

                        <div className="p-5">

                            <p className="text-[var(--text-muted)]">
                                Complete AI Career Copilot MVP
                                and deploy it to production.
                            </p>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
};

export default Dashboard;
import { motion } from "framer-motion";
import {
    Award,
    BriefcaseBusiness,
    Code2,
    FileText,
    FolderKanban,
    GraduationCap,
    Languages,
    Lightbulb,
    Link2,
    UserRound,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

const SECTIONS = [
    {
        id: "personal",
        label: "Personal",
        icon: UserRound,
    },
    {
        id: "summary",
        label: "Summary",
        icon: FileText,
    },
    {
        id: "experience",
        label: "Experience",
        icon: BriefcaseBusiness,
    },
    {
        id: "education",
        label: "Education",
        icon: GraduationCap,
    },
    {
        id: "skills",
        label: "Skills",
        icon: Code2,
    },
    {
        id: "projects",
        label: "Projects",
        icon: FolderKanban,
    },
    {
        id: "certifications",
        label: "Certifications",
        icon: Award,
    },
    {
        id: "languages",
        label: "Languages",
        icon: Languages,
    },
    {
        id: "social",
        label: "Social Links",
        icon: Link2,
    },
];

const ResumeEditorSidebar = ({
    activeSection,
    onSectionChange,
    mobileTabs = false,
}) => {
    const { resumeId } = useParams();
    const basePath = resumeId ? `/resume/${resumeId}` : `/resume`;

    const handleSelect = (id) => {
        onSectionChange?.(id);
    };

    if (mobileTabs) {
        return (
            <div className="border-b border-zinc-800 bg-black xl:hidden">
                <div className="overflow-x-auto px-4 py-3 sm:px-6">
                    <nav
                        aria-label="Resume sections"
                        role="tablist"
                        className="flex min-w-max items-center gap-1"
                    >
                        {SECTIONS.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;
                            const to = `${basePath}/${section.id}`;

                            return (
                                <Link to={to} key={section.id} onClick={() => handleSelect(section.id)}>
                                    <button
                                        key={section.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        className={`inline-flex h-9 items-center gap-2 border px-3 text-xs transition focus:outline-none focus:ring-2 focus:ring-zinc-500 ${isActive
                                            ? "border-zinc-500 bg-zinc-950 text-white"
                                            : "border-zinc-800 bg-black text-zinc-500 hover:border-zinc-600 hover:text-zinc-200"
                                            }`}
                                    >
                                        <Icon size={14} aria-hidden="true" />
                                        {section.label}
                                    </button>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div >
        );
    }

    return (
        <motion.aside
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full"
        >
            <p className="mb-3 text-[9px] font-medium uppercase tracking-[0.24em] text-zinc-500">
                Sections
            </p>

            <nav
                aria-label="Resume sections"
                className="border border-zinc-800 bg-zinc-950 p-1.5"
            >
                <ul className="m-0 list-none space-y-0.5 p-0">
                    {SECTIONS.map((section) => {
                        const Icon = section.icon;
                        const isActive = activeSection === section.id;
                        const to = `${basePath}/${section.id}`;

                        return (
                            <li key={section.id}>
                                <Link
                                    to={to}
                                    onClick={() => handleSelect(section.id)}
                                    aria-current={isActive ? "true" : undefined}
                                    className={`relative flex w-full items-center gap-3 px-3 py-2.5 text-left text-xs transition focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-500 ${isActive
                                        ? "bg-black text-white"
                                        : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
                                        }`}
                                >
                                    {isActive && (
                                        <span
                                            aria-hidden="true"
                                            className="absolute bottom-0 left-0 top-0 w-px bg-white"
                                        />
                                    )}

                                    <Icon
                                        size={15}
                                        aria-hidden="true"
                                        className={
                                            isActive
                                                ? "text-zinc-200"
                                                : "text-zinc-600"
                                        }
                                    />

                                    <span className="truncate">
                                        {section.label}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="mt-6 border border-zinc-800 bg-zinc-950 px-3.5 py-3.5">
                <div className="flex items-center gap-2">
                    <Lightbulb
                        size={13}
                        className="text-zinc-500"
                        aria-hidden="true"
                    />
                    <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                        Tip
                    </p>
                </div>

                <p className="mt-2 text-xs leading-5 text-zinc-500">
                    Keep it to one page. Every line should earn its place.
                </p>
            </div>
        </motion.aside>
    );
};

export default ResumeEditorSidebar;
import { motion } from "framer-motion";
import {
    User,
    FileText,
    Briefcase,
    GraduationCap,
    Code2,
    FolderGit2,
    Award,
    Languages,
    Link2,
} from "lucide-react";
import ResumeSectionItem from "../navigation/ResumeSectionItem";

const SECTION_DEFINITIONS = [
    { id: "personal", title: "Personal Information", icon: User },
    { id: "summary", title: "Professional Summary", icon: FileText },
    { id: "experience", title: "Experience", icon: Briefcase },
    { id: "education", title: "Education", icon: GraduationCap },
    { id: "skills", title: "Skills", icon: Code2 },
    { id: "projects", title: "Projects", icon: FolderGit2 },
    { id: "certifications", title: "Certifications", icon: Award },
    { id: "languages", title: "Languages", icon: Languages },
    { id: "social", title: "Social Links", icon: Link2 },
];

const ResumeEditorSidebar = ({
    activeSection,
    onSectionChange,
    completedSections = [],   // array of section ids that are done
    completion = 0,
    template = "Classic",
    onChangeTemplate,
}) => {
    const clampedCompletion = Math.min(100, Math.max(0, completion));

    return (
        <motion.aside
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="
        sticky
        top-20
        hidden
        h-[calc(100vh-6rem)]
        w-80
        overflow-y-auto
        border
        border-zinc-800
        bg-zinc-950
        lg:block
      "
        >
            <div className="p-6">

                {/* Progress */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-zinc-400">Resume Completion</span>
                        <span className="font-semibold text-white">{clampedCompletion}%</span>
                    </div>
                    <div
                        role="progressbar"
                        aria-valuenow={clampedCompletion}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="Resume completion progress"
                        className="h-2 bg-zinc-800"
                    >
                        <div
                            className="h-2 bg-red-500 transition-all duration-500"
                            style={{ width: `${clampedCompletion}%` }}
                        />
                    </div>
                </div>

                {/* Template */}
                <div className="mb-8 border border-zinc-800 bg-zinc-900 px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Template</p>
                    <div className="mt-1 flex items-center justify-between">
                        <h3 className="font-semibold text-white">{template}</h3>
                        {onChangeTemplate && (
                            <button
                                onClick={onChangeTemplate}
                                className="text-xs text-red-400 hover:text-red-300 transition-colors"
                                aria-label="Change resume template"
                            >
                                Change
                            </button>
                        )}
                    </div>
                </div>

                {/* Sections */}
                <nav aria-label="Resume sections">
                    <ul className="space-y-2 list-none p-0 m-0">
                        {SECTION_DEFINITIONS.map((section) => (
                            <li key={section.id}>
                                <ResumeSectionItem
                                    icon={section.icon}
                                    title={section.title}
                                    completed={completedSections.includes(section.id)}
                                    active={activeSection === section.id}
                                    onClick={() => onSectionChange(section.id)}
                                />
                            </li>
                        ))}
                    </ul>
                </nav>

            </div>
        </motion.aside>
    );
};

export default ResumeEditorSidebar;
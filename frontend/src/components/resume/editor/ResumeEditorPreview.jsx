import { motion } from "framer-motion";
import { FileText, Mail, MapPin, Phone } from "lucide-react";

const getArray = (value) => (Array.isArray(value) ? value : []);

const PreviewSection = ({ title, children }) => {
    if (!children) return null;

    return (
        <section className="mt-5">
            <h2 className="border-b border-zinc-800 pb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                {title}
            </h2>
            <div className="pt-3">{children}</div>
        </section>
    );
};

const ResumeEditorPreview = ({ resume }) => {
    const profile = resume?.profile || resume?.resume_profile || {};
    const personal = resume?.personal || profile?.personal || profile || {};

    const firstName = personal?.first_name || personal?.firstName || "";
    const lastName = personal?.last_name || personal?.lastName || "";
    const fullName =
        `${firstName} ${lastName}`.trim() ||
        personal?.full_name ||
        personal?.fullName ||
        resume?.title ||
        "Your Name";

    const headline =
        personal?.headline ||
        personal?.professional_headline ||
        personal?.role ||
        "Professional Title";

    const email = personal?.email || "";
    const phone = personal?.phone || "";
    const location =
        personal?.location || personal?.city || personal?.address || "";

    const website =
        personal?.website ||
        personal?.portfolio_url ||
        personal?.linkedin_url ||
        "";

    const summary =
        personal?.summary ||
        resume?.summary ||
        resume?.professional_summary ||
        "";

    const experiences = getArray(
        resume?.experiences || resume?.experience || profile?.experiences
    );

    const education = getArray(
        resume?.education || resume?.educations || profile?.education
    );

    const skills = getArray(resume?.skills || profile?.skills);

    const projects = getArray(resume?.projects || profile?.projects);

    const certifications = getArray(
        resume?.certifications || profile?.certifications
    );

    const languages = getArray(resume?.languages || profile?.languages);

    const hasResumeContent =
        firstName ||
        lastName ||
        headline ||
        email ||
        phone ||
        summary ||
        experiences.length > 0 ||
        education.length > 0 ||
        skills.length > 0 ||
        projects.length > 0;

    return (
        <motion.aside
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full"
        >
            <p className="mb-3 text-[9px] font-medium uppercase tracking-[0.24em] text-zinc-500">
                Live Preview
            </p>

            <div className="max-h-[calc(100vh-170px)] overflow-y-auto border border-zinc-800 bg-zinc-950 px-5 py-6 sm:px-6">
                {!hasResumeContent ? (
                    <div className="flex min-h-[300px] flex-col items-center justify-center px-4 text-center">
                        <FileText
                            size={40}
                            className="text-zinc-700"
                            aria-hidden="true"
                        />
                        <h3 className="mt-4 text-sm font-semibold text-zinc-300">
                            Your resume preview
                        </h3>
                        <p className="mt-2 max-w-[220px] text-xs leading-5 text-zinc-500">
                            Add your personal information and sections to see
                            a live resume here.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <header>
                            <h1 className="text-xl font-semibold leading-tight tracking-tight text-white sm:text-2xl">
                                {fullName}
                            </h1>

                            <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
                                {headline}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-zinc-500">
                                {email && (
                                    <span className="inline-flex items-center gap-1">
                                        <Mail size={10} />
                                        {email}
                                    </span>
                                )}

                                {phone && (
                                    <span className="inline-flex items-center gap-1">
                                        <Phone size={10} />
                                        {phone}
                                    </span>
                                )}

                                {location && (
                                    <span className="inline-flex items-center gap-1">
                                        <MapPin size={10} />
                                        {location}
                                    </span>
                                )}

                                {website && <span>{website}</span>}
                            </div>
                        </header>

                        {summary && (
                            <PreviewSection title="Profile">
                                <p className="text-[11px] leading-5 text-zinc-400">
                                    {summary}
                                </p>
                            </PreviewSection>
                        )}

                        {experiences.length > 0 && (
                            <PreviewSection title="Experience">
                                <div className="space-y-4">
                                    {experiences.map((item, index) => {
                                        const role =
                                            item?.role ||
                                            item?.job_title ||
                                            item?.title ||
                                            "Role";

                                        const company =
                                            item?.company ||
                                            item?.company_name ||
                                            "";

                                        const start =
                                            item?.start_date ||
                                            item?.startDate ||
                                            "";

                                        const end =
                                            item?.is_current ||
                                                item?.currently_working
                                                ? "Present"
                                                : item?.end_date ||
                                                item?.endDate ||
                                                "";

                                        const description =
                                            item?.description ||
                                            item?.responsibilities ||
                                            "";

                                        return (
                                            <div key={item?.id || index}>
                                                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                                                    <p className="text-[11px] font-semibold text-white">
                                                        {role}
                                                        {company && (
                                                            <span className="ml-1 font-normal text-zinc-500">
                                                                · {company}
                                                            </span>
                                                        )}
                                                    </p>

                                                    {(start || end) && (
                                                        <p className="shrink-0 text-[9px] uppercase tracking-[0.12em] text-zinc-600">
                                                            {start}
                                                            {start && end
                                                                ? " – "
                                                                : ""}
                                                            {end}
                                                        </p>
                                                    )}
                                                </div>

                                                {description && (
                                                    <p className="mt-1.5 text-[10px] leading-4 text-zinc-500">
                                                        {description}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </PreviewSection>
                        )}

                        {education.length > 0 && (
                            <PreviewSection title="Education">
                                <div className="space-y-4">
                                    {education.map((item, index) => {
                                        const degree =
                                            item?.degree ||
                                            item?.qualification ||
                                            "Degree";

                                        const institution =
                                            item?.institution ||
                                            item?.school ||
                                            item?.university ||
                                            "";

                                        const start =
                                            item?.start_date ||
                                            item?.start_year ||
                                            "";

                                        const end =
                                            item?.end_date ||
                                            item?.graduation_year ||
                                            "";

                                        const description =
                                            item?.description || "";

                                        return (
                                            <div key={item?.id || index}>
                                                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                                                    <p className="text-[11px] font-semibold text-white">
                                                        {degree}
                                                        {institution && (
                                                            <span className="ml-1 font-normal text-zinc-500">
                                                                · {institution}
                                                            </span>
                                                        )}
                                                    </p>

                                                    {(start || end) && (
                                                        <p className="shrink-0 text-[9px] uppercase tracking-[0.12em] text-zinc-600">
                                                            {start}
                                                            {start && end
                                                                ? " – "
                                                                : ""}
                                                            {end}
                                                        </p>
                                                    )}
                                                </div>

                                                {description && (
                                                    <p className="mt-1.5 text-[10px] leading-4 text-zinc-500">
                                                        {description}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </PreviewSection>
                        )}

                        {skills.length > 0 && (
                            <PreviewSection title="Skills">
                                <div className="flex flex-wrap gap-1.5">
                                    {skills.map((skill, index) => {
                                        const label =
                                            typeof skill === "string"
                                                ? skill
                                                : skill?.name ||
                                                skill?.skill_name ||
                                                "";

                                        if (!label) return null;

                                        return (
                                            <span
                                                key={
                                                    skill?.id ||
                                                    `${label}-${index}`
                                                }
                                                className="border border-zinc-700 px-2 py-1 text-[9px] text-zinc-300"
                                            >
                                                {label}
                                            </span>
                                        );
                                    })}
                                </div>
                            </PreviewSection>
                        )}

                        {projects.length > 0 && (
                            <PreviewSection title="Projects">
                                <div className="space-y-3">
                                    {projects.map((project, index) => {
                                        const name =
                                            project?.name ||
                                            project?.title ||
                                            "Project";

                                        const link =
                                            project?.url ||
                                            project?.github_url ||
                                            project?.live_url ||
                                            "";

                                        const description =
                                            project?.description || "";

                                        return (
                                            <div key={project?.id || index}>
                                                <p className="text-[11px] font-semibold text-white">
                                                    {name}
                                                    {link && (
                                                        <span className="ml-1 font-normal text-zinc-500">
                                                            · {link}
                                                        </span>
                                                    )}
                                                </p>

                                                {description && (
                                                    <p className="mt-1 text-[10px] leading-4 text-zinc-500">
                                                        {description}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </PreviewSection>
                        )}

                        {certifications.length > 0 && (
                            <PreviewSection title="Certifications">
                                <div className="space-y-1.5">
                                    {certifications.map((item, index) => {
                                        const name =
                                            typeof item === "string"
                                                ? item
                                                : item?.name ||
                                                item?.title ||
                                                "";

                                        if (!name) return null;

                                        return (
                                            <p
                                                key={
                                                    item?.id ||
                                                    `${name}-${index}`
                                                }
                                                className="text-[10px] text-zinc-400"
                                            >
                                                {name}
                                            </p>
                                        );
                                    })}
                                </div>
                            </PreviewSection>
                        )}

                        {languages.length > 0 && (
                            <PreviewSection title="Languages">
                                <div className="flex flex-wrap gap-x-3 gap-y-1">
                                    {languages.map((item, index) => {
                                        const language =
                                            typeof item === "string"
                                                ? item
                                                : item?.name ||
                                                item?.language ||
                                                "";

                                        const proficiency =
                                            typeof item === "object"
                                                ? item?.proficiency ||
                                                item?.level ||
                                                ""
                                                : "";

                                        if (!language) return null;

                                        return (
                                            <p
                                                key={
                                                    item?.id ||
                                                    `${language}-${index}`
                                                }
                                                className="text-[10px] text-zinc-400"
                                            >
                                                <span className="font-semibold text-zinc-200">
                                                    {language}
                                                </span>
                                                {proficiency
                                                    ? ` · ${proficiency}`
                                                    : ""}
                                            </p>
                                        );
                                    })}
                                </div>
                            </PreviewSection>
                        )}
                    </>
                )}
            </div>
        </motion.aside>
    );
};

export default ResumeEditorPreview;
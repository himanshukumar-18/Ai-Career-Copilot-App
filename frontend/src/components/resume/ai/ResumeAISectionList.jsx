import ResumeAISectionCard from "./ResumeAISectionCard/ResumeAISectionCard";

const ResumeAISectionList = ({
    analysis,
    onImprove,
    onApply,
    onReject,
    improving = false,
}) => {
    if (!analysis) {
        return null;
    }

    const sections = [
        {
            id: "summary",
            title: "Professional Summary",
            data: analysis.summary,
        },
        {
            id: "experience",
            title: "Work Experience",
            data: analysis.experience,
        },
        {
            id: "education",
            title: "Education",
            data: analysis.education,
        },
        {
            id: "projects",
            title: "Projects",
            data: analysis.projects,
        },
        {
            id: "skills",
            title: "Skills",
            data: analysis.skills,
        },
        {
            id: "certifications",
            title: "Certifications",
            data: analysis.certifications,
        },
        {
            id: "languages",
            title: "Languages",
            data: analysis.languages,
        },
    ];

    return (
        <section className="border border-zinc-800 bg-zinc-950">
            <div className="border-b border-zinc-800 px-5 py-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                    AI Section Review
                </p>

                <h3 className="mt-2 text-xl font-semibold text-white">
                    Detailed Analysis
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                    Review AI feedback for every section of your resume.
                </p>
            </div>

            <div className="divide-y divide-zinc-800">
                {sections.map((section) => (
                    <ResumeAISectionCard
                        key={section.id}
                        id={section.id}
                        title={section.title}
                        section={section.data}
                        improving={improving}
                        onImprove={onImprove}
                        onApply={onApply}
                        onReject={onReject}
                    />
                ))}
            </div>
        </section>
    );
};

export default ResumeAISectionList;

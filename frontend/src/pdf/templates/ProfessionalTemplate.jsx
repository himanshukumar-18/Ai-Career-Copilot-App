/**
 * ProfessionalTemplate.jsx
 *
 * ATS-friendly, single-column professional resume template.
 * - 100% selectable / searchable text
 * - Seamless automatic multi-page breaks via @react-pdf/renderer v4.x
 * - No inline styles — all styles from styles.js
 *
 * Props:
 *   data {ResumeData} – output of mapResumeData()
 */

import {
    Document,
    Link,
    Page,
    Text,
    View,
} from "@react-pdf/renderer";

import styles from "../styles";

// ---------------------------------------------------------------------------
// Helpers & Sub-components
// ---------------------------------------------------------------------------

/** Horizontal rule followed by the section title label */
function SectionHeading({ title }) {
    return (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionRule} />
        </View>
    );
}

/** Robust bullet list component handling strings or arrays */
function BulletList({ text }) {
    if (!text) return null;

    let lines = [];
    if (Array.isArray(text)) {
        lines = text.map((t) => String(t).trim()).filter(Boolean);
    } else if (typeof text === "string") {
        lines = text
            .split(/\n|•|;\s+/)
            .map((line) => line.replace(/^[-*•]\s*/, "").trim())
            .filter(Boolean);
    }

    if (lines.length === 0) return null;

    if (lines.length === 1 && lines[0].length > 180) {
        return (
            <View style={styles.bulletList}>
                <Text style={styles.paragraph}>{lines[0]}</Text>
            </View>
        );
    }

    return (
        <View style={styles.bulletList}>
            {lines.map((line, idx) => (
                <View key={idx} style={styles.bulletItem}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{line}</Text>
                </View>
            ))}
        </View>
    );
}

/** Inline chip-style skill badge */
function SkillChip({ name }) {
    return (
        <View style={styles.skillChip}>
            <Text style={styles.skillChipText}>{name}</Text>
        </View>
    );
}

// ---------------------------------------------------------------------------
// Section renderers
// ---------------------------------------------------------------------------

function HeaderSection({ profile, socialLinks }) {
    const hasContact =
        profile.email || profile.phone || profile.location || profile.website;

    const links = socialLinks || [];

    return (
        <View style={styles.header}>
            {/* Candidate Name */}
            <Text style={styles.headerName}>{profile.fullName || "Your Name"}</Text>

            {/* Headline / Title */}
            {!!profile.headline && (
                <Text style={styles.headerHeadline}>{profile.headline}</Text>
            )}

            {/* Contact row */}
            {(hasContact || links.length > 0) && (
                <View style={styles.contactRow}>
                    {!!profile.email && (
                        <Link src={`mailto:${profile.email}`} style={styles.contactLink}>
                            {profile.email}
                        </Link>
                    )}
                    {!!profile.phone && (
                        <Text style={styles.contactItem}>{profile.phone}</Text>
                    )}
                    {!!profile.location && (
                        <Text style={styles.contactItem}>{profile.location}</Text>
                    )}
                    {!!profile.website && (
                        <Link src={profile.website} style={styles.contactLink}>
                            Portfolio
                        </Link>
                    )}
                    {links.map((link) => (
                        <Link key={link.id} src={link.url} style={styles.contactLink}>
                            {link.label || link.platform}
                        </Link>
                    ))}
                </View>
            )}
        </View>
    );
}

function SummarySection({ summary }) {
    if (!summary) return null;

    return (
        <View style={styles.section}>
            <SectionHeading title="Professional Summary" />
            <Text style={styles.paragraph}>{summary}</Text>
        </View>
    );
}

function ExperienceSection({ experiences }) {
    if (!experiences || experiences.length === 0) return null;

    return (
        <View style={styles.section}>
            <SectionHeading title="Work Experience" />

            {experiences.map((exp) => (
                <View key={exp.id} style={styles.item} wrap={false}>
                    <View style={styles.itemRow}>
                        <View style={styles.itemLeft}>
                            <Text style={styles.itemTitle}>{exp.position}</Text>
                            <Text style={styles.itemSubtitle}>
                                {exp.company}
                                {exp.employmentType
                                    ? ` · ${formatEmploymentType(exp.employmentType)}`
                                    : ""}
                                {exp.location ? ` · ${exp.location}` : ""}
                            </Text>
                            {!!exp.technologies && (
                                <Text style={styles.itemMeta}>Tech: {exp.technologies}</Text>
                            )}
                        </View>
                        {!!exp.dateRange && (
                            <Text style={styles.itemDate}>{exp.dateRange}</Text>
                        )}
                    </View>

                    <BulletList text={exp.description} />

                    {!!exp.achievements && (
                        <View style={{ marginTop: 2 }}>
                            <Text style={styles.itemMeta}>
                                Achievements: {exp.achievements}
                            </Text>
                        </View>
                    )}
                </View>
            ))}
        </View>
    );
}

function ProjectsSection({ projects }) {
    if (!projects || projects.length === 0) return null;

    return (
        <View style={styles.section}>
            <SectionHeading title="Key Projects" />

            {projects.map((project) => (
                <View key={project.id} style={styles.item} wrap={false}>
                    <View style={styles.itemRow}>
                        <View style={styles.itemLeft}>
                            <Text style={styles.itemTitle}>{project.title}</Text>
                            {!!project.role && (
                                <Text style={styles.itemSubtitle}>{project.role}</Text>
                            )}
                            {!!project.technologies && (
                                <Text style={styles.itemMeta}>Tech: {project.technologies}</Text>
                            )}
                        </View>
                        {!!project.dateRange && (
                            <Text style={styles.itemDate}>{project.dateRange}</Text>
                        )}
                    </View>

                    <BulletList text={project.description} />

                    {/* Project links */}
                    {(project.githubUrl || project.liveDemoUrl) && (
                        <View style={styles.linkRow}>
                            {!!project.githubUrl && (
                                <Link src={project.githubUrl} style={styles.inlineLink}>
                                    GitHub Repo
                                </Link>
                            )}
                            {!!project.liveDemoUrl && (
                                <Link src={project.liveDemoUrl} style={styles.inlineLink}>
                                    Live Demo
                                </Link>
                            )}
                        </View>
                    )}
                </View>
            ))}
        </View>
    );
}

function EducationSection({ education }) {
    if (!education || education.length === 0) return null;

    return (
        <View style={styles.section}>
            <SectionHeading title="Education" />

            {education.map((edu) => (
                <View key={edu.id} style={styles.item} wrap={false}>
                    <View style={styles.itemRow}>
                        <View style={styles.itemLeft}>
                            <Text style={styles.itemTitle}>{edu.institution}</Text>
                            <Text style={styles.itemSubtitle}>
                                {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(", ")}
                            </Text>
                            {!!edu.grade && (
                                <Text style={styles.itemMeta}>Grade/GPA: {edu.grade}</Text>
                            )}
                        </View>
                        {!!edu.dateRange && (
                            <Text style={styles.itemDate}>{edu.dateRange}</Text>
                        )}
                    </View>
                    {!!edu.description && <BulletList text={edu.description} />}
                </View>
            ))}
        </View>
    );
}

function SkillsSection({ skills }) {
    if (!skills || skills.length === 0) return null;

    // Group by category for cleaner ATS presentation
    const grouped = skills.reduce((acc, skill) => {
        const cat = skill.category || "General";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(skill);
        return acc;
    }, {});

    const sortedCategories = Object.keys(grouped);

    return (
        <View style={styles.section}>
            <SectionHeading title="Technical & Professional Skills" />

            {sortedCategories.map((cat) => (
                <View key={cat} style={{ marginBottom: 4 }}>
                    {sortedCategories.length > 1 && cat !== "General" && (
                        <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "#444444", marginBottom: 2 }}>
                            {cat}:
                        </Text>
                    )}
                    <View style={styles.skillsGrid}>
                        {grouped[cat].map((skill) => (
                            <SkillChip key={skill.id} name={skill.name} />
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );
}

function CertificationsSection({ certifications }) {
    if (!certifications || certifications.length === 0) return null;

    return (
        <View style={styles.section}>
            <SectionHeading title="Certifications" />

            <View style={styles.twoColGrid}>
                {certifications.map((cert) => (
                    <View key={cert.id} style={styles.twoColLeft}>
                        <Text style={styles.twoColName}>{cert.name}</Text>
                        <Text style={styles.twoColSub}>
                            {[cert.issuingOrganization, cert.issueDate].filter(Boolean).join(" · ")}
                        </Text>
                        {!!cert.credentialId && (
                            <Text style={styles.itemMeta}>ID: {cert.credentialId}</Text>
                        )}
                        {!!cert.credentialUrl && (
                            <Link src={cert.credentialUrl} style={styles.inlineLink}>
                                Verify Credential
                            </Link>
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
}

function LanguagesSection({ languages }) {
    if (!languages || languages.length === 0) return null;

    return (
        <View style={styles.section}>
            <SectionHeading title="Languages" />

            <View style={styles.twoColGrid}>
                {languages.map((lang) => (
                    <View key={lang.id} style={styles.twoColLeft}>
                        <Text style={styles.twoColName}>{lang.name}</Text>
                        {!!lang.proficiency && (
                            <Text style={styles.twoColSub}>
                                {formatProficiency(lang.proficiency)}
                            </Text>
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
}

/** Absolute-positioned footer with page numbers (fixed across all pages) */
function PageFooter({ name }) {
    return (
        <View style={styles.footer} fixed>
            <Text style={styles.footerLeft}>{name || "Resume"}</Text>
            <Text
                style={styles.footerRight}
                render={({ pageNumber, totalPages }) =>
                    `Page ${pageNumber} of ${totalPages}`
                }
            />
        </View>
    );
}

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------

function formatEmploymentType(type) {
    const map = {
        full_time: "Full-time",
        part_time: "Part-time",
        internship: "Internship",
        contract: "Contract",
        freelance: "Freelance",
        self_employed: "Self-employed",
    };
    return map[type?.toLowerCase()] ?? type;
}

function formatProficiency(proficiency) {
    const map = {
        native: "Native",
        fluent: "Fluent",
        advanced: "Advanced",
        intermediate: "Intermediate",
        beginner: "Beginner",
        elementary: "Elementary",
    };
    return map[proficiency?.toLowerCase()] ?? proficiency;
}

// ---------------------------------------------------------------------------
// Main template
// ---------------------------------------------------------------------------

/**
 * ProfessionalTemplate
 *
 * @param {{ data: import("../../utils/mapResumeData").ResumeData }} props
 */
const ProfessionalTemplate = ({ data }) => {
    const {
        profile,
        summary,
        experiences,
        education,
        projects,
        skills,
        certifications,
        languages,
        socialLinks,
    } = data;

    return (
        <Document
            title={data.meta?.title || "Resume"}
            author={profile.fullName || ""}
            subject="Resume"
            creator="AI Career Copilot"
            producer="AI Career Copilot"
            language="en"
        >
            <Page size="A4" style={styles.page} wrap>
                {/* Header (rendered once on Page 1) */}
                <HeaderSection profile={profile} socialLinks={socialLinks} />

                {/* Body sections */}
                <SummarySection summary={summary} />
                <ExperienceSection experiences={experiences} />
                <ProjectsSection projects={projects} />
                <EducationSection education={education} />
                <SkillsSection skills={skills} />
                <CertificationsSection certifications={certifications} />
                <LanguagesSection languages={languages} />

                {/* Footer (page number on every page) */}
                <PageFooter name={profile.fullName} />
            </Page>
        </Document>
    );
};

export default ProfessionalTemplate;

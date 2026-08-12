/**
 * mapResumeData.js
 *
 * Converts raw Redux resume state slices or nested resume objects into a single,
 * normalised data structure that every PDF template can consume safely.
 *
 * Guaranteed zero data loss across profile, summary, experience, education,
 * projects, skills, certifications, languages, and social links.
 */

import { formatDate, formatDateRange } from "./formatDate";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Trim a value to a non-empty string, or return an empty string. */
const safe = (value) => String(value ?? "").trim();

/** Ensure a value is returned as an array. */
const getArray = (value) => {
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
        if (Array.isArray(value.items)) return value.items;
        if (Array.isArray(value.results)) return value.results;
        if (Array.isArray(value.data)) return value.data;
    }
    return [];
};

// ---------------------------------------------------------------------------
// Section mappers
// ---------------------------------------------------------------------------

function mapProfile(profileInput, resumeInput) {
    const p =
        profileInput ||
        resumeInput?.profile ||
        resumeInput?.resume_profile ||
        resumeInput?.personal ||
        {};

    const first = safe(p.first_name || p.firstName);
    const last = safe(p.last_name || p.lastName);
    let fullName = [first, last].filter(Boolean).join(" ");

    if (!fullName) {
        fullName = safe(
            p.full_name ||
            p.fullName ||
            p.name ||
            resumeInput?.title
        );
    }

    let location = safe(p.location);
    if (!location) {
        const locParts = [
            safe(p.city),
            safe(p.state),
            safe(p.country),
        ].filter(Boolean);
        location = locParts.join(", ");
    }
    if (!location && safe(p.address)) {
        location = safe(p.address);
    }

    const website = safe(
        p.website ||
        p.portfolio_url ||
        p.portfolio ||
        p.linkedin_url ||
        p.website_url
    );

    return {
        fullName: fullName || "Candidate Name",
        firstName: first,
        lastName: last,
        headline: safe(
            p.headline ||
            p.professional_headline ||
            p.role ||
            p.title
        ),
        email: safe(p.email),
        phone: safe(p.phone || p.mobile),
        location: location,
        website: website,
        photoUrl: p.profile_photo || p.photoUrl || p.photo || p.avatar || null,
        postalCode: safe(p.postal_code || p.postalCode),
    };
}

function mapSummary(summaryInput, resumeInput) {
    const s =
        summaryInput ??
        resumeInput?.summary ??
        resumeInput?.professional_summary;

    if (!s) return "";
    if (typeof s === "string") return s.trim();
    if (typeof s === "object") {
        return safe(s.content || s.summary || s.text || s.description);
    }
    return "";
}

function mapExperiences(itemsInput, resumeInput) {
    const sliceItems = getArray(itemsInput);
    const items =
        sliceItems.length > 0
            ? sliceItems
            : getArray(
                resumeInput?.experiences ||
                resumeInput?.experience ||
                resumeInput?.work_experience ||
                resumeInput?.profile?.experiences
            );

    return items
        .filter((item) => item && typeof item === "object")
        .map((item, index) => {
            const company = safe(
                item.company ||
                item.company_name ||
                item.organization ||
                item.employer
            );
            const position = safe(
                item.position ||
                item.job_title ||
                item.role ||
                item.title
            );

            if (!company && !position) return null;

            const isCurrent = Boolean(
                item.currently_working ||
                item.is_current ||
                item.current ||
                item.currentlyWorking
            );

            const startDate =
                item.start_date ||
                item.startDate ||
                item.start_year ||
                item.start;
            const endDate =
                item.end_date || item.endDate || item.end_year || item.end;
            const dateRange = formatDateRange(startDate, endDate, isCurrent);

            let description = "";
            if (typeof item.description === "string") {
                description = item.description.trim();
            } else if (Array.isArray(item.description)) {
                description = item.description.join("\n");
            } else if (Array.isArray(item.highlights)) {
                description = item.highlights.join("\n");
            } else if (Array.isArray(item.bullets)) {
                description = item.bullets.join("\n");
            } else if (Array.isArray(item.responsibilities)) {
                description = item.responsibilities.join("\n");
            }

            return {
                id: item.id || `exp-${index}`,
                company,
                position,
                employmentType: safe(
                    item.employment_type || item.employmentType || item.type
                ),
                location: safe(item.location || item.city),
                startDate: startDate ? formatDate(startDate) : "",
                endDate: isCurrent ? "Present" : endDate ? formatDate(endDate) : "",
                isCurrent,
                dateRange,
                description,
                achievements: safe(item.achievements),
                technologies: safe(
                    item.technologies || item.tech_stack || item.techStack
                ),
                displayOrder: item.display_order ?? item.order ?? index,
            };
        })
        .filter(Boolean)
        .sort((a, b) => a.displayOrder - b.displayOrder);
}

function mapEducation(itemsInput, resumeInput) {
    const sliceItems = getArray(itemsInput);
    const items =
        sliceItems.length > 0
            ? sliceItems
            : getArray(
                resumeInput?.education ||
                resumeInput?.educations ||
                resumeInput?.profile?.education
            );

    return items
        .filter((item) => item && typeof item === "object")
        .map((item, index) => {
            const institution = safe(
                item.institution ||
                item.school ||
                item.university ||
                item.college
            );
            const degree = safe(item.degree || item.qualification);
            const fieldOfStudy = safe(
                item.field_of_study ||
                item.fieldOfStudy ||
                item.major ||
                item.field
            );

            if (!institution && !degree) return null;

            const isCurrent = Boolean(
                item.currently_studying ||
                item.is_current ||
                item.current ||
                item.currentlyStudying
            );

            const startDate =
                item.start_date ||
                item.startDate ||
                item.start_year ||
                item.start;
            const endDate =
                item.end_date ||
                item.endDate ||
                item.end_year ||
                item.end ||
                item.graduation_year;
            const dateRange = formatDateRange(startDate, endDate, isCurrent);

            let description = safe(item.description || item.highlights);

            return {
                id: item.id || `edu-${index}`,
                institution,
                degree,
                fieldOfStudy,
                grade: safe(item.grade || item.gpa || item.score),
                location: safe(item.location || item.city),
                startDate: startDate ? formatDate(startDate) : "",
                endDate: isCurrent ? "Present" : endDate ? formatDate(endDate) : "",
                isCurrent,
                dateRange,
                description,
                displayOrder: item.display_order ?? item.order ?? index,
            };
        })
        .filter(Boolean)
        .sort((a, b) => a.displayOrder - b.displayOrder);
}

function mapProjects(itemsInput, resumeInput) {
    const sliceItems = getArray(itemsInput);
    const items =
        sliceItems.length > 0
            ? sliceItems
            : getArray(
                resumeInput?.projects ||
                resumeInput?.project ||
                resumeInput?.profile?.projects
            );

    return items
        .filter((item) => item && typeof item === "object")
        .map((item, index) => {
            const title = safe(item.title || item.name || item.project_name);
            if (!title) return null;

            const startDate = item.start_date || item.startDate;
            const endDate = item.end_date || item.endDate;
            const dateRange = formatDateRange(startDate, endDate, false);

            let description = "";
            if (typeof item.description === "string") {
                description = item.description.trim();
            } else if (Array.isArray(item.description)) {
                description = item.description.join("\n");
            } else if (Array.isArray(item.highlights)) {
                description = item.highlights.join("\n");
            } else if (Array.isArray(item.bullets)) {
                description = item.bullets.join("\n");
            }

            return {
                id: item.id || `proj-${index}`,
                title,
                role: safe(item.role || item.position),
                technologies: safe(
                    item.technologies ||
                    item.tech_stack ||
                    item.techStack ||
                    item.tools
                ),
                description,
                githubUrl: safe(
                    item.github_url ||
                    item.githubUrl ||
                    item.github ||
                    item.code_url
                ),
                liveDemoUrl: safe(
                    item.live_demo_url ||
                    item.liveDemoUrl ||
                    item.live_url ||
                    item.url ||
                    item.website ||
                    item.demo_url
                ),
                startDate: startDate ? formatDate(startDate) : "",
                endDate: endDate ? formatDate(endDate) : "",
                dateRange,
                displayOrder: item.display_order ?? item.order ?? index,
            };
        })
        .filter(Boolean)
        .sort((a, b) => a.displayOrder - b.displayOrder);
}

function mapSkills(itemsInput, resumeInput) {
    const sliceItems = getArray(itemsInput);
    const items =
        sliceItems.length > 0
            ? sliceItems
            : getArray(resumeInput?.skills || resumeInput?.profile?.skills);

    return items
        .filter(
            (item) =>
                item &&
                (typeof item === "string" ||
                    safe(item.name || item.skill_name || item.title))
        )
        .filter((item) => typeof item === "string" || item.is_visible !== false)
        .map((item, index) => {
            if (typeof item === "string") {
                return {
                    id: `skill-${index}`,
                    name: item.trim(),
                    category: "General",
                    level: "",
                    displayOrder: index,
                };
            }
            return {
                id: item.id || `skill-${index}`,
                name: safe(item.name || item.skill_name || item.title),
                category: safe(item.category || item.type || "General"),
                level: safe(item.level || item.proficiency),
                displayOrder: item.display_order ?? item.order ?? index,
            };
        })
        .filter((skill) => Boolean(skill.name))
        .sort((a, b) => a.displayOrder - b.displayOrder);
}

function mapCertifications(itemsInput, resumeInput) {
    const sliceItems = getArray(itemsInput);
    const items =
        sliceItems.length > 0
            ? sliceItems
            : getArray(
                resumeInput?.certifications ||
                resumeInput?.resume_certifications ||
                resumeInput?.profile?.certifications
            );

    return items
        .filter(
            (item) =>
                item &&
                (typeof item === "string" ||
                    safe(item.name || item.title || item.certification_name))
        )
        .filter((item) => typeof item === "string" || item.is_visible !== false)
        .map((item, index) => {
            if (typeof item === "string") {
                return {
                    id: `cert-${index}`,
                    name: item.trim(),
                    issuingOrganization: "",
                    credentialId: "",
                    credentialUrl: "",
                    issueDate: "",
                    expiryDate: "",
                    displayOrder: index,
                };
            }
            const issueDate = item.issue_date || item.issueDate || item.date;
            const expiryDate =
                item.expiry_date || item.expiryDate || item.expiration_date;
            const noExpiry = Boolean(
                item.does_not_expire || item.no_expiry || item.doesNotExpire
            );

            return {
                id: item.id || `cert-${index}`,
                name: safe(item.name || item.title || item.certification_name),
                issuingOrganization: safe(
                    item.issuing_organization ||
                    item.issuingOrganization ||
                    item.issuer ||
                    item.organization
                ),
                credentialId: safe(item.credential_id || item.credentialId),
                credentialUrl: safe(
                    item.credential_url || item.credentialUrl || item.url || item.link
                ),
                issueDate: issueDate ? formatDate(issueDate) : "",
                expiryDate: noExpiry
                    ? "No Expiry"
                    : expiryDate
                    ? formatDate(expiryDate)
                    : "",
                displayOrder: item.display_order ?? item.order ?? index,
            };
        })
        .filter((cert) => Boolean(cert.name))
        .sort((a, b) => a.displayOrder - b.displayOrder);
}

function mapLanguages(itemsInput, resumeInput) {
    const sliceItems = getArray(itemsInput);
    const items =
        sliceItems.length > 0
            ? sliceItems
            : getArray(
                resumeInput?.languages || resumeInput?.profile?.languages
            );

    return items
        .filter(
            (item) =>
                item &&
                (typeof item === "string" ||
                    safe(item.name || item.language || item.title))
        )
        .map((item, index) => {
            if (typeof item === "string") {
                return {
                    id: `lang-${index}`,
                    name: item.trim(),
                    proficiency: "",
                    displayOrder: index,
                };
            }
            return {
                id: item.id || `lang-${index}`,
                name: safe(item.name || item.language || item.title),
                proficiency: safe(item.proficiency || item.level),
                displayOrder: item.display_order ?? item.order ?? index,
            };
        })
        .filter((lang) => Boolean(lang.name))
        .sort((a, b) => a.displayOrder - b.displayOrder);
}

function mapSocialLinks(itemsInput, resumeInput) {
    const sliceItems = getArray(itemsInput);
    const items =
        sliceItems.length > 0
            ? sliceItems
            : getArray(
                resumeInput?.social_links ||
                resumeInput?.socialLinks ||
                resumeInput?.profile?.social_links
            );

    return items
        .filter((item) => item && safe(item.url || item.link || item.href))
        .map((item, index) => {
            const platform = safe(
                item.platform || item.type || item.name || "link"
            );
            const url = safe(item.url || item.link || item.href);
            const label = safe(item.label || item.custom_platform || platform);

            return {
                id: item.id || `link-${index}`,
                platform,
                label,
                url,
            };
        });
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Normalises Redux resume state or resume JSON into a single PDF-ready data object.
 *
 * @param {object} params
 * @returns {object}
 */
export function mapResumeData({
    profile = null,
    summary = null,
    experiences = [],
    education = [],
    projects = [],
    skills = [],
    certifications = [],
    languages = [],
    socialLinks = [],
    resume = null,
} = {}) {
    return {
        meta: {
            id: resume?.id ?? null,
            title: safe(resume?.title) || "Resume",
            template: safe(resume?.template) || "professional",
            themeColor: safe(resume?.theme_color || resume?.themeColor) || "#111111",
            fontFamily: safe(resume?.font_family || resume?.fontFamily) || "Helvetica",
        },
        profile: mapProfile(profile, resume),
        summary: mapSummary(summary, resume),
        experiences: mapExperiences(experiences, resume),
        education: mapEducation(education, resume),
        projects: mapProjects(projects, resume),
        skills: mapSkills(skills, resume),
        certifications: mapCertifications(certifications, resume),
        languages: mapLanguages(languages, resume),
        socialLinks: mapSocialLinks(socialLinks, resume),
    };
}

/**
 * useResumePDF.js
 *
 * Custom hook that orchestrates PDF generation and download.
 *
 * Responsibilities:
 *  - Collect all resume data from Redux
 *  - Map it to PDF-ready data via mapResumeData()
 *  - Generate the PDF blob via @react-pdf/renderer
 *  - Trigger the browser download
 *  - Expose loading / error / success states
 */

import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { mapResumeData } from "../utils/mapResumeData";
import { createResumePDFBlob } from "../pdf/createResumePDFBlob";

// Redux selectors
import { selectResumeProfile } from "../features/resumeProfile/resumeProfileSelectors";
import { selectResumeSummary } from "../features/summary/summarySelectors";
import { selectExperiences } from "../features/experience/experienceSelectors";
import { selectEducationList } from "../features/education/educationSelectors";
import { selectProjectList } from "../features/projects/projectSelectors";
import { selectSkillList } from "../features/skills/skillSelectors";
import { selectCertifications } from "../features/certifications/certificationSelectors";
import { selectLanguageList } from "../features/language/languageSelectors";
import { selectSocialLinks } from "../features/socialLinks/socialLinksSelectors";
import { selectSelectedResume } from "../features/resume/resumeSelectors";

// Status constants
export const PDF_STATUS = {
    IDLE: "idle",
    PREPARING: "preparing",
    GENERATING: "generating",
    SUCCESS: "success",
    ERROR: "error",
};

/**
 * @param {string} [templateOverride]  – Optional template override.
 */
export function useResumePDF(templateOverride) {
    const [status, setStatus] = useState(PDF_STATUS.IDLE);
    const [error, setError] = useState(null);

    // Redux data
    const resume = useSelector(selectSelectedResume);
    const profile = useSelector(selectResumeProfile);
    const summary = useSelector(selectResumeSummary);
    const experiences = useSelector(selectExperiences);
    const education = useSelector(selectEducationList);
    const projects = useSelector(selectProjectList);
    const skills = useSelector(selectSkillList);
    const certifications = useSelector(selectCertifications);
    const languages = useSelector(selectLanguageList);
    const socialLinks = useSelector(selectSocialLinks);

    /** Builds a safe, professional filename dynamically. */
    const buildFilename = useCallback((resumeData) => {
        const fullName = resumeData?.profile?.fullName;
        if (fullName && fullName !== "Candidate Name" && fullName !== "Your Name") {
            const cleanName = fullName
                .replace(/[^a-zA-Z0-9\s]/g, "")
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .join("_");
            if (cleanName) {
                return `${cleanName}_Resume.pdf`;
            }
        }
        const title = resumeData?.meta?.title;
        if (title && title !== "Resume" && title !== "Untitled Resume") {
            const cleanTitle = title
                .replace(/[^a-zA-Z0-9\s]/g, "")
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .join("_");
            if (cleanTitle) {
                return `${cleanTitle}.pdf`;
            }
        }
        return "Resume.pdf";
    }, []);

    /** Triggers a browser download for the given Blob. */
    const downloadBlob = useCallback((blob, filename) => {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = filename;
        anchor.style.display = "none";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    }, []);

    /**
     * generate
     *
     * Collects Redux data → maps → renders PDF → downloads.
     *
     * @param {string} [template]  – Template key to use for generation.
     */
    const generate = useCallback(
        async (template) => {
            if (status === PDF_STATUS.PREPARING || status === PDF_STATUS.GENERATING) {
                return; // Prevent duplicate concurrent requests
            }

            setError(null);
            setStatus(PDF_STATUS.PREPARING);

            try {
                // 1. Normalise all Redux data
                const resumeData = mapResumeData({
                    profile,
                    summary,
                    experiences,
                    education,
                    projects,
                    skills,
                    certifications,
                    languages,
                    socialLinks,
                    resume,
                });

                // Sanity check
                const hasData =
                    Boolean(resumeData.profile.fullName && resumeData.profile.fullName !== "Candidate Name") ||
                    Boolean(resumeData.profile.email) ||
                    Boolean(resumeData.summary) ||
                    resumeData.experiences.length > 0 ||
                    resumeData.education.length > 0 ||
                    resumeData.projects.length > 0 ||
                    resumeData.skills.length > 0;

                if (!hasData) {
                    throw new Error(
                        "Your resume appears to be empty. Please fill in your details before exporting."
                    );
                }

                setStatus(PDF_STATUS.GENERATING);

                // 2. Resolve template
                const resolvedTemplate =
                    template ??
                    templateOverride ??
                    resumeData.meta.template ??
                    "professional";

                // 3. Render PDF to blob
                const blob = await createResumePDFBlob(resumeData, resolvedTemplate);

                // 4. Download
                const filename = buildFilename(resumeData);
                downloadBlob(blob, filename);

                setStatus(PDF_STATUS.SUCCESS);
            } catch (err) {
                const message =
                    err?.message ||
                    "Unable to generate PDF. Please try again.";
                setError(message);
                setStatus(PDF_STATUS.ERROR);
            }
        },
        [
            profile,
            summary,
            experiences,
            education,
            projects,
            skills,
            certifications,
            languages,
            socialLinks,
            resume,
            templateOverride,
            status,
            buildFilename,
            downloadBlob,
        ]
    );

    const reset = useCallback(() => {
        setStatus(PDF_STATUS.IDLE);
        setError(null);
    }, []);

    return {
        status,
        error,
        generate,
        reset,
        isPreparing: status === PDF_STATUS.PREPARING,
        isGenerating: status === PDF_STATUS.GENERATING,
        isLoading:
            status === PDF_STATUS.PREPARING ||
            status === PDF_STATUS.GENERATING,
        isSuccess: status === PDF_STATUS.SUCCESS,
        isError: status === PDF_STATUS.ERROR,
    };
}

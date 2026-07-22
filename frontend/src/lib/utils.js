import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const calculateResumeCompletion = (resume = {}) => {
  if (!resume) return 0;

  const sectionChecks = [
    Boolean(
      typeof resume.summary === "string"
        ? resume.summary.trim()
        : resume.summary?.content?.trim()
    ),
    Array.isArray(resume.experiences) && resume.experiences.length > 0,
    Array.isArray(resume.education || resume.educations) && (resume.education || resume.educations).length > 0,
    Array.isArray(resume.skills) && resume.skills.length > 0,
    Array.isArray(resume.projects) && resume.projects.length > 0,
    Array.isArray(resume.certifications) && resume.certifications.length > 0,
    Array.isArray(resume.languages) && resume.languages.length > 0,
    Array.isArray(resume.social_links) && resume.social_links.length > 0,
    Boolean(resume.profile?.first_name || resume.profile?.last_name || resume.profile?.email || resume.first_name || resume.last_name || resume.email),
  ];

  const completed = sectionChecks.filter(Boolean).length;
  return Math.round((completed / sectionChecks.length) * 100);
};

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const calculateResumeCompletion = (resume = {}) => {
  if (!resume) return 0;

  const sectionChecks = [
    Boolean(resume.summary?.trim()),
    Array.isArray(resume.experiences) && resume.experiences.length > 0,
    Array.isArray(resume.education) && resume.education.length > 0,
    Array.isArray(resume.skills) && resume.skills.length > 0,
    Array.isArray(resume.projects) && resume.projects.length > 0,
    Array.isArray(resume.certifications) && resume.certifications.length > 0,
    Array.isArray(resume.languages) && resume.languages.length > 0,
    Boolean(resume.website?.trim() || resume.portfolio?.trim() || resume.linkedin?.trim() || resume.github?.trim()),
    Boolean(resume.first_name || resume.last_name || resume.email),
  ];

  const completed = sectionChecks.filter(Boolean).length;
  return Math.round((completed / sectionChecks.length) * 100);
};

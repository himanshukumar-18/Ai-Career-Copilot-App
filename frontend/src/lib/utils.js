import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const hasText = (value) => typeof value === "string" && value.trim().length > 0;
const hasValidUrl = (value) => {
  if (!hasText(value)) return false;

  try {
    const url = new URL(value);
    return Boolean(url.protocol && url.host);
  } catch {
    return false;
  }
};

const hasValidEntry = (items, predicate) =>
  Array.isArray(items) && items.some((item) => item && predicate(item));

/**
 * Calculates section completion from the API's resume schema.  The caller may
 * pass live section data over the detailed-resume values, so unsaved/stale
 * nested response data never masks a successful section update.
 */
export const calculateResumeCompletion = (resume = {}) => {
  if (!resume) return 0;

  const profile = resume.profile || resume.resume_profile || {};
  const firstName = profile.first_name || resume.first_name;
  const lastName = profile.last_name || resume.last_name;
  const hasName = hasText(firstName) || hasText(lastName);
  const hasContactOrHeadline = [profile.headline, profile.email, profile.phone]
    .some(hasText);

  const summary = typeof resume.summary === "string"
    ? resume.summary
    : resume.summary?.content;
  const educations = resume.educations || resume.education;

  const sectionChecks = [
    hasName && hasContactOrHeadline,
    hasText(summary),
    hasValidEntry(resume.experiences, (item) =>
      hasText(item.company) && hasText(item.position)
    ),
    hasValidEntry(educations, (item) =>
      hasText(item.institution) && hasText(item.degree)
    ),
    hasValidEntry(resume.skills, (item) => hasText(item.name)),
    hasValidEntry(resume.projects, (item) =>
      hasText(item.title) && hasText(item.description)
    ),
    hasValidEntry(resume.certifications, (item) => hasText(item.name)),
    hasValidEntry(resume.languages, (item) => hasText(item.name)),
    hasValidEntry(resume.social_links, (item) => hasValidUrl(item.url)),
  ];

  return Math.round(
    (sectionChecks.filter(Boolean).length / sectionChecks.length) * 100
  );
};

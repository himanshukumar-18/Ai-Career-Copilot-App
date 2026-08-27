// Resume State
export const selectResumeState = (state) => state.resume;

// Resume List
export const selectResumes = (state) => state.resume.resumes;

// Selected Resume
export const selectSelectedResume = (state) =>
    state.resume.selectedResume;

// Loading State
export const selectResumeLoading = (state) =>
    state.resume.loading;

// Error State
export const selectResumeError = (state) =>
    state.resume.error;

// Pagination
export const selectResumePagination = (state) =>
    state.resume.pagination;

// Total Resume Count
export const selectResumeCount = (state) =>
    state.resume.pagination.count;

// Next Page
export const selectNextResumePage = (state) =>
    state.resume.pagination.next;

// Previous Page
export const selectPreviousResumePage = (state) =>
    state.resume.pagination.previous;

// Default Resume
export const selectDefaultResume = (state) =>
    state.resume.resumes.find((resume) => resume.is_default);

// Published Resumes
export const selectPublishedResumes = (state) =>
    state.resume.resumes.filter((resume) => resume.is_public);

// Draft Resumes
export const selectDraftResumes = (state) =>
    state.resume.resumes.filter((resume) => !resume.is_public);

// The detailed resume is the persisted baseline. Section slices are the live
// editor source while a section has been loaded/changed in this session.
// Keeping this composition in a selector prevents the preview and completion
// indicator from drifting apart after a section save.
export const selectLiveResumeData = (state) => {
    const resume = state.resume.selectedResume;

    if (!resume) return null;

    const fromLoadedSlice = (slice, fallback) =>
        slice?.fetchStatus === "succeeded" || slice?.status === "succeeded"
            ? slice.items ?? slice.data ?? fallback
            : fallback;

    return {
        ...resume,
        profile: state.resumeProfile.profile ?? resume.profile,
        summary: state.summary.summary ?? resume.summary,
        experiences: fromLoadedSlice(state.experience, resume.experiences),
        educations: fromLoadedSlice(state.education, resume.educations),
        skills: fromLoadedSlice(state.skills, resume.skills),
        projects: fromLoadedSlice(state.projects, resume.projects),
        certifications: fromLoadedSlice(
            state.resumeCertifications,
            resume.certifications
        ),
        languages: fromLoadedSlice(state.language, resume.languages),
        social_links: fromLoadedSlice(state.socialLinks, resume.social_links),
    };

};

export const selectPublishState = (state) => state.resume.publish;

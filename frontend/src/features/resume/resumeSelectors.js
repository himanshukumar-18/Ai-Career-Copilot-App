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
    state.resume.resumes.filter((resume) => resume.is_published);

// Draft Resumes
export const selectDraftResumes = (state) =>
    state.resume.resumes.filter((resume) => !resume.is_published);
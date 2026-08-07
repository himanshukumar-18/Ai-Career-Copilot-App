export const RESUME_LIST_PATH = "/resume";
export const RESUME_ANALYSIS_PATH = "/student/resume-analysis";

export const resumeAnalysisPath = (resumeId) =>
    `${RESUME_ANALYSIS_PATH}?resumeId=${encodeURIComponent(resumeId)}`;

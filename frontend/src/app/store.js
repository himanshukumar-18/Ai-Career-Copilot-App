import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import profileReducer from "../features/profile/profileSlice";
import resumeReducer from "../features/resume/resumeSlice";
import resumeProfileReducer from "../features/resumeProfile/resumeProfileSlice";
import resumeCertificationsReducer from "../features/certifications/certificationSlice";
import educationReducer from "../features/education/educationSlice";
import experienceReducer from "../features/experience/experienceSlice";
import languageReducer from "../features/language/languageSlice";
import projectsReducer from "../features/projects/projectSlice";
import skillsReducer from "../features/skills/skillSlice";
import socialLinksReducer from "../features/socialLinks/socialLinksSlice";
import summaryReducer from "../features/summary/summarySlice";
import resumeAIReducer from "../features/resumeAI/resumeAISlice";
import projectLabReducer from "../features/projectLab/projectLabSlice";
import careerRoadmapReducer from "../features/careerRoadmap/careerRoadmapSlice";
import interviewPrepReducer from "../features/interviewPrep/interviewPrepSlice";
import adminReducer from "../features/admin/adminSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        resume: resumeReducer,
        resumeProfile: resumeProfileReducer,
        resumeCertifications: resumeCertificationsReducer,
        education: educationReducer,
        experience: experienceReducer,
        language: languageReducer,
        projects: projectsReducer,
        skills: skillsReducer,
        socialLinks: socialLinksReducer,
        summary: summaryReducer,
        resumeAI: resumeAIReducer,
        projectLab: projectLabReducer,
        careerRoadmap: careerRoadmapReducer,
        interviewPrep: interviewPrepReducer,
        admin: adminReducer,
    },
});

export default store;

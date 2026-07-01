import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import profileReducer from "../features/profile/profileSlice";
import resumeReducer from "../features/resume/resumeSlice";
import certificationsReducer from "../features/certifications/certificationSlice";
import languageReducer from "../features/language/languageSlice";
import projectsReducer from "../features/projects/projectSlice";
import skillsReducer from "../features/skills/skillSlice";
import socialLinksReducer from "../features/socialLinks/socialLinksSlice";
import summaryReducer from "../features/summary/summarySlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        resume: resumeReducer,
        certifications: certificationsReducer,
        language: languageReducer,
        projects: projectsReducer,
        skills: skillsReducer,
        socialLinks: socialLinksReducer,
        summary: summaryReducer,
    },
});

export default store
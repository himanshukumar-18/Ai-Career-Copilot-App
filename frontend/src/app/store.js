import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import profileReducer from "../features/profile/profileSlice"
import resumeReducer from "../features/resume/resumeSlice"

const store = configureStore({
    reducer: {
        auth:
            authReducer,
        profile:
            profileReducer,
        resume:
            resumeReducer,
    }
})

export default store
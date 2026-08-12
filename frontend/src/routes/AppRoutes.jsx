import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import { Outlet } from "react-router-dom";

const ResumeEditorLayoutWrapper = () => <Outlet />;

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyOTP from "../pages/auth/VerifyOTP";


// student pages
import Dashboard from "../pages/student/Dashboard";
import Profile from "../pages/student/Profile";
import Resume from "../pages/student/Resume";
import ResumeEditor from "../pages/student/ResumeEditor";
import ProjectLab from "../pages/student/ProjectLab";
import Roadmap from "../pages/student/Roadmap";
import ResumeAnalysis from "../pages/student/ResumeAnalysis";
import PublicResume from "../pages/PublicResume";


//page not found
import NotFound from "../pages/NotFound";


import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
    return (
        <BrowserRouter>

            <Routes>

                {/* Auth Routes */}

                <Route element={<AuthLayout />}>
                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/verify-otp"
                        element={<VerifyOTP />}
                    />
                </Route>

                {/* Dashboard Routes */}

                <Route
                    path="/public/resume/:resumeId"
                    element={<PublicResume />}
                />

                <Route
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/profile"
                        element={<Profile />}
                    />

                    <Route
                        path="/resume"
                        element={<Resume />}
                    />

                    <Route
                        path="/student/resume-analysis"
                        element={<ResumeAnalysis />}
                    />

                    <Route 
                        path="/roadmap"
                        element={<Roadmap />}
                    />

                    <Route 
                        path="/project-lab"
                        element={<ProjectLab />}
                    />

                </Route>

                {/* Resume editor routes (must NOT be wrapped by DashboardLayout) */}
                <Route
                    element={
                        <ProtectedRoute>
                            <ResumeEditorLayoutWrapper />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        path="/resume/:resumeId/edit"
                        element={<ResumeEditor />}
                    />

                    <Route
                        path="/resume/:resumeId/:section"
                        element={<ResumeEditor />}
                    />

                    <Route
                        path="/resume/:resumeId"
                        element={<ResumeEditor />}
                    />
                </Route>

                {/* Dashboard Routes */}

                <Route
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                </Route>

                {/* Default Route */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                {/* 404 Route */}

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>

        </BrowserRouter>
    );
};

export default AppRoutes;

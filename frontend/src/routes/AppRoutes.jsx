import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Outlet,
} from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminLayout from "../layouts/AdminLayout";

const ResumeEditorLayoutWrapper = () => <Outlet />;

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyOTP from "../pages/auth/VerifyOTP";

// Student pages
import Dashboard from "../pages/student/Dashboard";
import Profile from "../pages/student/Profile";
import Resume from "../pages/student/Resume";
import ResumeEditor from "../pages/student/ResumeEditor";
import ProjectLab from "../pages/student/ProjectLab";
import Roadmap from "../pages/student/Roadmap";
import ResumeAnalysis from "../pages/student/ResumeAnalysis";
import InterviewPreparation from "../pages/student/InterviewPreparation";
import PublicResume from "../pages/PublicResume";

// Admin pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminStudents from "../pages/admin/AdminStudents";
import AdminCareerRoles from "../pages/admin/AdminCareerRoles";
import AdminResources from "../pages/admin/AdminResources";
import AdminResumes from "../pages/admin/AdminResumes";
import AdminAIMonitoring from "../pages/admin/AdminAIMonitoring";
import AdminAnalytics from "../pages/admin/AdminAnalytics";
import AdminSystemHealth from "../pages/admin/AdminSystemHealth";
import AdminSettings from "../pages/admin/AdminSettings";

// Page not found
import NotFound from "../pages/NotFound";

import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Auth Routes */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-otp" element={<VerifyOTP />} />
                </Route>

                {/* Public Resume */}
                <Route path="/public/resume/:resumeId" element={<PublicResume />} />

                {/* Student Protected Routes */}
                <Route
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/resume" element={<Resume />} />
                    <Route path="/student/resume-analysis" element={<ResumeAnalysis />} />
                    <Route path="/roadmap" element={<Roadmap />} />
                    <Route path="/project-lab" element={<ProjectLab />} />
                    <Route path="/interview-prep" element={<InterviewPreparation />} />
                </Route>

                {/* Resume Editor Routes */}
                <Route
                    element={
                        <ProtectedRoute>
                            <ResumeEditorLayoutWrapper />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/resume/:resumeId/edit" element={<ResumeEditor />} />
                    <Route path="/resume/:resumeId/:section" element={<ResumeEditor />} />
                    <Route path="/resume/:resumeId" element={<ResumeEditor />} />
                </Route>

                {/* Admin Protected Routes */}
                <Route
                    element={
                        <AdminProtectedRoute>
                            <AdminLayout />
                        </AdminProtectedRoute>
                    }
                >
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/students" element={<AdminStudents />} />
                    <Route path="/admin/career-roles" element={<AdminCareerRoles />} />
                    <Route path="/admin/resources" element={<AdminResources />} />
                    <Route path="/admin/resumes" element={<AdminResumes />} />
                    <Route path="/admin/ai-monitoring" element={<AdminAIMonitoring />} />
                    <Route path="/admin/analytics" element={<AdminAnalytics />} />
                    <Route path="/admin/health" element={<AdminSystemHealth />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                </Route>

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;

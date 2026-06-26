import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyOTP from "@/pages/auth/VerifyOTP";

// student pages
import Dashboard from "../pages/student/Dashboard";
import Profile from "../pages/student/Profile";

//page not found
import NotFound from "@/pages/NotFound";


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
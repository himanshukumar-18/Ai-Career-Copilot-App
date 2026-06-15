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
import Dashboard from "../pages/student/Dashboard";
import VerifyOTP from "@/pages/auth/VerifyOTP";

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
                    element={
                        <div className="min-h-screen flex items-center justify-center">
                            Page Not Found
                        </div>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
};

export default AppRoutes;
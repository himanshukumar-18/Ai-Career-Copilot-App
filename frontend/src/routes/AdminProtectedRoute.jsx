import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShieldAlert } from "lucide-react";
import Button from "../components/ui/Button";

const AdminProtectedRoute = ({ children }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== "ADMIN") {
        return (
            <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex items-center justify-center p-4 font-sans">
                <div className="max-w-md w-full border border-red-500/40 bg-[var(--surface)] p-6 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 mx-auto flex items-center justify-center border border-red-500/30">
                        <ShieldAlert size={24} />
                    </div>

                    <h1 className="text-xl font-bold tracking-tight">403 Forbidden Access</h1>

                    <p className="font-mono text-xs text-[var(--text-muted)] leading-relaxed">
                        Your account (<span className="text-white font-bold">{user?.email}</span>) does not have Administrator privileges. Access to the Admin Terminal is strictly restricted.
                    </p>

                    <div className="pt-2 flex flex-col gap-2">
                        <Button
                            onClick={() => window.location.href = "/dashboard"}
                            className="w-full h-10 font-mono text-xs uppercase tracking-[0.15em]"
                        >
                            Return to Student Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return children;
};

export default AdminProtectedRoute;

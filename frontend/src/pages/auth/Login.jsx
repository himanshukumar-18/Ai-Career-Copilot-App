import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff, Loader2, AlertCircle, Lock } from "lucide-react";

import Panel from "../../components/ui/Panel";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import { loginThunk, googleLoginThunk, getMeThunk } from "../../features/auth/authThunk";
import { getProfileThunk } from "@/features/profile/profileThunk";
import { resetAuthState } from "@/features/auth/authSlice";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const {
        isAuthenticated,
        isLoading,
        isError,
        isSuccess,
        message,
        user
    } = useSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onTouched",
    });

    const onSubmit = async (data) => {
        if (isLoading) return;

        const result = await dispatch(
            loginThunk({
                email: data.email,
                password: data.password,
            })
        );

        if (loginThunk.fulfilled.match(result)) {
            await dispatch(getMeThunk(result.payload.access));
            await dispatch(getProfileThunk());
        }
    };

    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        if (isError) {
            toast.error(typeof message === "string" ? message : "Invalid email or password.");
        }

        if (isSuccess) {
            toast.success(typeof message === "string" ? message : "Authenticated successfully.");
        }
    }, [isError, isSuccess, message]);

    return (
        <Panel className="w-full">
            {/* Header */}
            <div className="border-b border-[var(--border)] pb-5">
                <div className="flex items-center justify-between">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent)]">
                        Authentication Terminal
                    </p>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] border border-[var(--border)] px-2 py-0.5">
                        v2.4.0
                    </span>
                </div>

                <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                    Access System
                </h1>

                <p className="mt-2 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                    Authenticate to access your AI-powered career intelligence dashboard.
                </p>
            </div>

            {/* API Error Alert */}
            {isError && message && (
                <div
                    role="alert"
                    aria-live="assertive"
                    className="mt-5 border border-red-500/50 bg-red-500/10 p-3 flex items-start gap-2.5 text-xs text-red-400 font-mono"
                >
                    <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
                    <div className="flex-1">
                        <span className="font-bold uppercase tracking-wider block mb-0.5">Authentication Failed</span>
                        <span>{typeof message === "string" ? message : "Invalid credentials or network issue."}</span>
                    </div>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
                {/* Email Field */}
                <div>
                    <label
                        htmlFor="login-email"
                        className="block mb-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]"
                    >
                        Email Address
                    </label>

                    <Input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        disabled={isLoading}
                        placeholder="name@example.com"
                        aria-invalid={errors.email ? "true" : "false"}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        {...register("email", {
                            required: "Email is required.",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Enter a valid email address.",
                            },
                        })}
                    />

                    {errors.email && (
                        <p id="email-error" className="mt-1.5 font-mono text-xs text-red-500 flex items-center gap-1">
                            <span>⚠</span> {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label
                            htmlFor="login-password"
                            className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]"
                        >
                            Password
                        </label>

                        <button
                            type="button"
                            onClick={() => {
                                toast.info("Password reset link will be sent to your registered email.");
                            }}
                            className="font-mono text-[11px] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors underline"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <div className="relative">
                        <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            disabled={isLoading}
                            placeholder="Enter password"
                            aria-invalid={errors.password ? "true" : "false"}
                            aria-describedby={errors.password ? "password-error" : undefined}
                            {...register("password", {
                                required: "Password is required.",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters.",
                                },
                            })}
                            className="pr-10"
                        />

                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] focus:outline-none focus:text-[var(--accent)] transition-colors p-1"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {errors.password && (
                        <p id="password-error" className="mt-1.5 font-mono text-xs text-red-500 flex items-center gap-1">
                            <span>⚠</span> {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Remember Me Option */}
                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 rounded-none border border-[var(--border)] bg-[var(--surface)] text-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] cursor-pointer"
                        />
                        <span className="font-mono text-xs text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                            Remember session
                        </span>
                    </label>
                </div>

                {/* Submit CTA */}
                <Button
                    type="submit"
                    className="w-full h-11 font-mono uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-2"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={16} className="animate-spin text-white" />
                            <span>Signing In...</span>
                        </>
                    ) : (
                        <>
                            <Lock size={14} />
                            <span>Access System</span>
                        </>
                    )}
                </Button>

                {/* Divider */}
                <div className="relative py-3">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[var(--border)]" />
                    </div>

                    <div className="relative flex justify-center">
                        <span className="bg-[var(--background)] px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                            OR OAUTH PROVIDER
                        </span>
                    </div>
                </div>

                {/* Google OAuth */}
                <div className="flex justify-center">
                    <GoogleLogin
                        theme="outline"
                        size="large"
                        text="continue_with"
                        shape="rectangular"
                        width="full"
                        onSuccess={(credentialResponse) => {
                            dispatch(googleLoginThunk(credentialResponse.credential));
                        }}
                        onError={() => {
                            toast.error("Google Authentication failed.");
                        }}
                    />
                </div>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-5 border-t border-[var(--border)]">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.15em]">
                    <span className="text-[var(--text-muted)]">New Operator?</span>

                    <Link
                        to="/register"
                        onClick={() => dispatch(resetAuthState())}
                        className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors underline font-medium"
                    >
                        Create Profile
                    </Link>
                </div>
            </div>

            {/* System Status Footer */}
            <div className="mt-5 border-t border-[var(--border)] pt-4">
                <div className="flex items-center justify-between text-xs font-mono">
                    <span className="uppercase tracking-[0.15em] text-[var(--text-muted)] text-[10px]">
                        AI Security Node
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Online</span>
                    </span>
                </div>
            </div>
        </Panel>
    );
};

export default Login;
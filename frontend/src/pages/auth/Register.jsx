import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff, Loader2, AlertCircle, UserPlus } from "lucide-react";

import Panel from "../../components/ui/Panel";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import { registerThunk, googleLoginThunk } from "../../features/auth/authThunk";
import { resetAuthState } from "../../features/auth/authSlice";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        isLoading,
        isError,
        isSuccess,
        message,
    } = useSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        mode: "onTouched",
    });

    const password = watch("password");

    const onSubmit = async (data) => {
        if (isLoading) return;

        const result = await dispatch(
            registerThunk({
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                password: data.password,
            })
        );

        if (registerThunk.fulfilled.match(result)) {
            toast.success("Account created successfully! Please verify your email.");
            navigate("/verify-otp");
        }
    };

    useEffect(() => {
        if (isError) {
            toast.error(typeof message === "string" ? message : "Unable to create your account.");
        }
    }, [isError, message]);

    return (
        <Panel className="w-full">
            {/* Header */}
            <div className="border-b border-[var(--border)] pb-5">
                <div className="flex items-center justify-between">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent)]">
                        Operator Registration
                    </p>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] border border-[var(--border)] px-2 py-0.5">
                        Step 1 / 2
                    </span>
                </div>

                <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                    Create Profile
                </h1>

                <p className="mt-2 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                    Start building your AI-powered career intelligence journey.
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
                        <span className="font-bold uppercase tracking-wider block mb-0.5">Registration Failed</span>
                        <span>{typeof message === "string" ? message : "Unable to create account."}</span>
                    </div>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 sm:space-y-5">
                {/* First Name & Last Name Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label
                            htmlFor="reg-firstname"
                            className="block mb-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]"
                        >
                            First Name
                        </label>

                        <Input
                            id="reg-firstname"
                            type="text"
                            autoComplete="given-name"
                            disabled={isLoading}
                            placeholder="Rahul"
                            aria-invalid={errors.first_name ? "true" : "false"}
                            aria-describedby={errors.first_name ? "first-name-error" : undefined}
                            {...register("first_name", {
                                required: "First name is required.",
                            })}
                        />

                        {errors.first_name && (
                            <p id="first-name-error" className="mt-1.5 font-mono text-xs text-red-500 flex items-center gap-1">
                                <span>⚠</span> {errors.first_name.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="reg-lastname"
                            className="block mb-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]"
                        >
                            Last Name
                        </label>

                        <Input
                            id="reg-lastname"
                            type="text"
                            autoComplete="family-name"
                            disabled={isLoading}
                            placeholder="Kumar"
                            aria-invalid={errors.last_name ? "true" : "false"}
                            aria-describedby={errors.last_name ? "last-name-error" : undefined}
                            {...register("last_name", {
                                required: "Last name is required.",
                            })}
                        />

                        {errors.last_name && (
                            <p id="last-name-error" className="mt-1.5 font-mono text-xs text-red-500 flex items-center gap-1">
                                <span>⚠</span> {errors.last_name.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Email Field */}
                <div>
                    <label
                        htmlFor="reg-email"
                        className="block mb-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]"
                    >
                        Email Address
                    </label>

                    <Input
                        id="reg-email"
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
                    <label
                        htmlFor="reg-password"
                        className="block mb-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]"
                    >
                        Password
                    </label>

                    <div className="relative">
                        <Input
                            id="reg-password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            disabled={isLoading}
                            placeholder="Create secure password"
                            aria-invalid={errors.password ? "true" : "false"}
                            aria-describedby={errors.password ? "password-error" : undefined}
                            {...register("password", {
                                required: "Password is required.",
                                minLength: {
                                    value: 8,
                                    message: "Minimum 8 characters required.",
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

                {/* Confirm Password Field */}
                <div>
                    <label
                        htmlFor="reg-confirmpassword"
                        className="block mb-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]"
                    >
                        Confirm Password
                    </label>

                    <div className="relative">
                        <Input
                            id="reg-confirmpassword"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            disabled={isLoading}
                            placeholder="Re-enter password"
                            aria-invalid={errors.confirmPassword ? "true" : "false"}
                            aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                            {...register("confirmPassword", {
                                required: "Confirm your password.",
                                validate: (value) =>
                                    value === password || "Passwords do not match.",
                            })}
                            className="pr-10"
                        />

                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] focus:outline-none focus:text-[var(--accent)] transition-colors p-1"
                        >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {errors.confirmPassword && (
                        <p id="confirm-password-error" className="mt-1.5 font-mono text-xs text-red-500 flex items-center gap-1">
                            <span>⚠</span> {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                {/* Submit CTA */}
                <Button
                    type="submit"
                    className="w-full h-11 font-mono uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-2 mt-2"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={16} className="animate-spin text-white" />
                            <span>Creating Profile...</span>
                        </>
                    ) : (
                        <>
                            <UserPlus size={14} />
                            <span>Create Account</span>
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
                            OR QUICK REGISTRATION
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
                            toast.error("Google Registration failed.");
                        }}
                    />
                </div>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-5 border-t border-[var(--border)]">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.15em]">
                    <span className="text-[var(--text-muted)]">Already Registered?</span>

                    <Link
                        to="/login"
                        onClick={() => dispatch(resetAuthState())}
                        className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors underline font-medium"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </Panel>
    );
};

export default Register;
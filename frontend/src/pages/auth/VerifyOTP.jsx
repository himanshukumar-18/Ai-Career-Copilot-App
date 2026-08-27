import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, ShieldCheck, AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";

import Panel from "../../components/ui/Panel";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import { verifyOTPThunk } from "../../features/auth/authThunk";
import { resetAuthState } from "../../features/auth/authSlice";

const VerifyOTP = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [countdown, setCountdown] = useState(30);
    const [canResend, setCanResend] = useState(false);

    const {
        isLoading,
        isError,
        isSuccess,
        message,
    } = useSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onTouched",
    });

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else {
            setCanResend(true);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleResendCode = () => {
        if (!canResend) return;
        toast.success("Verification code resent! Please check your inbox.");
        setCountdown(30);
        setCanResend(false);
    };

    const onSubmit = async (data) => {
        if (isLoading) return;

        const result = await dispatch(
            verifyOTPThunk({
                email: data.email,
                otp: data.otp,
            })
        );

        if (verifyOTPThunk.fulfilled.match(result)) {
            toast.success("Email verified successfully! You can now log in.");
            dispatch(resetAuthState());
            navigate("/login");
        }
    };

    return (
        <Panel className="w-full">
            {/* Header */}
            <div className="border-b border-[var(--border)] pb-5">
                <div className="flex items-center justify-between">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent)]">
                        Email Verification
                    </p>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] border border-[var(--border)] px-2 py-0.5">
                        Step 2 / 2
                    </span>
                </div>

                <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                    Verify Your Email
                </h1>

                <p className="mt-2 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                    Enter your registered email and the 6-digit OTP security code.
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
                        <span className="font-bold uppercase tracking-wider block mb-0.5">Verification Failed</span>
                        <span>{typeof message === "string" ? message : "Invalid or expired OTP code."}</span>
                    </div>
                </div>
            )}

            {/* API Success Alert */}
            {isSuccess && message && (
                <div
                    role="status"
                    className="mt-5 border border-emerald-500/50 bg-emerald-500/10 p-3 flex items-start gap-2.5 text-xs text-emerald-400 font-mono"
                >
                    <ShieldCheck size={16} className="shrink-0 mt-0.5 text-emerald-400" />
                    <div className="flex-1">
                        <span className="font-bold uppercase tracking-wider block mb-0.5">Verification Successful</span>
                        <span>{typeof message === "string" ? message : "Email verified."}</span>
                    </div>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
                {/* Email Field */}
                <div>
                    <label
                        htmlFor="otp-email"
                        className="block mb-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]"
                    >
                        Email Address
                    </label>

                    <Input
                        id="otp-email"
                        type="email"
                        autoComplete="email"
                        disabled={isLoading}
                        placeholder="name@example.com"
                        aria-invalid={errors.email ? "true" : "false"}
                        aria-describedby={errors.email ? "otp-email-error" : undefined}
                        {...register("email", {
                            required: "Email is required.",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Enter a valid email address.",
                            },
                        })}
                    />

                    {errors.email && (
                        <p id="otp-email-error" className="mt-1.5 font-mono text-xs text-red-500 flex items-center gap-1">
                            <span>⚠</span> {errors.email.message}
                        </p>
                    )}
                </div>

                {/* 6-Digit OTP Field */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label
                            htmlFor="otp-code"
                            className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]"
                        >
                            6-Digit Security Code
                        </label>

                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={!canResend || isLoading}
                            className={`font-mono text-[11px] flex items-center gap-1 transition-colors ${
                                canResend
                                    ? "text-[var(--accent)] hover:underline cursor-pointer"
                                    : "text-[var(--text-muted)] cursor-not-allowed"
                            }`}
                        >
                            <RefreshCw size={12} className={!canResend ? "animate-spin" : ""} />
                            <span>{canResend ? "Resend Code" : `Resend in ${countdown}s`}</span>
                        </button>
                    </div>

                    <Input
                        id="otp-code"
                        type="text"
                        maxLength={6}
                        disabled={isLoading}
                        placeholder="123456"
                        className="font-mono text-center tracking-[0.4em] text-lg font-bold uppercase"
                        aria-invalid={errors.otp ? "true" : "false"}
                        aria-describedby={errors.otp ? "otp-code-error" : undefined}
                        {...register("otp", {
                            required: "Security code is required.",
                            pattern: {
                                value: /^\d{6}$/,
                                message: "Enter a valid 6-digit numeric OTP code.",
                            },
                        })}
                    />

                    {errors.otp && (
                        <p id="otp-code-error" className="mt-1.5 font-mono text-xs text-red-500 flex items-center gap-1">
                            <span>⚠</span> {errors.otp.message}
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
                            <span>Verifying...</span>
                        </>
                    ) : (
                        <>
                            <ShieldCheck size={16} />
                            <span>Verify & Activate</span>
                        </>
                    )}
                </Button>
            </form>

            {/* Back to Login Footer */}
            <div className="mt-6 pt-5 border-t border-[var(--border)]">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.15em]">
                    <Link
                        to="/login"
                        onClick={() => dispatch(resetAuthState())}
                        className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1.5"
                    >
                        <ArrowLeft size={14} />
                        <span>Back to Sign In</span>
                    </Link>
                </div>
            </div>
        </Panel>
    );
};

export default VerifyOTP;
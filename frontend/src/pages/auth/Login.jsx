import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import Panel from "../../components/ui/Panel";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import { loginThunk } from "../../features/auth/authThunk";

const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        isAuthenticated,
        isLoading,
        isError,
        message,
    } = useSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {

        dispatch(
            loginThunk({
                email: data.email,
                password: data.password,
            })
        );
    };

    useEffect(() => {

        if (isAuthenticated) {
            navigate("/dashboard");
        }

    }, [isAuthenticated, navigate]);

    return (
        <Panel>

            {/* Header */}

            <div className="border-b border-[var(--border)] pb-5">

                <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent)]">
                    Authentication Terminal
                </p>

                <h1 className="mt-4 text-3xl font-semibold">
                    Access System
                </h1>

                <p className="mt-2 text-sm text-[var(--text-muted)]">
                    Authenticate to access your career intelligence dashboard.
                </p>

            </div>

            {/* Error Message */}

            {isError && (
                <div className="mt-5 border border-red-500 p-3 text-sm text-red-500">
                    {message || "Authentication Failed"}
                </div>
            )}

            {/* Form */}

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 space-y-5"
            >

                {/* Email */}

                <div>

                    <label
                        className="
                            block
                            mb-2
                            font-mono
                            text-xs
                            uppercase
                            tracking-[0.2em]
                            text-[var(--text-secondary)]
                        "
                    >
                        Email Address
                    </label>

                    <Input
                        type="email"
                        placeholder="name@example.com"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Enter a valid email",
                            },
                        })}
                    />

                    {errors.email && (
                        <p className="mt-2 text-sm text-red-500">
                            {errors.email.message}
                        </p>
                    )}

                </div>

                {/* Password */}

                <div>

                    <label
                        className="
                            block
                            mb-2
                            font-mono
                            text-xs
                            uppercase
                            tracking-[0.2em]
                            text-[var(--text-secondary)]
                        "
                    >
                        Password
                    </label>

                    <Input
                        type="password"
                        placeholder="Enter password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Minimum 8 characters required",
                            },
                        })}
                    />

                    {errors.password && (
                        <p className="mt-2 text-sm text-red-500">
                            {errors.password.message}
                        </p>
                    )}

                </div>

                {/* Submit */}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading
                        ? "Authenticating..."
                        : "Access System"}
                </Button>

            </form>

            {/* Footer */}

            <div className="mt-6 pt-6 border-t border-[var(--border)]">

                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.15em]">

                    <span className="text-[var(--text-muted)]">
                        New Operator
                    </span>

                    <Link
                        to="/register"
                        className="
                            text-[var(--text-primary)]
                            hover:text-[var(--accent)]
                            transition-colors
                        "
                    >
                        Create Profile
                    </Link>

                </div>

            </div>

            {/* System Status */}

            <div className="mt-6 border-t border-[var(--border)] pt-4">

                <div className="flex items-center justify-between">

                    <span className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--text-muted)]">
                        System Status
                    </span>

                    <span className="font-mono text-xs uppercase text-green-500">
                        Online
                    </span>

                </div>

            </div>

        </Panel>
    );
};

export default Login;
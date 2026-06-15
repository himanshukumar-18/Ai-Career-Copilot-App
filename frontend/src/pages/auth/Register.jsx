import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    GoogleLogin
} from "@react-oauth/google";

import Panel from "../../components/ui/Panel";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import { registerThunk, googleLoginThunk } from "../../features/auth/authThunk";
import { resetAuthState } from "../../features/auth/authSlice";

const Register = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

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
    } = useForm();

    const password = watch("password");

    const onSubmit = async (data) => {

        const result = await dispatch(
            registerThunk({
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                password: data.password,
            })
        );

        if (registerThunk.fulfilled.match(result)) {
            navigate("/verify-otp");
        }
    };

    useEffect(() => {

        if (isError || isSuccess) {

            const timer = setTimeout(() => {

                dispatch(
                    resetAuthState()
                );

            }, 4000);

            return () =>
                clearTimeout(timer);
        }

    }, [
        isError,
        isSuccess,
        dispatch,
    ]);

    return (
        <Panel>

            {/* Header */}

            <div className="border-b border-[var(--border)] pb-5">

                <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent)]">
                    Operator Registration
                </p>

                <h1 className="mt-4 text-3xl font-semibold">
                    Create Profile
                </h1>

                <p className="mt-2 text-sm text-[var(--text-muted)]">
                    Register to access the Career Intelligence Platform.
                </p>

            </div>

            {/* Error */}

            {
                isError && (
                    <div
                        className="
                mt-5
                border
                border-red-500
                p-3
                text-sm
                text-red-500
            "
                    >
                        {
                            typeof message === "string"
                                ? message
                                : "Something went wrong"
                        }
                    </div>
                )
            }

            {/* success */}

            {
                isSuccess && (
                    <div
                        className="
                mt-5
                border
                border-green-500
                p-3
                text-sm
                text-green-500
            "
                    >
                        {message ||
                            "Operation Successful"}
                    </div>
                )
            }

            {/* Form */}

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 space-y-5"
            >

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>

                        <label className="block mb-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                            First Name
                        </label>

                        <Input
                            type="text"
                            placeholder="Rahul"
                            {...register("first_name", {
                                required: "First name is required",
                            })}
                        />

                        {errors.first_name && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.first_name.message}
                            </p>
                        )}

                    </div>

                    <div>

                        <label className="block mb-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                            Last Name
                        </label>

                        <Input
                            type="text"
                            placeholder="Kumar"
                            {...register("last_name", {
                                required: "Last name is required",
                            })}
                        />

                        {errors.last_name && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.last_name.message}
                            </p>
                        )}

                    </div>

                </div>

                {/* Email */}

                <div>

                    <label className="block mb-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                        Email Address
                    </label>

                    <Input
                        type="email"
                        placeholder="name@example.com"
                        {...register("email", {
                            required: "Email is required",
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

                    <label className="block mb-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                        Password
                    </label>

                    <Input
                        type="password"
                        placeholder="Create secure password"
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

                {/* Confirm Password */}

                <div>

                    <label className="block mb-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                        Confirm Password
                    </label>

                    <Input
                        type="password"
                        placeholder="Confirm password"
                        {...register("confirmPassword", {
                            required: "Confirm your password",
                            validate: (value) =>
                                value === password ||
                                "Passwords do not match",
                        })}
                    />

                    {errors.confirmPassword && (
                        <p className="mt-2 text-sm text-red-500">
                            {errors.confirmPassword.message}
                        </p>
                    )}

                </div>

                <div className="relative py-4">

                    <div className="absolute inset-0 flex items-center">

                        <div
                            className="
                w-full
                border-t
                border-[var(--border)]
            "
                        />

                    </div>

                    <div className="relative flex justify-center">

                        <span
                            className="
                bg-[var(--background)]
                px-4
                text-xs
                text-[var(--text-muted)]
            "
                        >
                            OR
                        </span>

                    </div>

                </div>

                <div className="flex justify-center">

                    <GoogleLogin

                        theme="outline"

                        size="large"

                        text="continue_with"

                        shape="rectangular"

                        width="full"

                        onSuccess={(
                            credentialResponse
                        ) => {

                            dispatch(
                                googleLoginThunk(
                                    credentialResponse
                                        .credential
                                )
                            );

                        }}

                        onError={() => {

                            console.log(
                                "Google Login Failed"
                            );

                        }}

                    />

                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading
                        ? "Creating Profile..."
                        : "Create Profile"}
                </Button>

            </form>

            {/* Footer */}

            <div className="mt-6 pt-6 border-t border-[var(--border)]">

                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.15em]">

                    <span className="text-[var(--text-muted)]">
                        Existing Operator
                    </span>

                    <Link
                        to="/login"
                        className="
                            text-[var(--text-primary)]
                            hover:text-[var(--accent)]
                            transition-colors
                        "
                    >
                        Access System
                    </Link>

                </div>

            </div>

        </Panel>
    );
};

export default Register;
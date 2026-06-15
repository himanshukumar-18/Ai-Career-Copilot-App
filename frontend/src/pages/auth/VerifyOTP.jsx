import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Panel from "../../components/ui/Panel";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import { verifyOTPThunk }
    from "../../features/auth/authThunk";

const VerifyOTP = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const {
        isLoading,
        isError,
        isSuccess,
        message,
    } = useSelector(
        (state) => state.auth
    );

    const {
        register,
        handleSubmit,
    } = useForm();

    const onSubmit = async (
        data
    ) => {

        const result =
            await dispatch(
                verifyOTPThunk(
                    data
                )
            );

        if (
            verifyOTPThunk.fulfilled.match(
                result
            )
        ) {

            navigate(
                "/login"
            );

        }

    };

    return (
        <Panel>

            <div className="border-b border-[var(--border)] pb-5">

                <h1 className="text-3xl font-semibold">
                    Verify Email
                </h1>

                <p className="mt-2 text-sm text-[var(--text-muted)]">
                    Enter the OTP sent to your email.
                </p>

            </div>

            <form
                onSubmit={handleSubmit(
                    onSubmit
                )}
                className="mt-6 space-y-5"
            >

                <Input
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                />

                <Input
                    type="text"
                    placeholder="6 Digit OTP"
                    {...register("otp")}
                />

                <Button
                    type="submit"
                    className="w-full"
                >
                    {
                        isLoading
                            ? "Verifying..."
                            : "Verify OTP"
                    }
                </Button>

                {isError && (

                    <p className="text-red-500 text-sm">

                        {message}

                    </p>

                )}

                {isSuccess && (

                    <p className="text-green-500 text-sm">

                        {message}

                    </p>

                )}

            </form>

        </Panel>
    );
};

export default VerifyOTP;
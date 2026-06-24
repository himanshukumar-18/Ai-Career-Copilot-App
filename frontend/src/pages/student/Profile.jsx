import { useEffect, useState } from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    getProfileThunk,
    updateProfileThunk,
} from "../../features/profile/profileThunk";

import { resetProfileState } from "../../features/profile/profileSlice";

import Panel from "../../components/ui/Panel";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";

const Profile = () => {

    const dispatch =
        useDispatch();

    const {
        profile,
        isLoading,
        isError,
        isSuccess,
        message
    } = useSelector(
        (state) => state.profile
    );

    const { user } = useSelector(
        (state) => state.auth
    );

    const [avatar, setAvatar] =
        useState(null);

    const [preview, setPreview] =
        useState(null);

    const [formData, setFormData] =
        useState({
            bio: "",
            phone: "",
            location: "",
            github_url: "",
            linkedin_url: "",
            portfolio_url: "",
            career_goal: "",
        });

    useEffect(() => {

        dispatch(
            getProfileThunk()
        );

    }, [dispatch]);

    useEffect(() => {

        if (profile) {

            setFormData({

                headline:
                    profile.headline || "",

                bio:
                    profile.bio || "",

                phone:
                    profile.phone || "",

                location:
                    profile.location || "",

                github_url:
                    profile.github_url || "",

                linkedin_url:
                    profile.linkedin_url || "",

                portfolio_url:
                    profile.portfolio_url || "",

                career_goal:
                    profile.career_goal || "",
            });

            setPreview(
                profile.profile_picture
            );
        }

    }, [profile]);

    useEffect(() => {

        if (
            isSuccess ||
            isError
        ) {

            const timer =
                setTimeout(
                    () => {

                        dispatch(
                            resetProfileState()
                        );

                    },
                    3000
                );

            return () =>
                clearTimeout(
                    timer
                );
        }

    }, [
        isSuccess,
        isError,
        dispatch,
    ]);

    const handleChange = (
        e
    ) => {

        setFormData({
            ...formData,

            [e.target.name]:
                e.target.value,
        });
    };

    const handleFieldUpdate =
        async (
            field,
            value
        ) => {

            const payload =
                new FormData();

            payload.append(
                field,
                value
            );

            dispatch(
                updateProfileThunk(
                    payload
                )
            );
        };



    const handleAvatarChange =
        (e) => {

            const file =
                e.target.files?.[0];

            if (!file) return;

            setAvatar(file);

            setPreview(
                URL.createObjectURL(
                    file
                )
            );
        };

    const handleSubmit =
        () => {

            const payload =
                new FormData();

            Object.entries(
                formData
            ).forEach(
                ([key, value]) => {

                    payload.append(
                        key,
                        value
                    );
                }
            );

            if (avatar) {

                payload.append(
                    "profile_picture",
                    avatar
                );
            }

            dispatch(
                updateProfileThunk(
                    payload
                )
            );
        };

    if (isLoading) {

        return (

            <div className="space-y-6">

                <Skeleton className="h-40 w-full" />

                <Skeleton className="h-72 w-full" />

                <Skeleton className="h-72 w-full" />

            </div>
        );
    }


    return (
        <>

            {
                isSuccess && (

                    <div
                        className="
                fixed
                top-24
                right-6
                z-50

                border

                bg-[var(--background)]

                px-5
                py-4

                shadow-lg

                min-w-[320px]
            "
                    >

                        <p
                            className="
                    text-xs

                    uppercase

                    tracking-[0.25em]

                    text-[var(--accent)]
                "
                        >
                            Success
                        </p>

                        <p
                            className="mt-2"
                        >
                            Profile Updated Successfully
                        </p>

                    </div>

                )
            }

            {
                isError && (

                    <div
                        className="
                fixed
                top-24
                right-6
                z-50

                border

                bg-[var(--background)]

                px-5
                py-4

                shadow-lg

                min-w-[320px]
            "
                    >

                        <p
                            className="
                    text-xs

                    uppercase

                    tracking-[0.25em]

                    text-red-500
                "
                        >
                            Error
                        </p>

                        <p
                            className="mt-2"
                        >
                            {
                                message ||
                                "Failed To Update Profile"
                            }
                        </p>

                    </div>

                )
            }

            <div
                className="
                mx-auto
                p-4
                space-y-6
            "
            >
                <Panel
                    title="Operator Profile"
                    headerAction={
                        <Button
                            onClick={
                                handleSubmit
                            }
                        >
                            Save Changes
                        </Button>
                    }
                >

                    <div
                        className="
                        flex
                        flex-col
                        lg:flex-row
                        gap-8
                    "
                    >

                        <div>

                            <input
                                type="file"
                                id="avatar"
                                accept="image/*"
                                className="hidden"
                                onChange={
                                    handleAvatarChange
                                }
                                required
                            />

                            <label
                                htmlFor="avatar"
                                className="
                                w-36
                                h-36

                                border
                                border-[var(--border)]

                                flex
                                items-center
                                justify-center

                                cursor-pointer
                                overflow-hidden

                                hover:border-[var(--accent)]

                                transition
                            "
                            >

                                {preview ? (

                                    <img
                                        src={preview}
                                        alt="Profile"
                                        className="
                                        w-full
                                        h-full
                                        object-cover
                                    "
                                    />

                                ) : (

                                    <span
                                        className="
                                        text-xs
                                        uppercase
                                        font-mono
                                    "
                                    >
                                        Upload
                                        Photo
                                    </span>

                                )}

                            </label>

                        </div>

                        <div
                            className="
                            flex-1
                        "
                        >

                            <p
                                className="
                                text-xs
                                uppercase
                                tracking-[0.25em]

                                text-[var(--accent)]

                                font-mono
                            "
                            >
                                Career Intelligence
                                Profile
                            </p>

                            <h1
                                className="
        mt-3
        text-3xl
        font-semibold
    "
                            >
                                {
                                    user?.first_name
                                }{" "}
                                {
                                    user?.last_name
                                }
                            </h1>

                            <p className="mt-1 text-sm text-[var(--muted)]">
                                {
                                    user?.email
                                }
                            </p>

                        </div>

                    </div>

                </Panel>

                <Panel
                    title="Professional Identity"
                >

                    <div
                        className="
            grid
            grid-cols-1
            gap-6
        "
                    >

                        {/* Headline */}

                        <div
                            className="
                flex
                flex-col
                md:flex-row
                gap-3
                items-start
                md:items-center
            "
                        >

                            <div className="flex-1">

                                <Input
                                    name="headline"
                                    value={
                                        formData.headline
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Frontend Developer"
                                    required
                                />

                            </div>

                            <Button
                                disabled={
                                    isLoading
                                }
                                onClick={() =>
                                    handleFieldUpdate(
                                        "headline",
                                        formData.headline
                                    )
                                }
                            >
                                {
                                    isLoading
                                        ? "Updating..."
                                        : "Update"
                                }
                            </Button>

                        </div>

                        {/* Phone */}

                        <div
                            className="
                flex
                flex-col
                md:flex-row
                gap-3
                items-start
                md:items-center
            "
                        >

                            <div className="flex-1">

                                <Input
                                    name="phone"
                                    value={
                                        formData.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="+91 XXXXX XXXXX"
                                    required
                                />

                            </div>

                            <Button
                                disabled={
                                    isLoading
                                }
                                onClick={() =>
                                    handleFieldUpdate(
                                        "phone",
                                        formData.phone
                                    )
                                }
                            >
                                {
                                    isLoading
                                        ? "Updating..."
                                        : "Update"
                                }
                            </Button>

                        </div>

                        {/* Bio */}

                        <div>

                            <textarea
                                name="bio"
                                value={
                                    formData.bio
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Tell us about yourself..."

                                className="
                    w-full
                    min-h-[140px]

                    p-4

                    border
                    border-[var(--border)]

                    bg-[var(--surface)]

                    resize-none
                    outline-none
                "
                                required
                            />

                            <div className="mt-3">

                                <Button
                                    disabled={
                                        isLoading
                                    }
                                    onClick={() =>
                                        handleFieldUpdate(
                                            "bio",
                                            formData.bio
                                        )
                                    }
                                >
                                    {
                                        isLoading
                                            ? "Updating..."
                                            : "Update Bio"
                                    }
                                </Button>

                            </div>

                        </div>

                    </div>

                </Panel>

                <Panel
                    title="Location & Career"
                >

                    <div
                        className="
            grid
            grid-cols-1
            gap-6
        "
                    >

                        {/* Location */}

                        <div
                            className="
                flex
                flex-col
                md:flex-row
                gap-3
                items-start
                md:items-center
            "
                        >

                            <div className="flex-1">

                                <Input
                                    name="location"
                                    value={
                                        formData.location
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Delhi, India"
                                    required
                                />

                            </div>

                            <Button
                                disabled={
                                    isLoading
                                }
                                onClick={() =>
                                    handleFieldUpdate(
                                        "location",
                                        formData.location
                                    )
                                }
                            >
                                {
                                    isLoading
                                        ? "Updating..."
                                        : "Update"
                                }
                            </Button>

                        </div>

                        {/* Career Goal */}

                        <div>

                            <textarea
                                name="career_goal"
                                required
                                value={
                                    formData.career_goal
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Describe your career goal"

                                className="
                    w-full
                    min-h-[180px]

                    p-4

                    border
                    border-[var(--border)]

                    bg-[var(--surface)]

                    resize-none
                    outline-none

                    rounded-md
                "
                            />

                            <div className="mt-3">

                                <Button
                                    disabled={
                                        isLoading
                                    }
                                    onClick={() =>
                                        handleFieldUpdate(
                                            "career_goal",
                                            formData.career_goal
                                        )
                                    }
                                >
                                    {
                                        isLoading
                                            ? "Updating..."
                                            : "Update Career Goal"
                                    }
                                </Button>

                            </div>

                        </div>

                    </div>

                </Panel>

                <Panel
                    title="Social Links"
                >

                    <div
                        className="
            grid
            grid-cols-1
            gap-6
        "
                    >

                        {/* GitHub */}

                        <div>

                            <div
                                className="
                    flex
                    flex-col
                    md:flex-row
                    gap-3
                    items-start
                    md:items-center
                "
                            >

                                <div className="flex-1">

                                    <Input
                                        name="github_url"
                                        value={
                                            formData.github_url
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="https://github.com/username"
                                        required
                                    />

                                </div>

                                <Button
                                    disabled={
                                        isLoading
                                    }
                                    onClick={() =>
                                        handleFieldUpdate(
                                            "github_url",
                                            formData.github_url
                                        )
                                    }
                                >
                                    {
                                        isLoading
                                            ? "Updating..."
                                            : "Update"
                                    }
                                </Button>

                            </div>

                            {
                                formData.github_url && (

                                    <a
                                        href={
                                            formData.github_url.startsWith(
                                                "http"
                                            )
                                                ? formData.github_url
                                                : `https://${formData.github_url}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="
                            inline-block
                            mt-2

                            text-blue-500
                            hover:text-blue-400

                            underline
                            text-sm
                        "
                                    >
                                        Open GitHub →
                                    </a>

                                )
                            }

                        </div>

                        {/* LinkedIn */}

                        <div>

                            <div
                                className="
                    flex
                    flex-col
                    md:flex-row
                    gap-3
                    items-start
                    md:items-center
                "
                            >

                                <div className="flex-1">

                                    <Input
                                        name="linkedin_url"
                                        value={
                                            formData.linkedin_url
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="https://linkedin.com/in/username"
                                        required
                                    />

                                </div>

                                <Button
                                    disabled={
                                        isLoading
                                    }
                                    onClick={() =>
                                        handleFieldUpdate(
                                            "linkedin_url",
                                            formData.linkedin_url
                                        )
                                    }
                                >
                                    {
                                        isLoading
                                            ? "Updating..."
                                            : "Update"
                                    }
                                </Button>

                            </div>

                            {
                                formData.linkedin_url && (

                                    <a
                                        href={
                                            formData.linkedin_url.startsWith(
                                                "http"
                                            )
                                                ? formData.linkedin_url
                                                : `https://${formData.linkedin_url}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="
                            inline-block
                            mt-2

                            text-blue-500
                            hover:text-blue-400

                            underline
                            text-sm
                        "
                                    >
                                        Open LinkedIn →
                                    </a>

                                )
                            }

                        </div>

                        {/* Portfolio */}

                        <div>

                            <div
                                className="
                    flex
                    flex-col
                    md:flex-row
                    gap-3
                    items-start
                    md:items-center
                "
                            >

                                <div className="flex-1">

                                    <Input
                                        name="portfolio_url"
                                        value={
                                            formData.portfolio_url
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="https://yourportfolio.com"
                                        required
                                    />

                                </div>

                                <Button
                                    disabled={
                                        isLoading
                                    }
                                    onClick={() =>
                                        handleFieldUpdate(
                                            "portfolio_url",
                                            formData.portfolio_url
                                        )
                                    }
                                >
                                    {
                                        isLoading
                                            ? "Updating..."
                                            : "Update"
                                    }
                                </Button>

                            </div>

                            {
                                formData.portfolio_url && (

                                    <a
                                        href={
                                            formData.portfolio_url.startsWith(
                                                "http"
                                            )
                                                ? formData.portfolio_url
                                                : `https://${formData.portfolio_url}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="
                            inline-block
                            mt-2

                            text-blue-500
                            hover:text-blue-400

                            underline
                            text-sm
                        "
                                    >
                                        Open Portfolio →
                                    </a>

                                )
                            }

                        </div>

                    </div>

                </Panel>

            </div >
        </>
    )
};

export default Profile;
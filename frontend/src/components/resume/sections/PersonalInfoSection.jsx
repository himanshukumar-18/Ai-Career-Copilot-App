import { motion } from "framer-motion";
import { Camera, Loader2, Upload } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { personalInfoSchema } from "../../../lib/validations/personalInfoSchema";

import { useResumeEditorSection } from "../editor/ResumeEditorContext";

import {
    fetchResumeProfileThunk,
    updateResumeProfileThunk,
    uploadResumePhotoThunk,
} from "../../../features/resumeProfile/resumeProfileThunk";

import {
    selectResumeProfile,
    selectResumeProfileError,
    selectResumeProfileLoading,
    selectResumeProfilePhotoUploading,
    selectResumeProfileSaving,
} from "../../../features/resumeProfile/resumeProfileSelectors";

const DEFAULT_VALUES = {
    first_name: "",
    last_name: "",
    headline: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
};

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

const getFormValues = (profile) => ({
    first_name: profile?.first_name ?? "",
    last_name: profile?.last_name ?? "",
    headline: profile?.headline ?? "",
    email: profile?.email ?? "",
    phone: profile?.phone ?? "",
    address: profile?.address ?? "",
    city: profile?.city ?? "",
    state: profile?.state ?? "",
    postal_code: profile?.postal_code ?? "",
    country: profile?.country ?? "",
});

const getProfilePhotoUrl = (profile) =>
    profile?.photo ||
    profile?.profile_photo ||
    profile?.image ||
    "";

const PersonalInfoSection = () => {
    const dispatch = useDispatch();
    const { resumeId } = useParams();
    const fileInputRef = useRef(null);

    const profile = useSelector(selectResumeProfile);
    const isLoading = useSelector(selectResumeProfileLoading);
    const isSaving = useSelector(selectResumeProfileSaving);
    const isUploadingPhoto = useSelector(
        selectResumeProfilePhotoUploading
    );
    const profileError = useSelector(selectResumeProfileError);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: DEFAULT_VALUES,
        mode: "onBlur",
    });

    const { registerSaveAction } = useResumeEditorSection();

    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const selectedPhotoPreview = useMemo(() => {
        if (!selectedPhoto) return "";

        return URL.createObjectURL(selectedPhoto);
    }, [selectedPhoto]);

    const displayedPhoto = selectedPhotoPreview || getProfilePhotoUrl(profile);

    useEffect(() => {
        return () => {
            if (selectedPhotoPreview) {
                URL.revokeObjectURL(selectedPhotoPreview);
            }
        };
    }, [selectedPhotoPreview]);

    useEffect(() => {
        if (!resumeId) return;

        dispatch(fetchResumeProfileThunk(resumeId));
    }, [dispatch, resumeId]);

    useEffect(() => {
        if (!profile) return;

        reset(getFormValues(profile));
    }, [profile, reset]);

    const saveProfile = useCallback(async (formData) => {
        if (!resumeId) {
            toast.error("Resume ID is missing.");
            return;
        }

        try {
            await dispatch(
                updateResumeProfileThunk({
                    resumeId,
                    data: formData,
                })
            ).unwrap();

            toast.success("Personal information saved.");
        } catch (error) {
            toast.error(
                error?.message ||
                error?.detail ||
                "Unable to save personal information."
            );
        }
    }, [dispatch, resumeId]);

    useEffect(() => {
        const unregister = registerSaveAction(
            "personal",
            handleSubmit(saveProfile)
        );

        return unregister;
    }, [handleSubmit, registerSaveAction, saveProfile]);

    const handlePhotoSelect = async (event) => {
        const file = event.target.files?.[0];

        event.target.value = "";

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please choose a valid image file.");
            return;
        }

        if (file.size > MAX_PHOTO_SIZE) {
            toast.error("Photo must be smaller than 5 MB.");
            return;
        }

        if (!resumeId) {
            toast.error("Resume ID is missing.");
            return;
        }

        setSelectedPhoto(file);

        try {
            await dispatch(
                uploadResumePhotoThunk({
                    resumeId,
                    photoFile: file,
                })
            ).unwrap();

            toast.success("Profile photo uploaded.");
            setSelectedPhoto(null);
        } catch (error) {
            toast.error(
                error?.message ||
                error?.detail ||
                "Unable to upload profile photo."
            );
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-100 items-center justify-center border border-zinc-800 bg-zinc-950">
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                    <Loader2 className="animate-spin" size={18} />
                    Loading personal information...
                </div>
            </div>
        );
    }

    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full"
        >
            <form onSubmit={handleSubmit(saveProfile)}>
                <div className="border border-zinc-800 bg-zinc-950">
                    <header className="flex flex-col gap-4 border-b border-zinc-800 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                                Resume section
                            </p>

                            <h2 className="mt-1 text-2xl font-semibold text-white">
                                Personal
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500">
                                How you appear at the top of your resume.
                            </p>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSaving || !isDirty}
                            className="h-10 min-w-28 text-xs"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2
                                        className="animate-spin"
                                        size={15}
                                    />
                                    Saving
                                </>
                            ) : (
                                "Save changes"
                            )}
                        </Button>
                    </header>

                    <div className="space-y-6 p-5 sm:p-6">
                        {profileError && (
                            <div className="border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-300">
                                {profileError}
                            </div>
                        )}

                        <section className="border border-zinc-800 p-5">
                            <SectionTitle
                                title="Profile photo"
                                description="Use a clear professional image. JPG, PNG, or WebP up to 5 MB."
                            />

                            <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    disabled={isUploadingPhoto}
                                    className="group relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-dashed border-zinc-700 bg-zinc-900 transition hover:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-60"
                                    aria-label="Choose profile photo"
                                >
                                    {displayedPhoto ? (
                                        <img
                                            src={displayedPhoto}
                                            alt="Profile"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <Camera
                                            size={25}
                                            className="text-zinc-500 transition group-hover:text-zinc-300"
                                        />
                                    )}

                                    {isUploadingPhoto && (
                                        <span className="absolute inset-0 flex items-center justify-center bg-black/70">
                                            <Loader2
                                                className="animate-spin text-white"
                                                size={20}
                                            />
                                        </span>
                                    )}
                                </button>

                                <div className="flex flex-col items-center gap-2 sm:items-start">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handlePhotoSelect}
                                        className="hidden"
                                    />

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        disabled={isUploadingPhoto}
                                        className="h-9 px-4 text-xs"
                                    >
                                        <Upload size={14} />
                                        {displayedPhoto
                                            ? "Change photo"
                                            : "Upload photo"}
                                    </Button>

                                    <p className="text-xs text-zinc-500">
                                        Optional, but recommended for a
                                        professional resume.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="border border-zinc-800 p-5">
                            <SectionTitle
                                title="Basic information"
                                description="Your name and professional role."
                            />

                            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field
                                    label="First name"
                                    htmlFor="first_name"
                                    error={errors.first_name}
                                >
                                    <Input
                                        id="first_name"
                                        placeholder="Himanshu"
                                        {...register("first_name")}
                                    />
                                </Field>

                                <Field
                                    label="Last name"
                                    htmlFor="last_name"
                                    error={errors.last_name}
                                >
                                    <Input
                                        id="last_name"
                                        placeholder="Kumar"
                                        {...register("last_name")}
                                    />
                                </Field>
                            </div>

                            <div className="mt-4">
                                <Field
                                    label="Professional headline"
                                    htmlFor="headline"
                                    error={errors.headline}
                                >
                                    <Input
                                        id="headline"
                                        placeholder="Full Stack Developer"
                                        {...register("headline")}
                                    />
                                </Field>
                            </div>
                        </section>

                        <section className="border border-zinc-800 p-5">
                            <SectionTitle
                                title="Contact"
                                description="Information recruiters can use to contact you."
                            />

                            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field
                                    label="Email"
                                    htmlFor="email"
                                    error={errors.email}
                                >
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        {...register("email")}
                                    />
                                </Field>

                                <Field
                                    label="Phone"
                                    htmlFor="phone"
                                    error={errors.phone}
                                >
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        {...register("phone")}
                                    />
                                </Field>
                            </div>
                        </section>

                        <section className="border border-zinc-800 p-5">
                            <SectionTitle
                                title="Location"
                                description="Your current location or preferred work location."
                            />

                            <div className="mt-5">
                                <Field
                                    label="Street address"
                                    htmlFor="address"
                                    error={errors.address}
                                >
                                    <Input
                                        id="address"
                                        placeholder="Street address"
                                        {...register("address")}
                                    />
                                </Field>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <Field
                                    label="City"
                                    htmlFor="city"
                                    error={errors.city}
                                >
                                    <Input
                                        id="city"
                                        placeholder="Delhi"
                                        {...register("city")}
                                    />
                                </Field>

                                <Field
                                    label="State"
                                    htmlFor="state"
                                    error={errors.state}
                                >
                                    <Input
                                        id="state"
                                        placeholder="Delhi"
                                        {...register("state")}
                                    />
                                </Field>

                                <Field
                                    label="Postal code"
                                    htmlFor="postal_code"
                                    error={errors.postal_code}
                                >
                                    <Input
                                        id="postal_code"
                                        placeholder="110001"
                                        {...register("postal_code")}
                                    />
                                </Field>
                            </div>

                            <div className="mt-4">
                                <Field
                                    label="Country"
                                    htmlFor="country"
                                    error={errors.country}
                                >
                                    <Input
                                        id="country"
                                        placeholder="India"
                                        {...register("country")}
                                    />
                                </Field>
                            </div>
                        </section>
                    </div>
                </div>
            </form>
        </motion.section>
    );
};

const SectionTitle = ({ title, description }) => (
    <div>
        <h3 className="text-sm font-medium text-white">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-zinc-500">{description}</p>
    </div>
);

const Field = ({ label, htmlFor, error, children }) => (
    <div>
        <label
            htmlFor={htmlFor}
            className="mb-2 block text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500"
        >
            {label}
        </label>

        {children}

        {error?.message && (
            <p className="mt-1.5 text-xs text-red-400">{error.message}</p>
        )}
    </div>
);

export default PersonalInfoSection;

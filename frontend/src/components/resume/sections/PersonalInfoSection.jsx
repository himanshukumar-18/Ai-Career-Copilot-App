import { motion } from "framer-motion";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Camera,
    Mail,
    Phone,
    MapPin,
    Globe,
    Github,
    Linkedin,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "../../ui/Button"
import { Input } from "../../ui/Input"
import { personalInfoSchema } from "../../../lib/validations/personalInfoSchema";

import {
    getResumeProfileThunk,
    updateResumeProfileThunk,
} from "../../../features/resumeProfile/resumeProfileThunk";
import { resetSaveStatus } from "../../../features/resumeProfile/resumeProfileSlice";
import {
    selectResumeProfile,
    selectIsProfileLoading,
    selectIsSaving,
    selectSaveSucceeded,
    selectSaveFailed,
    selectProfileError,
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
    website: "",
    portfolio: "",
    linkedin: "",
    github: "",
};

/** Maps a profile API response onto the form's known field shape. */
const toFormValues = (profile) => ({
    first_name: profile.first_name || "",
    last_name: profile.last_name || "",
    headline: profile.headline || "",
    email: profile.email || "",
    phone: profile.phone || "",
    address: profile.address || "",
    city: profile.city || "",
    state: profile.state || "",
    postal_code: profile.postal_code || "",
    country: profile.country || "",
    website: profile.website || "",
    portfolio: profile.portfolio || "",
    linkedin: profile.linkedin || "",
    github: profile.github || "",
});

const PersonalInfoSection = () => {
    const dispatch = useDispatch();
    const { resumeId } = useParams();

    const profile = useSelector(selectResumeProfile);
    const isLoading = useSelector(selectIsProfileLoading);
    const isSaving = useSelector(selectIsSaving);
    const saveSucceeded = useSelector(selectSaveSucceeded);
    const saveFailed = useSelector(selectSaveFailed);
    const errorMessage = useSelector(selectProfileError);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: DEFAULT_VALUES,
    });

    // Fetch profile on mount / resumeId change.
    useEffect(() => {
        if (resumeId) {
            dispatch(getResumeProfileThunk(resumeId));
        }
    }, [dispatch, resumeId]);

    // Sync fetched profile into the form once available.
    useEffect(() => {
        if (profile) {
            reset(toFormValues(profile));
        }
    }, [profile, reset]);

    // Surface save result as a toast, then clear the transient status.
    useEffect(() => {
        if (saveSucceeded) {
            toast.success("Profile updated successfully.");
            dispatch(resetSaveStatus());
        }
        if (saveFailed) {
            toast.error(errorMessage || "Unable to update profile.");
            dispatch(resetSaveStatus());
        }
    }, [saveSucceeded, saveFailed, errorMessage, dispatch]);

    const onSubmit = async (data) => {
        try {
            await dispatch(
                updateResumeProfileThunk({ resumeId, profileData: data })
            ).unwrap();
            // Success toast is handled by the effect above once saveSucceeded flips.
        } catch {
            // Error toast is handled by the effect above once saveFailed flips.
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24 text-zinc-400">
                Loading profile...
            </div>
        );
    }

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 shadow-xl">
                    {/* Header */}
                    <div className="border-b border-zinc-800 px-8 py-6">
                        <h2 className="text-2xl font-bold text-white">
                            Personal Information
                        </h2>
                        <p className="mt-2 text-sm text-zinc-400">
                            Complete your personal profile used across your resume.
                        </p>
                    </div>

                    {/* Body */}
                    <div className="space-y-10 p-8">
                        {/* Profile Photo */}
                        <div className="flex flex-col items-center">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex h-36 w-36 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-zinc-700 bg-zinc-900 transition hover:border-red-500"
                            >
                                <Camera className="text-zinc-500" size={34} />
                            </motion.div>
                            <Button type="button" variant="outline" className="mt-5">
                                Upload Photo
                            </Button>
                        </div>

                        {/* Name */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <Field label="First Name" error={errors.first_name}>
                                <Input
                                    id="first_name"
                                    placeholder="John"
                                    {...register("first_name")}
                                />
                            </Field>

                            <Field label="Last Name" error={errors.last_name}>
                                <Input
                                    id="last_name"
                                    placeholder="Doe"
                                    {...register("last_name")}
                                />
                            </Field>
                        </div>

                        <Field label="Professional Headline" error={errors.headline}>
                            <Input
                                id="headline"
                                placeholder="Full Stack Developer"
                                {...register("headline")}
                            />
                        </Field>

                        {/* Contact */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <Field label="Email" error={errors.email}>
                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="absolute left-3 top-3.5 text-zinc-500"
                                    />
                                    <Input
                                        id="email"
                                        className="pl-10"
                                        placeholder="john@example.com"
                                        {...register("email")}
                                    />
                                </div>
                            </Field>

                            <Field label="Phone" error={errors.phone}>
                                <div className="relative">
                                    <Phone
                                        size={18}
                                        className="absolute left-3 top-3.5 text-zinc-500"
                                    />
                                    <Input
                                        id="phone"
                                        className="pl-10"
                                        placeholder="+91 9876543210"
                                        {...register("phone")}
                                    />
                                </div>
                            </Field>
                        </div>

                        {/* Address */}
                        <Field label="Address" error={errors.address}>
                            <div className="relative">
                                <MapPin
                                    size={18}
                                    className="absolute left-3 top-3.5 text-zinc-500"
                                />
                                <Input
                                    id="address"
                                    className="pl-10"
                                    placeholder="Street Address"
                                    {...register("address")}
                                />
                            </div>
                        </Field>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <Field label="City" error={errors.city}>
                                <Input id="city" placeholder="Delhi" {...register("city")} />
                            </Field>

                            <Field label="State" error={errors.state}>
                                <Input id="state" placeholder="Delhi" {...register("state")} />
                            </Field>

                            <Field label="Postal Code" error={errors.postal_code}>
                                <Input
                                    id="postal_code"
                                    placeholder="110001"
                                    {...register("postal_code")}
                                />
                            </Field>
                        </div>

                        <Field label="Country" error={errors.country}>
                            <Input id="country" placeholder="India" {...register("country")} />
                        </Field>

                        {/* Online Presence */}
                        <div className="space-y-6">
                            <Field label="Website" error={errors.website}>
                                <div className="relative">
                                    <Globe
                                        size={18}
                                        className="absolute left-3 top-3.5 text-zinc-500"
                                    />
                                    <Input
                                        id="website"
                                        className="pl-10"
                                        placeholder="Website"
                                        {...register("website")}
                                    />
                                </div>
                            </Field>

                            <Field label="Portfolio" error={errors.portfolio}>
                                <div className="relative">
                                    <Globe
                                        size={18}
                                        className="absolute left-3 top-3.5 text-zinc-500"
                                    />
                                    <Input
                                        id="portfolio"
                                        className="pl-10"
                                        placeholder="Portfolio"
                                        {...register("portfolio")}
                                    />
                                </div>
                            </Field>

                            <Field label="LinkedIn" error={errors.linkedin}>
                                <div className="relative">
                                    <Linkedin
                                        size={18}
                                        className="absolute left-3 top-3.5 text-blue-500"
                                    />
                                    <Input
                                        id="linkedin"
                                        className="pl-10"
                                        placeholder="LinkedIn URL"
                                        {...register("linkedin")}
                                    />
                                </div>
                            </Field>

                            <Field label="GitHub" error={errors.github}>
                                <div className="relative">
                                    <Github
                                        size={18}
                                        className="absolute left-3 top-3.5 text-zinc-400"
                                    />
                                    <Input
                                        id="github"
                                        className="pl-10"
                                        placeholder="GitHub URL"
                                        {...register("github")}
                                    />
                                </div>
                            </Field>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end border-t border-zinc-800 px-8 py-6">
                        <motion.div whileTap={{ scale: 0.98 }}>
                            <Button type="submit" disabled={isSaving || !isDirty}>
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </form>
        </motion.section>
    );
};

/** Small layout helper: pairs a label, its input, and a validation message. */
const Field = ({ label, error, children }) => (
    <div>
        <label
            htmlFor={children.props.id}
            className="mb-1.5 block text-sm font-medium text-zinc-300"
        >
            {label}
        </label>
        {children}
        {error && (
            <p className="mt-1 text-sm text-red-500">{error.message}</p>
        )}
    </div>
);

export default PersonalInfoSection;
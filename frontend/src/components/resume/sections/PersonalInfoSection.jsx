import { motion } from "framer-motion";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useResumeEditorSection } from "../editor/ResumeEditorContext";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    //Camera,
    //Mail,
    //Phone,
    //MapPin,
    //Globe,
    //Github,
    //Linkedin,
} from "lucide-react";
import { toast } from "sonner";

import Button from "../../ui/Button";
import Input from "../../ui/Input";
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

    const { registerSaveAction } = useResumeEditorSection();

    const onSubmit = async (data) => {
        try {
            await dispatch(
                updateResumeProfileThunk({ resumeId, profileData: data })
            ).unwrap();
        } catch {
            // Error toast is handled by the effect below once saveFailed flips.
        }
    };

    useEffect(() => {
        const unregister = registerSaveAction("personal", handleSubmit(onSubmit));
        return unregister;
    }, [handleSubmit, onSubmit, registerSaveAction]);

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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24 text-sm text-zinc-500">
                Loading profile...
            </div>
        );
    }

    return (
        <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="border border-zinc-800 bg-zinc-950">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4 sm:px-6">
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Personal
                            </h2>
                            <p className="mt-1 text-xs text-zinc-500">
                                Your basic details, shown at the top of your resume.
                            </p>
                        </div>

                        <motion.div whileTap={{ scale: 0.97 }}>
                            <Button
                                type="submit"
                                disabled={isSaving || !isDirty}
                                className="h-9 px-4 text-xs"
                            >
                                {isSaving ? "Saving..." : "Save"}
                            </Button>
                        </motion.div>
                    </div>

                    {/* Body */}
                    <div className="space-y-5 p-5 sm:p-6">
                        {/* Profile photo */}
                        <div className="flex flex-col items-center gap-3 border border-zinc-800 bg-zinc-900/40 p-5">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-zinc-700 bg-zinc-900 transition hover:border-red-500"
                            >
                                {/* <Camera className="text-zinc-500" size={28} /> */}
                            </motion.div>
                            <Button type="button" variant="outline" className="h-9 px-4 text-xs">
                                Upload photo
                            </Button>
                        </div>

                        {/* Name + headline */}
                        <div className="border border-zinc-800 bg-zinc-900/40 p-5">
                            <p className="mb-4 text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                                Basic info
                            </p>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label="First name" htmlFor="first_name" error={errors.first_name}>
                                    <Input
                                        id="first_name"
                                        placeholder="John"
                                        {...register("first_name")}
                                    />
                                </Field>

                                <Field label="Last name" htmlFor="last_name" error={errors.last_name}>
                                    <Input
                                        id="last_name"
                                        placeholder="Doe"
                                        {...register("last_name")}
                                    />
                                </Field>
                            </div>

                            <div className="mt-4">
                                <Field label="Professional headline" htmlFor="headline" error={errors.headline}>
                                    <Input
                                        id="headline"
                                        placeholder="Full Stack Developer"
                                        {...register("headline")}
                                    />
                                </Field>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="border border-zinc-800 bg-zinc-900/40 p-5">
                            <p className="mb-4 text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                                Contact
                            </p>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label="Email" htmlFor="email" error={errors.email}>
                                    <div className="relative">
                                        {/* <Mail
                                            size={16}
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                                        /> */}
                                        <Input
                                            id="email"
                                            className="pl-9"
                                            placeholder="john@example.com"
                                            {...register("email")}
                                        />
                                    </div>
                                </Field>

                                <Field label="Phone" htmlFor="phone" error={errors.phone}>
                                    <div className="relative">
                                        {/* <Phone
                                            size={16}
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                                        /> */}
                                        <Input
                                            id="phone"
                                            className="pl-9"
                                            placeholder="+91 9876543210"
                                            {...register("phone")}
                                        />
                                    </div>
                                </Field>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="border border-zinc-800 bg-zinc-900/40 p-5">
                            <p className="mb-4 text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                                Address
                            </p>

                            <Field label="Street address" htmlFor="address" error={errors.address}>
                                <div className="relative">
                                    {/* <MapPin
                                        size={16}
                                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                                    /> */}
                                    <Input
                                        id="address"
                                        className="pl-9"
                                        placeholder="Street address"
                                        {...register("address")}
                                    />
                                </div>
                            </Field>

                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <Field label="City" htmlFor="city" error={errors.city}>
                                    <Input id="city" placeholder="Delhi" {...register("city")} />
                                </Field>

                                <Field label="State" htmlFor="state" error={errors.state}>
                                    <Input id="state" placeholder="Delhi" {...register("state")} />
                                </Field>

                                <Field label="Postal code" htmlFor="postal_code" error={errors.postal_code}>
                                    <Input
                                        id="postal_code"
                                        placeholder="110001"
                                        {...register("postal_code")}
                                    />
                                </Field>
                            </div>

                            <div className="mt-4">
                                <Field label="Country" htmlFor="country" error={errors.country}>
                                    <Input id="country" placeholder="India" {...register("country")} />
                                </Field>
                            </div>
                        </div>

                        {/* Online presence */}
                        <div className="border border-zinc-800 bg-zinc-900/40 p-5">
                            <p className="mb-4 text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                                Online presence
                            </p>

                            <div className="space-y-4">
                                <Field label="Website" htmlFor="website" error={errors.website}>
                                    <div className="relative">
                                        {/* <Globe
                                            size={16}
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                                        /> */}
                                        <Input
                                            id="website"
                                            className="pl-9"
                                            placeholder="yourwebsite.com"
                                            {...register("website")}
                                        />
                                    </div>
                                </Field>

                                <Field label="Portfolio" htmlFor="portfolio" error={errors.portfolio}>
                                    <div className="relative">
                                        {/* <Globe
                                            size={16}
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                                        /> */}
                                        <Input
                                            id="portfolio"
                                            className="pl-9"
                                            placeholder="yourportfolio.com"
                                            {...register("portfolio")}
                                        />
                                    </div>
                                </Field>

                                <Field label="LinkedIn" htmlFor="linkedin" error={errors.linkedin}>
                                    <div className="relative">
                                        {/* <Linkedin
                                            size={16}
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-500"
                                        /> */}
                                        <Input
                                            id="linkedin"
                                            className="pl-9"
                                            placeholder="linkedin.com/in/you"
                                            {...register("linkedin")}
                                        />
                                    </div>
                                </Field>

                                <Field label="GitHub" htmlFor="github" error={errors.github}>
                                    <div className="relative">
                                        {/* <Github
                                            size={16}
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                                        /> */}
                                        <Input
                                            id="github"
                                            className="pl-9"
                                            placeholder="github.com/you"
                                            {...register("github")}
                                        />
                                    </div>
                                </Field>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </motion.section>
    );
};

/** Small layout helper: pairs a label, its input, and a validation message. */
const Field = ({ label, htmlFor, error, children }) => (
    <div>
        <label
            htmlFor={htmlFor}
            className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-500"
        >
            {label}
        </label>
        {children}
        {error && (
            <p className="mt-1 text-xs text-red-500">{error.message}</p>
        )}
    </div>
);

export default PersonalInfoSection;
import { useCallback, useEffect } from "react";
import { motion } from "framer-motion";
// import { Globe, Linkedin, GitHub, Link } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useResumeEditorSection } from "../editor/ResumeEditorContext";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Label from "../../ui/Label";

import { socialLinksFormSchema } from "../../../lib/validations/socialLinksSchema";
import {
    getSocialLinksThunk,
    updateSocialLinksThunk,
} from "../../../features/socialLinks/socialLinksThunk";
import {
    selectIsSocialLinksLoading,
    selectIsSocialLinksSaving,
    selectSocialLinks,
    selectSocialLinksError,
} from "../../../features/socialLinks/socialLinksSelectors";

const DEFAULT_LINKS = {
    website: "",
    portfolio: "",
    linkedin: "",
    github: "",
};

const toFormValues = (links = []) => {
    const find = (platform) => links.find((link) => link.platform === platform);
    const website = links.find(
        (link) => link.platform === "other" && link.custom_platform?.toLowerCase() === "website"
    );

    return {
        website: website?.url ?? "",
        portfolio: find("portfolio")?.url ?? "",
        linkedin: find("linkedin")?.url ?? "",
        github: find("github")?.url ?? "",
    };
};

const SocialLinksSection = () => {
    const dispatch = useDispatch();
    const { resumeId } = useParams();
    const links = useSelector(selectSocialLinks);
    const isLoading = useSelector(selectIsSocialLinksLoading);
    const isSaving = useSelector(selectIsSocialLinksSaving);
    const apiError = useSelector(selectSocialLinksError);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm({
        resolver: zodResolver(socialLinksFormSchema),
        defaultValues: DEFAULT_LINKS,
    });

    const { registerSaveAction } = useResumeEditorSection();

    const onSubmit = useCallback(async (formData) => {
        const managed = [
            ["website", "other", "Website"],
            ["portfolio", "portfolio", ""],
            ["linkedin", "linkedin", ""],
            ["github", "github", ""],
        ];
        const isWebsite = (link) =>
            link.platform === "other" && link.custom_platform?.toLowerCase() === "website";
        const findExisting = (platform) => links.find(
            (link) => platform === "other" ? isWebsite(link) : link.platform === platform
        );
        const unchanged = links.filter(
            (link) => !["portfolio", "linkedin", "github"].includes(link.platform) && !isWebsite(link)
        );
        const updates = managed.flatMap(([field, platform, custom_platform]) => {
            const existing = findExisting(platform);
            const url = formData[field]?.trim();
            return url
                ? [{ id: existing?.id, platform, custom_platform, url }]
                : [];
        });

        try {
            await dispatch(updateSocialLinksThunk({
                resumeId,
                links: [...updates, ...unchanged],
            })).unwrap();
            toast.success("Social links updated successfully.");
        } catch (error) {
            toast.error(error?.message || error?.detail || "Unable to save social links.");
        }
    }, [dispatch, links, resumeId]);

    useEffect(() => {
        if (resumeId) dispatch(getSocialLinksThunk(resumeId));
    }, [dispatch, resumeId]);

    useEffect(() => {
        reset(toFormValues(links));
    }, [links, reset]);

    useEffect(() => {
        const unregister = registerSaveAction("social", handleSubmit(onSubmit));
        return unregister;
    }, [handleSubmit, onSubmit, registerSaveAction]);

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="border border-zinc-800 bg-zinc-950 shadow-xl">
                    <div className="border-b border-zinc-800 px-8 py-6">
                        <div className="flex items-center gap-3">
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                                    Resume section
                                </p>
                                <h2 className="text-2xl mt-1 font-bold text-white">Social Links</h2>
                                <p className="mt-1 text-sm text-zinc-400">
                                    Add your professional profile links for recruiters.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 p-8">
                        <Field label="Website" error={errors.website}>
                            <div className="relative">
                                {/* <Link size={18} className="absolute left-3 top-3 text-zinc-500" /> */}
                                <Input
                                    id="website"
                                    className="pl-10"
                                    placeholder="https://yourwebsite.com"
                                    {...register("website")}
                                />
                            </div>
                        </Field>

                        <Field label="Portfolio" error={errors.portfolio}>
                            <div className="relative">
                                {/* <Globe size={18} className="absolute left-3 top-3 text-zinc-500" /> */}
                                <Input
                                    id="portfolio"
                                    className="pl-10"
                                    placeholder="https://portfolio.example.com"
                                    {...register("portfolio")}
                                />
                            </div>
                        </Field>

                        <Field label="LinkedIn" error={errors.linkedin}>
                            <div className="relative">
                                {/* <Linkedin size={18} className="absolute left-3 top-3 text-blue-500" /> */}
                                <Input
                                    id="linkedin"
                                    className="pl-10"
                                    placeholder="https://linkedin.com/in/username"
                                    {...register("linkedin")}
                                />
                            </div>
                        </Field>

                        <Field label="GitHub" error={errors.github}>
                            <div className="relative">
                                {/* <GitHub size={18} className="absolute left-3 top-3 text-zinc-400" /> */}
                                <Input
                                    id="github"
                                    className="pl-10"
                                    placeholder="https://github.com/username"
                                    {...register("github")}
                                />
                            </div>
                        </Field>
                    </div>

                    <div className="flex justify-end border-t border-zinc-800 px-8 py-6">
                        <motion.div whileTap={{ scale: 0.98 }}>
                            <Button type="submit" disabled={isLoading || isSaving || !isDirty}>
                                {isLoading || isSaving ? "Saving..." : "Save Links"}
                            </Button>
                        </motion.div>
                    </div>
                    {apiError && (
                        <p className="px-8 pb-6 text-sm text-red-400">
                            {apiError}
                        </p>
                    )}
                </div>
            </form>
        </motion.section>
    );
};

const Field = ({ label, error, children }) => (
    <div>
        <Label>{label}</Label>
        {children}
        {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
);

export default SocialLinksSection;

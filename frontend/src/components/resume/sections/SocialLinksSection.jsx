import { useEffect } from "react";
import { motion } from "framer-motion";
// import { Globe, Linkedin, GitHub, Link } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useResumeEditorSection } from "../editor/ResumeEditorContext";

import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Label from "../../ui/Label";

import { socialLinksFormSchema } from "../../../lib/validations/socialLinksSchema";

const DEFAULT_LINKS = {
    website: "",
    portfolio: "",
    linkedin: "",
    github: "",
};

const toFormValues = (resume) => ({
    website: resume?.website ?? "",
    portfolio: resume?.portfolio ?? "",
    linkedin: resume?.linkedin ?? "",
    github: resume?.github ?? "",
});

const SocialLinksSection = ({ resume }) => {
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

    const onSubmit = () => {
        toast.success("Social links updated successfully.");
    };

    useEffect(() => {
        reset(toFormValues(resume ?? {}));
    }, [resume, reset]);

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
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 shadow-xl">
                    <div className="border-b border-zinc-800 px-8 py-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10">
                                {/* <Globe className="text-sky-400" size={24} /> */}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Social Links</h2>
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
                            <Button type="submit" disabled={!isDirty}>
                                Save Links
                            </Button>
                        </motion.div>
                    </div>
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

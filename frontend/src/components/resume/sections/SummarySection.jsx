import { useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useResumeEditorSection } from "../editor/ResumeEditorContext";

import Button from "../../ui/Button";
import Label from "../../ui/Label";
import Textarea from "../../ui/Textarea";

import { summaryFormSchema } from "../../../lib/validations/summarySchema";

const SummarySection = ({ resume }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm({
        resolver: zodResolver(summaryFormSchema),
        defaultValues: { summary: "" },
    });

    const { registerSaveAction } = useResumeEditorSection();

    const onSubmit = useCallback(() => {
        // TODO: this only shows a success message right now — it doesn't
        // actually send the summary anywhere. Wire this up to your save
        // thunk/API call the same way PersonalInfoSection does, otherwise
        // the user's summary is never really saved.
        toast.success("Summary saved successfully.");
    }, []);

    useEffect(() => {
        reset({ summary: resume?.summary ?? "" });
    }, [resume, reset]);

    useEffect(() => {
        const unregister = registerSaveAction("summary", handleSubmit(onSubmit));
        return unregister;
    }, [handleSubmit, onSubmit, registerSaveAction]);

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
                        <div className="flex items-center gap-3">
                            <BookOpen className="text-zinc-500" size={18} aria-hidden="true" />
                            <div>
                                <h2 className="text-lg font-semibold text-white">Summary</h2>
                                <p className="mt-1 text-xs text-zinc-500">
                                    A short, strong summary that highlights your strengths.
                                </p>
                            </div>
                        </div>

                        <motion.div whileTap={{ scale: 0.97 }}>
                            <Button
                                type="submit"
                                disabled={!isDirty}
                                className="h-9 px-4 text-xs"
                            >
                                <Save size={14} />
                                Save
                            </Button>
                        </motion.div>
                    </div>

                    {/* Body */}
                    <div className="p-5 sm:p-6">
                        <div className="border border-zinc-800 bg-zinc-900/40 p-5">
                            <Label
                                htmlFor="summary"
                                className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-500"
                            >
                                Professional summary
                            </Label>

                            <Textarea
                                id="summary"
                                rows={8}
                                placeholder="Write a strong summary that explains your value, experience, and goals."
                                {...register("summary")}
                            />

                            {errors.summary && (
                                <p className="mt-2 text-xs text-red-500">
                                    {errors.summary.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </motion.section>
    );
};

export default SummarySection;
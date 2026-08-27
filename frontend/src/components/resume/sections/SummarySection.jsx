import { useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Save } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import Button from "../../ui/Button";
import Label from "../../ui/Label";
import Textarea from "../../ui/Textarea";

import { summaryFormSchema } from "../../../lib/validations/summarySchema";
import { useResumeEditorSection } from "../editor/ResumeEditorContext";

import {
    fetchResumeSummaryThunk,
    updateResumeSummaryThunk,
} from "../../../features/summary/summaryThunk";

import {
    selectResumeSummary,
    selectResumeSummaryError,
    selectResumeSummaryLoading,
    selectResumeSummarySaving,
} from "../../../features/summary/summarySelectors";

const DEFAULT_VALUES = {
    content: "",
};

const getFormValues = (summary) => ({
    content: typeof summary === "string" ? summary : summary?.content ?? "",
});

const getErrorMessage = (error, fallbackMessage) => {
    if (typeof error === "string") return error;

    if (Array.isArray(error?.content)) {
        return error.content[0];
    }

    return error?.message || error?.detail || fallbackMessage;
};

const SummarySection = () => {
    const dispatch = useDispatch();
    const { resumeId } = useParams();
    const { registerSaveAction } = useResumeEditorSection();

    const summary = useSelector(selectResumeSummary);
    const isLoading = useSelector(selectResumeSummaryLoading);
    const isSaving = useSelector(selectResumeSummarySaving);
    const apiError = useSelector(selectResumeSummaryError);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isDirty },
    } = useForm({
        resolver: zodResolver(summaryFormSchema),
        defaultValues: DEFAULT_VALUES,
        mode: "onBlur",
    });

    const content = watch("content") || "";
    const characterCount = content.length;

    useEffect(() => {
        if (!resumeId) return;

        dispatch(fetchResumeSummaryThunk(resumeId));
    }, [dispatch, resumeId]);

    useEffect(() => {
        if (!summary) return;

        reset(getFormValues(summary));
    }, [summary, reset]);

    const onSubmit = useCallback(
        async (formData) => {
            if (!resumeId) {
                toast.error("Resume ID is missing.");
                return;
            }

            try {
                await dispatch(
                    updateResumeSummaryThunk({
                        resumeId,
                        content: formData.content.trim(),
                    })
                ).unwrap();

                toast.success("Professional summary saved.");
            } catch (error) {
                toast.error(
                    getErrorMessage(
                        error,
                        "Unable to save professional summary."
                    )
                );
            }
        },
        [dispatch, resumeId]
    );

    useEffect(() => {
        const unregister = registerSaveAction(
            "summary",
            handleSubmit(onSubmit)
        );

        return unregister;
    }, [handleSubmit, onSubmit, registerSaveAction]);

    if (isLoading) {
        return (
            <div className="flex min-h-[360px] items-center justify-center border border-zinc-800 bg-zinc-950">
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                    <Loader2 className="animate-spin" size={18} />
                    Loading summary...
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
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="border border-zinc-800 bg-zinc-950">
                    <header className="flex flex-col gap-4 border-b border-zinc-800 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div className="flex items-start gap-3">
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                                    Resume section
                                </p>

                                <h2 className="mt-1 text-xl font-semibold text-white">
                                    Professional summary
                                </h2>

                                <p className="mt-1 text-sm text-zinc-500">
                                    Explain your strengths, relevant experience,
                                    and the value you bring.
                                </p>
                            </div>
                        </div>

                        <motion.div whileTap={{ scale: 0.97 }}>
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
                                    <>
                                        <Save size={15} />
                                        Save changes
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    </header>

                    <div className="p-5 sm:p-6">
                        {apiError && (
                            <div
                                role="alert"
                                className="mb-5 border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-300"
                            >
                                {getErrorMessage(
                                    apiError,
                                    "Unable to load summary."
                                )}
                            </div>
                        )}

                        <div className="border border-zinc-800 bg-zinc-900/30 p-4 sm:p-5">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <Label
                                        htmlFor="content"
                                        className="block text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500"
                                    >
                                        Professional summary
                                    </Label>

                                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                                        Keep it concise, specific, and tailored
                                        to the roles you want.
                                    </p>
                                </div>

                                <span className="shrink-0 text-xs tabular-nums text-zinc-500">
                                    {characterCount}/2000
                                </span>
                            </div>

                            <Textarea
                                id="content"
                                rows={10}
                                maxLength={2000}
                                placeholder="Example: Full Stack Developer with experience building responsive web applications using React, Node.js, Django, and PostgreSQL. Focused on creating reliable products with clean user experiences and scalable backend APIs."
                                aria-invalid={Boolean(errors.content)}
                                className="mt-4 min-h-55 resize-y"
                                {...register("content")}
                            />

                            {errors.content?.message && (
                                <p className="mt-2 text-xs text-red-400">
                                    {errors.content.message}
                                </p>
                            )}
                        </div>

                        <div className="mt-5 border-l border-zinc-700 pl-4">
                            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                                Writing tip
                            </p>
                            <p className="mt-1 text-xs leading-5 text-zinc-500">
                                Mention your role, strongest skills, measurable
                                work, and the type of opportunity you are
                                targeting.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </motion.section>
    );
};

export default SummarySection;
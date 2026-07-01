import { useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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

    useEffect(() => {
        reset({ summary: resume?.summary ?? "" });
    }, [resume, reset]);

    const onSubmit = () => {
        toast.success("Summary saved successfully.");
    };

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
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
                                <BookOpen className="text-violet-400" size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Summary</h2>
                                <p className="mt-1 text-sm text-zinc-400">
                                    Craft a concise summary that highlights your strengths.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 p-8">
                        <div>
                            <Label htmlFor="summary">Professional Summary</Label>
                            <Textarea
                                id="summary"
                                rows={8}
                                placeholder="Write a strong executive summary that explains your value, experience, and goals."
                                {...register("summary")}
                            />
                            {errors.summary && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.summary.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end border-t border-zinc-800 px-8 py-6">
                        <motion.div whileTap={{ scale: 0.98 }}>
                            <Button type="submit" disabled={!isDirty}>
                                <Save size={16} />
                                Save Summary
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </form>
        </motion.section>
    );
};

export default SummarySection;

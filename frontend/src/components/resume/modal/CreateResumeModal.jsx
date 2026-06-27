import { motion } from "framer-motion";
import { FilePlus2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { createResume } from "../../../features/resume/resumeThunk";
import { createResumeSchema } from "../../../lib/validations/resumeSchema";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "../../ui/dialog";
import Button from "../../ui/Button";
import {
    selectResumeLoading,
    selectResumeError,
} from "../../../features/resume/resumeSelectors";

const CreateResumeModal = ({ open, onOpenChange }) => {
    const dispatch = useDispatch();
    const loading = useSelector(selectResumeLoading);
    const error = useSelector(selectResumeError);

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createResumeSchema),
        defaultValues: {
            title: "",
            template: "Modern",
        },
    });

    const onSubmit = async (values) => {
        const result = await dispatch(createResume(values));

        if (createResume.fulfilled.match(result)) {
            toast.success(
                result.payload?.message ?? "Resume created successfully."
            );
            reset();
            onOpenChange(false);
            return;
        }

        toast.error(
            result.payload?.message ?? "Failed to create resume."
        );
    };

    const handleClose = () => {
        if (loading) return;
        reset();
        onOpenChange(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!loading) onOpenChange(value);
            }}
        >
            <DialogContent
                className="
                    w-[95vw]
                    max-w-xl
                    border-zinc-800
                    bg-zinc-950
                    p-0
                    text-white
                    shadow-none
                "
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    {/* ✅ form is now INSIDE DialogContent, wrapping header + body + footer */}
                    <form onSubmit={handleSubmit(onSubmit)}>

                        {/* Header */}
                        <DialogHeader className="border-b border-zinc-800 p-6">
                            <div className="flex items-center gap-4">
                                <div
                                    className="
                                        flex h-12 w-12 items-center justify-center
                                        border border-zinc-800 bg-zinc-900
                                    "
                                >
                                    <FilePlus2 className="text-red-500" size={22} />
                                </div>

                                <div>
                                    <DialogTitle className="text-2xl font-bold">
                                        Create Resume
                                    </DialogTitle>
                                    <DialogDescription className="mt-1 text-zinc-400">
                                        Create a new professional ATS-friendly resume.
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        {/* Body */}
                        <div className="space-y-6 p-6">

                            {/* Error banner */}
                            {error && (
                                <div className="border border-red-900 bg-red-950/30 px-4 py-3">
                                    <p className="text-sm text-red-400">{error}</p>
                                </div>
                            )}

                            {/* Resume Title */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">
                                    Resume Title
                                </label>
                                <input
                                    {...register("title")}
                                    disabled={loading}
                                    placeholder="e.g. Full Stack Developer Resume"
                                    className="
                                        w-full mt-1 border border-zinc-800 bg-zinc-900
                                        px-4 py-3 outline-none transition
                                        placeholder:text-zinc-600 focus:border-red-500
                                    "
                                />
                                {errors.title && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>

                            {/* Template */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">
                                    Resume Template
                                </label>
                                <select
                                    {...register("template")}
                                    disabled={loading}
                                    className="
                                        w-full mt-1 border border-zinc-800 bg-zinc-900
                                        px-4 py-3 outline-none transition focus:border-red-500
                                    "
                                >
                                    <option value="classic">Classic</option>
                                    <option value="modern">Modern</option>
                                    <option value="minimal">Minimal</option>
                                    <option value="developer">Developer</option>
                                </select>
                                {errors.template && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.template.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div
                            className="
                                flex flex-col-reverse gap-3 border-t border-zinc-800 p-6
                                sm:flex-row sm:justify-end
                            "
                        >
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="min-w-[170px]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <FilePlus2 size={18} className="mr-2" />
                                        Create Resume
                                    </>
                                )}
                            </Button>
                        </div>

                    </form>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateResumeModal;
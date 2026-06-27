import { motion } from "framer-motion";
import { PencilLine, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Button from "@/components/ui/Button";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createResumeSchema } from "@/lib/validations/resumeSchema";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { updateResume } from "@/features/resume/resumeThunk";
import {
    selectResumeLoading,
    selectResumeError,
} from "@/features/resume/resumeSelectors";

const EditResumeModal = ({
    open,
    onOpenChange,
    resume,
}) => {

    const dispatch = useDispatch();

    const loading = useSelector(selectResumeLoading);
    const apiError = useSelector(selectResumeError);
    const titleInputRef = useRef(null);

    const {
        register,
        handleSubmit,
        reset,
        clearErrors,
        setError,
        watch,
        formState: {
            errors,
        },
    } = useForm({
        resolver: zodResolver(createResumeSchema),

        defaultValues: {
            title: "",
            template: "Modern",
        },
    });

    const onSubmit = async (values) => {
        if (!resume?.id) return;

        const result = await dispatch(
            updateResume({
                id: resume.id,
                data: values,
            })
        );

        if (updateResume.fulfilled.match(result)) {
            toast.success(
                result.payload?.message ??
                "Resume updated successfully."
            );

            handleClose();

            return;
        }

        /**
         * Backend Validation Errors
         */

        if (result.payload?.errors) {
            Object.entries(result.payload.errors).forEach(
                ([field, messages]) => {
                    setError(field, {
                        type: "server",
                        message: messages[0],
                    });
                }
            );
        }

        toast.error(
            result.payload?.message ??
            "Unable to update resume."
        );
    };

    useEffect(() => {
        if (!resume) return;

        reset({
            title: resume.title ?? "",
            template: resume.template ?? "Modern",
        });
    }, [resume, reset]);

    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                titleInputRef.current?.focus();
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [open]);

    const handleKeyDown = (event) => {
        if (
            (event.ctrlKey || event.metaKey) &&
            event.key === "Enter"
        ) {
            event.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    const handleClose = () => {
        if (loading) return;

        clearErrors();

        reset({
            title: "",
            template: "Modern",
        });

        onOpenChange(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (loading) return;

                if (!value) {
                    handleClose();
                } else {
                    onOpenChange(value);
                }
            }}
        >
            <DialogContent
                onEscapeKeyDown={(event) => {
                    if (loading) {
                        event.preventDefault();
                    }
                }}
                onPointerDownOutside={(event) => {
                    if (loading) {
                        event.preventDefault();
                    }
                }}
                aria-describedby="edit-resume-description"
                className="
          w-[95vw]
          max-w-xl
          rounded-2xl
          border
          border-zinc-800
          bg-zinc-950
          p-0
          text-white
          shadow-none
        "
            >
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.95,
                        y: 15
                    }}

                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0
                    }}

                    exit={{
                        opacity: 0,
                        scale: 0.95,
                        y: 10
                    }}

                    transition={{
                        duration: 0.25,
                        ease: "easeOut"
                    }}
                >
                    {/* Header */}

                    <DialogHeader className="border-b border-zinc-800 p-6">
                        <div className="flex items-start gap-4">
                            <div
                                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-zinc-800
                  bg-zinc-900
                "
                            >
                                <PencilLine
                                    size={22}
                                    className="text-red-500"
                                />
                            </div>

                            <div className="flex-1">
                                <DialogTitle className="text-2xl font-bold">
                                    Edit Resume
                                </DialogTitle>

                                <DialogDescription id="edit-resume-description">
                                    Update your resume information.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6 p-6"
                    >
                        <div className="space-y-6 p-6">
                            {/* Resume Title */}

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-zinc-300">
                                        Resume Title
                                    </label>

                                    <span className="text-xs text-zinc-500">
                                        {(watch("title") || "").length}/100
                                    </span>
                                </div>

                                <input
                                    ref={titleInputRef}
                                    {...register("title")}
                                    aria-label="Resume Title"
                                    onKeyDown={handleKeyDown}
                                    aria-invalid={!!errors.title}
                                    aria-describedby="resume-title-error"
                                    placeholder="Full Stack Developer Resume"
                                    className="
      w-full
      rounded-xl
      border
      border-zinc-800
      bg-zinc-900
      px-4
      py-3
      text-white
      placeholder:text-zinc-500
      outline-none
      transition-all
      focus:border-red-500
  "
                                />

                                {errors.title && (
                                    <p className="text-sm text-red-500">
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
                                    aria-label="Resume Template"
                                    aria-invalid={!!errors.template}
                                    className="
      w-full
      rounded-xl
      border
      border-zinc-800
      bg-zinc-900
      px-4
      py-3
      text-white
      outline-none
      transition-all
      focus:border-red-500
  "
                                >
                                    <option value="Modern">Modern</option>
                                    <option value="Professional">Professional</option>
                                    <option value="Minimal">Minimal</option>
                                </select>

                                {errors.template && (
                                    <p className="text-sm text-red-500">
                                        {errors.template.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </form>

                    {
                        apiError && (
                            <div
                                className="
        rounded-xl
        border
        border-red-900
        bg-red-950/40
        px-4
        py-3
      "
                            >
                                <p className="text-sm text-red-400">
                                    {apiError}
                                </p>
                            </div>
                        )
                    }

                    {
                        errors.title && (

                            <p
                                id="resume-title-error"
                                className="text-sm text-red-500"
                            >

                                {errors.title.message}

                            </p>

                        )
                    }

                    {
                        loading && (

                            <div
                                className="
absolute
inset-0
z-50
flex
items-center
justify-center
rounded-2xl
bg-black/60
backdrop-blur-sm
"
                            >

                                <div
                                    className="
flex
items-center
gap-3
rounded-xl
border
border-zinc-800
bg-zinc-950
px-6
py-4
"
                                >

                                    <Loader2
                                        className="h-5 w-5 animate-spin text-red-500"
                                    />

                                    <span className="text-sm text-zinc-300">

                                        Saving changes...

                                    </span>

                                </div>

                            </div>

                        )
                    }
                    {/* Footer */}

                    <motion.div
                        className="
              flex
              flex-col-reverse
              gap-3
              border-t
              border-zinc-800
              p-6

              sm:flex-row
              sm:justify-end
            "
                    >
                        <Button
                            aria-label="Cancel Editing"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={loading}
                            aria-label="Save Resume Changes"
                        >
                            {loading ? (
                                <>
                                    <Loader2
                                        className="mr-2 h-4 w-4 animate-spin"
                                    />

                                    Saving...
                                </>
                            ) : (
                                <>
                                    <PencilLine
                                        className="mr-2 h-4 w-4"
                                    />

                                    Save Changes
                                </>
                            )}
                        </Button>
                    </motion.div>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
};

export default EditResumeModal;
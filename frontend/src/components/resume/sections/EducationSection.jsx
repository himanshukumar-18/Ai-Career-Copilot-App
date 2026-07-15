import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Label from "../../ui/Label";
import Checkbox from "../../ui/Checkbox";
import Textarea from "../../ui/Textarea";

import { educationsFormSchema } from "../../../lib/validations/educationSchema";

import {
    getEducationsThunk,
    createEducationThunk,
    updateEducationThunk,
    deleteEducationThunk,
} from "../../../features/education/educationThunk";
import { resetMutateStatus } from "../../../features/education/educationSlice";
import {
    selectEducationList,
    selectIsEducationLoading,
    selectIsEducationMutating,
    selectEducationMutateSucceeded,
    selectEducationMutateFailed,
    selectEducationError,
} from "../../../features/education/educationSelectors";

const EMPTY_EDUCATION = {
    degree: "",
    institution: "",
    field_of_study: "",
    location: "",
    start_date: "",
    end_date: "",
    currently_studying: false,
    grade: "",
    description: "",
};

/** Maps API education records onto the form's known field shape. */
const toFormValues = (items) => ({
    educations:
        items.length > 0
            ? items.map((item) => ({ ...EMPTY_EDUCATION, ...item }))
            : [EMPTY_EDUCATION],
});

const EducationSection = () => {
    const dispatch = useDispatch();
    const { resumeId } = useParams();

    const items = useSelector(selectEducationList);
    const isLoading = useSelector(selectIsEducationLoading);
    const isMutating = useSelector(selectIsEducationMutating);
    const mutateSucceeded = useSelector(selectEducationMutateSucceeded);
    const mutateFailed = useSelector(selectEducationMutateFailed);
    const errorMessage = useSelector(selectEducationError);

    const {
        control,
        register,
        watch,
        reset,
        trigger,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(educationsFormSchema),
        defaultValues: { educations: [EMPTY_EDUCATION] },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "educations",
    });

    // Fetch education entries on mount.
    useEffect(() => {
        if (resumeId) {
            dispatch(getEducationsThunk(resumeId));
        }
    }, [dispatch, resumeId]);

    // Sync fetched entries into the form once available.
    useEffect(() => {
        reset(toFormValues(items));
    }, [items, reset]);

    // Surface mutation result as a toast, then clear the transient status.
    useEffect(() => {
        if (mutateSucceeded) {
            toast.success("Education saved successfully.");
            dispatch(resetMutateStatus());
        }
        if (mutateFailed) {
            toast.error(errorMessage || "Unable to save education entry.");
            dispatch(resetMutateStatus());
        }
    }, [mutateSucceeded, mutateFailed, errorMessage, dispatch]);

    const handleAddEducation = () => {
        append(EMPTY_EDUCATION);
    };

    /**
     * Saves a single row: creates it if it has no id yet, otherwise updates it.
     * Each row saves independently since the API is per-item, not bulk.
     */
    const handleSaveRow = async (index) => {
        const isValid = await trigger(`educations.${index}`);
        if (!isValid) return;

        const rowData = getValues(`educations.${index}`);
        const { id, ...educationData } = rowData;

        // Guard: never let a missing/invalid resumeId reach the API.
        const numericResumeId = Number(resumeId);

        if (!resumeId || Number.isNaN(numericResumeId)) {
            toast.error(
                "Resume ID is missing or invalid. Please reload the page."
            );
            return;
        }

        try {
            if (id) {
                await dispatch(
                    updateEducationThunk({
                        id,
                        resumeId: numericResumeId,
                        educationData,
                    })
                ).unwrap();
            } else {
                await dispatch(
                    createEducationThunk({
                        resumeId: numericResumeId,
                        educationData,
                    })
                ).unwrap();
            }
        } catch {
            // Error toast handled by the effect above once mutateFailed flips.
        }
    };

    const handleRemoveRow = async (index) => {
        // field.id (react-hook-form's useFieldArray key) is NOT the same
        // as the real database id — it's an internal UUID used only for
        // React's key prop. The actual saved record's id lives in the
        // form values themselves.
        const rowId = getValues(`educations.${index}.id`);

        if (rowId) {
            try {
                await dispatch(deleteEducationThunk(rowId)).unwrap();
                remove(index);
            } catch {
                // Error toast handled by the effect above once mutateFailed flips.
            }
        } else {
            // Never saved to the server — just drop it from the form.
            remove(index);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24 text-sm text-zinc-500">
                Loading education history...
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
            <div className="border border-zinc-800 bg-zinc-950">
                {/* Header */}
                <header className="flex flex-col gap-4 border-b border-zinc-800 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center border border-zinc-800 bg-black text-zinc-400">
                            <GraduationCap size={15} />
                        </span>

                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                                Resume section
                            </p>

                            <h2 className="mt-1 text-xl font-semibold text-white">
                                Education
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500">
                                Showcase your academic qualifications and
                                educational background.
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddEducation}
                        className="h-10 shrink-0 px-4 text-xs"
                    >
                        <Plus size={15} />
                        Add education
                    </Button>
                </header>

                {/* Body */}
                <div className="space-y-5 p-5 sm:p-6">
                    <AnimatePresence initial={false}>
                        {fields.length === 0 ? (
                            <EmptyState onAdd={handleAddEducation} />
                        ) : (
                            fields.map((field, index) => (
                                <EducationRow
                                    key={field.id}
                                    index={index}
                                    rowId={field.id}
                                    register={register}
                                    errors={errors}
                                    watch={watch}
                                    isMutating={isMutating}
                                    onSave={() => handleSaveRow(index)}
                                    onRemove={() => handleRemoveRow(index)}
                                />
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.section>
    );
};

/** A single education entry: its fields, save, and remove controls. */
const EducationRow = ({
    index,
    register,
    errors,
    watch,
    isMutating,
    onSave,
    onRemove,
}) => {
    const isCurrent = watch(`educations.${index}.currently_studying`);
    const rowErrors = errors.educations?.[index] ?? {};

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="border border-zinc-800 bg-zinc-900/40 p-5"
        >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Degree" error={rowErrors.degree}>
                    <Input
                        placeholder="Bachelor of Technology"
                        {...register(`educations.${index}.degree`)}
                    />
                </Field>

                <Field label="Institution" error={rowErrors.institution}>
                    <Input
                        placeholder="Delhi University"
                        {...register(`educations.${index}.institution`)}
                    />
                </Field>

                <Field label="Field of study" error={rowErrors.field_of_study}>
                    <Input
                        placeholder="Computer Science"
                        {...register(`educations.${index}.field_of_study`)}
                    />
                </Field>

                <Field label="Location" error={rowErrors.location}>
                    <Input
                        placeholder="New Delhi"
                        {...register(`educations.${index}.location`)}
                    />
                </Field>

                <Field label="Start date" error={rowErrors.start_date}>
                    <Input
                        type="date"
                        {...register(`educations.${index}.start_date`)}
                    />
                </Field>

                <Field label="End date" error={rowErrors.end_date}>
                    <Input
                        type="date"
                        disabled={isCurrent}
                        {...register(`educations.${index}.end_date`)}
                    />
                </Field>

                <Field label="Grade / CGPA" error={rowErrors.grade}>
                    <Input
                        placeholder="8.7 CGPA"
                        {...register(`educations.${index}.grade`)}
                    />
                </Field>

                <div className="flex items-end gap-3 pb-1">
                    <Checkbox
                        id={`current-${index}`}
                        {...register(`educations.${index}.currently_studying`)}
                    />
                    <Label htmlFor={`current-${index}`}>
                        Currently studying here
                    </Label>
                </div>
            </div>

            <div className="mt-4">
                <Field label="Description" error={rowErrors.description}>
                    <Textarea
                        rows={5}
                        placeholder="Describe your education, achievements, coursework, activities..."
                        {...register(`educations.${index}.description`)}
                    />
                </Field>
            </div>

            <div className="mt-5 flex justify-end gap-3">
                <motion.div whileTap={{ scale: 0.97 }}>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onRemove}
                        disabled={isMutating}
                        className="h-9 px-4 text-xs"
                    >
                        <Trash2 size={14} />
                        Remove
                    </Button>
                </motion.div>

                <motion.div whileTap={{ scale: 0.97 }}>
                    <Button
                        type="button"
                        onClick={onSave}
                        disabled={isMutating}
                        className="h-9 px-4 text-xs"
                    >
                        {isMutating ? "Saving..." : "Save"}
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
};

/** Pairs a label, its input, and a validation message. */
const Field = ({ label, error, children }) => (
    <div>
        <Label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-500">
            {label}
        </Label>
        {children}
        {error && (
            <p className="mt-1 text-xs text-red-500">{error.message}</p>
        )}
    </div>
);

/** Shown when there are no education entries yet. */
const EmptyState = ({ onAdd }) => (
    <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        className="border border-dashed border-zinc-700 px-5 py-16 text-center"
    >
        <GraduationCap size={38} className="mx-auto text-zinc-700" />

        <h3 className="mt-4 text-sm font-semibold text-zinc-300">
            No education added yet
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-zinc-500">
            Add your education to strengthen your resume.
        </p>

        <Button
            type="button"
            variant="outline"
            onClick={onAdd}
            className="mt-5 h-9 px-4 text-xs"
        >
            <Plus size={14} />
            Add education
        </Button>
    </motion.div>
);

export default EducationSection;
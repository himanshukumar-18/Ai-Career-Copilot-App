import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
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
    is_current: false,
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
        dispatch(getEducationsThunk());
    }, [dispatch]);

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
        const isValid = await control.trigger(`educations.${index}`);
        if (!isValid) return;

        const rowData = control._formValues.educations[index];
        const { id, ...educationData } = rowData;

        try {
            if (id) {
                await dispatch(
                    updateEducationThunk({ id, educationData })
                ).unwrap();
            } else {
                await dispatch(createEducationThunk(educationData)).unwrap();
            }
        } catch {
            // Error toast handled by the effect above once mutateFailed flips.
        }
    };

    const handleRemoveRow = async (index, rowId) => {
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
            <div className="flex items-center justify-center py-24 text-zinc-400">
                Loading education history...
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
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 shadow-xl">
                {/* Header */}
                <div className="border-b border-zinc-800 px-8 py-6">
                    <div className="flex items-center gap-3">
                        <GraduationCap size={26} className="text-red-500" />
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                Education
                            </h2>
                            <p className="mt-1 text-sm text-zinc-400">
                                Showcase your academic qualifications and
                                educational background.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="space-y-6 p-8">
                    <AnimatePresence>
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
                                    onRemove={() =>
                                        handleRemoveRow(index, field.id)
                                    }
                                />
                            ))
                        )}
                    </AnimatePresence>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddEducation}
                        className="w-full"
                    >
                        <Plus size={16} />
                        Add Education
                    </Button>
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
    const isCurrent = watch(`educations.${index}.is_current`);
    const rowErrors = errors.educations?.[index] ?? {};

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
        >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

                <Field label="Field of Study" error={rowErrors.field_of_study}>
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

                <Field label="Start Date" error={rowErrors.start_date}>
                    <Input
                        type="date"
                        {...register(`educations.${index}.start_date`)}
                    />
                </Field>

                <Field label="End Date" error={rowErrors.end_date}>
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

                <div className="flex items-end gap-3">
                    <Checkbox
                        id={`current-${index}`}
                        {...register(`educations.${index}.is_current`)}
                    />
                    <Label htmlFor={`current-${index}`}>
                        Currently studying here
                    </Label>
                </div>
            </div>

            <div className="mt-6">
                <Field label="Description" error={rowErrors.description}>
                    <Textarea
                        rows={5}
                        placeholder="Describe your education, achievements, coursework, activities..."
                        {...register(`educations.${index}.description`)}
                    />
                </Field>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <motion.div whileTap={{ scale: 0.97 }}>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onRemove}
                        disabled={isMutating}
                    >
                        <Trash2 size={16} />
                        Remove
                    </Button>
                </motion.div>

                <motion.div whileTap={{ scale: 0.97 }}>
                    <Button type="button" onClick={onSave} disabled={isMutating}>
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
        <Label>{label}</Label>
        {children}
        {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
);

/** Shown when there are no education entries yet. */
const EmptyState = ({ onAdd }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-xl border border-dashed border-zinc-700 p-12 text-center"
    >
        <GraduationCap size={40} className="mx-auto text-zinc-600" />
        <h3 className="mt-4 text-lg font-semibold text-white">
            No Education Added
        </h3>
        <p className="mt-2 text-sm text-zinc-500">
            Add your education to strengthen your resume.
        </p>
        <Button type="button" variant="outline" className="mt-5" onClick={onAdd}>
            <Plus size={16} />
            Add Education
        </Button>
    </motion.div>
);

export default EducationSection;
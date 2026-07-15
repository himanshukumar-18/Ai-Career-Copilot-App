import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, Trash2, Loader2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Label from "../../ui/Label";
import Select from "../../ui/Select";

import { skillsFormSchema } from "../../../lib/validations/skillsSchema";

import {
    getSkillsThunk,
    createSkillThunk,
    updateSkillThunk,
    deleteSkillThunk,
} from "../../../features/skills/skillThunk";
import { resetMutateStatus } from "../../../features/skills/skillSlice";
import {
    selectSkillList,
    selectIsSkillsLoading,
    selectIsSkillsMutating,
    selectSkillsMutateSucceeded,
    selectSkillsMutateFailed,
    selectSkillError,
} from "../../../features/skills/skillSelectors";

// Value sent to the backend must match SKILL_LEVEL_CHOICES exactly
// (lowercase). Label is what's shown in the dropdown. There is no
// "Master" option on the backend, so it isn't offered here.
const LEVEL_OPTIONS = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "expert", label: "Expert" },
];

const EMPTY_SKILL = {
    name: "",
    level: "",
};

const toFormValues = (items) => ({
    skills:
        items?.length > 0
            ? items.map((item) => ({ ...EMPTY_SKILL, ...item }))
            : [EMPTY_SKILL],
});

const SkillsSection = () => {
    const dispatch = useDispatch();
    const { resumeId } = useParams();

    const items = useSelector(selectSkillList);
    const isLoading = useSelector(selectIsSkillsLoading);
    const isMutating = useSelector(selectIsSkillsMutating);
    const mutateSucceeded = useSelector(selectSkillsMutateSucceeded);
    const mutateFailed = useSelector(selectSkillsMutateFailed);
    const errorMessage = useSelector(selectSkillError);

    const {
        control,
        register,
        reset,
        trigger,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(skillsFormSchema),
        defaultValues: { skills: [EMPTY_SKILL] },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "skills",
    });

    // Fetch skills for this resume on mount.
    useEffect(() => {
        if (resumeId) {
            dispatch(getSkillsThunk(resumeId));
        }
    }, [dispatch, resumeId]);

    // Sync fetched entries into the form once available.
    useEffect(() => {
        reset(toFormValues(items));
    }, [items, reset]);

    // Surface mutation result as a toast, then clear the transient status.
    useEffect(() => {
        if (mutateSucceeded) {
            toast.success("Skill saved successfully.");
            dispatch(resetMutateStatus());
        }
        if (mutateFailed) {
            toast.error(errorMessage || "Unable to save skill.");
            dispatch(resetMutateStatus());
        }
    }, [mutateSucceeded, mutateFailed, errorMessage, dispatch]);

    const handleAddSkill = () => append(EMPTY_SKILL);

    /**
     * Saves a single row: creates it if it has no id yet, otherwise updates it.
     */
    const handleSaveRow = async (index) => {
        const isValid = await trigger(`skills.${index}`);
        if (!isValid) return;

        const rowData = getValues(`skills.${index}`);
        const { id, ...skillData } = rowData;

        try {
            if (id) {
                await dispatch(updateSkillThunk({ id, skillData })).unwrap();
            } else {
                const numericResumeId = Number(resumeId);

                if (!resumeId || Number.isNaN(numericResumeId)) {
                    toast.error(
                        "Resume ID is missing or invalid. Please reload the page."
                    );
                    return;
                }

                await dispatch(
                    createSkillThunk({
                        resumeId: numericResumeId,
                        skillData,
                    })
                ).unwrap();
            }
        } catch {
            // Error toast handled by the effect above once mutateFailed flips.
        }
    };

    /**
     * Removes a single row: deletes it from the server if it has a real
     * saved id, otherwise just drops it from the form. field.id (react-
     * hook-form's useFieldArray key) is NOT the same as the database id —
     * it's an internal UUID used only for React's key prop, so the real
     * id has to be read from the form values themselves.
     */
    const handleRemoveRow = async (index) => {
        const rowId = getValues(`skills.${index}.id`);

        if (rowId) {
            try {
                await dispatch(deleteSkillThunk(rowId)).unwrap();
                remove(index);
            } catch {
                // Error toast handled by the effect above once mutateFailed flips.
            }
        } else {
            remove(index);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24 text-sm text-zinc-500">
                Loading skills...
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
                            <Sparkles size={15} />
                        </span>

                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                                Resume section
                            </p>

                            <h2 className="mt-1 text-xl font-semibold text-white">
                                Skills
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500">
                                Manage the most important skills recruiters
                                need to see.
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddSkill}
                        className="h-10 shrink-0 px-4 text-xs"
                    >
                        <Plus size={15} />
                        Add skill
                    </Button>
                </header>

                {/* Body */}
                <div className="space-y-5 p-5 sm:p-6">
                    <AnimatePresence initial={false}>
                        {fields.length === 0 ? (
                            <EmptyState onAdd={handleAddSkill} />
                        ) : (
                            fields.map((field, index) => (
                                <motion.div
                                    key={field.id}
                                    layout
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="border border-zinc-800 bg-zinc-900/40 p-5"
                                >
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Field
                                            label="Skill"
                                            error={errors.skills?.[index]?.name}
                                        >
                                            <Input
                                                id={`skills-${index}-name`}
                                                placeholder="React"
                                                {...register(
                                                    `skills.${index}.name`
                                                )}
                                            />
                                        </Field>

                                        <Field
                                            label="Level"
                                            error={errors.skills?.[index]?.level}
                                        >
                                            <Select
                                                id={`skills-${index}-level`}
                                                defaultValue=""
                                                {...register(
                                                    `skills.${index}.level`
                                                )}
                                            >
                                                <option value="" disabled>
                                                    Select level
                                                </option>
                                                {LEVEL_OPTIONS.map(
                                                    ({ value, label }) => (
                                                        <option
                                                            key={value}
                                                            value={value}
                                                        >
                                                            {label}
                                                        </option>
                                                    )
                                                )}
                                            </Select>
                                        </Field>
                                    </div>

                                    <div className="mt-5 flex justify-end gap-3">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() =>
                                                handleRemoveRow(index)
                                            }
                                            disabled={isMutating}
                                            className="h-9 px-4 text-xs"
                                        >
                                            <Trash2 size={14} />
                                            Remove
                                        </Button>

                                        <Button
                                            type="button"
                                            onClick={() =>
                                                handleSaveRow(index)
                                            }
                                            disabled={isMutating}
                                            className="h-9 px-4 text-xs"
                                        >
                                            {isMutating && (
                                                <Loader2
                                                    size={14}
                                                    className="mr-1 animate-spin"
                                                />
                                            )}
                                            Save
                                        </Button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.section>
    );
};

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

const EmptyState = ({ onAdd }) => (
    <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        className="border border-dashed border-zinc-700 px-5 py-16 text-center"
    >
        <Sparkles size={38} className="mx-auto text-zinc-700" />

        <h3 className="mt-4 text-sm font-semibold text-zinc-300">
            No skills added yet
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-zinc-500">
            Add your strongest skills to make your resume stand out.
        </p>

        <Button
            type="button"
            variant="outline"
            onClick={onAdd}
            className="mt-5 h-9 px-4 text-xs"
        >
            <Plus size={14} />
            Add skill
        </Button>
    </motion.div>
);

export default SkillsSection;
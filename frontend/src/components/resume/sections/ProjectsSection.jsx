import { useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderGit2, Globe, Plus, Trash2, } from "lucide-react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Textarea from "../../ui/Textarea";
import Checkbox from "../../ui/Checkbox";

import { projectsFormSchema } from "../../../lib/validations/projectsSchema";
import { useDispatch, useSelector } from "react-redux";
import {
    getProjectsThunk,
    createProjectThunk,
    updateProjectThunk,
    deleteProjectThunk,
} from "../../../features/projects/projectThunk";
import { resetMutateStatus } from "../../../features/projects/projectSlice";
import {
    selectProjectList,
    selectIsProjectsLoading,
    selectIsProjectsMutating,
    selectProjectsMutateSucceeded,
    selectProjectsMutateFailed,
    selectProjectError,
} from "../../../features/projects/projectSelectors";
import { useResumeEditorSection } from "../editor/ResumeEditorContext";

// ─────────────────────────────────────────────────────────────────────────────
// Constants — field names match the Django Project model exactly
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_PROJECT = {
    title: "",
    role: "",
    description: "",
    technologies: "",       // required — comma-separated string
    github_url: "",         // optional URL
    live_demo_url: "",      // optional URL
    start_date: "",
    end_date: "",
    currently_working: false,
    is_featured: false,
    is_visible: true,
    display_order: 0,
};

const toFormValues = (items) => ({
    projects:
        items?.length > 0
            ? items.map((item) => ({ ...EMPTY_PROJECT, ...item }))
            : [EMPTY_PROJECT],
});

// ─────────────────────────────────────────────────────────────────────────────
// Main section
// ─────────────────────────────────────────────────────────────────────────────
const ProjectsSection = () => {
    const dispatch = useDispatch();
    const { resumeId } = useParams();

    const items = useSelector(selectProjectList);
    const isLoading = useSelector(selectIsProjectsLoading);
    const isMutating = useSelector(selectIsProjectsMutating);
    const mutateSucceeded = useSelector(selectProjectsMutateSucceeded);
    const mutateFailed = useSelector(selectProjectsMutateFailed);
    const errorMessage = useSelector(selectProjectError);
    const { registerSaveAction } = useResumeEditorSection();

    const {
        control,
        register,
        handleSubmit,
        reset,
        trigger,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(projectsFormSchema),
        defaultValues: { projects: [EMPTY_PROJECT] },
    });

    const { fields, append, remove } = useFieldArray({ control, name: "projects" });

    // ── Fetch ───────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!resumeId) return;
        dispatch(getProjectsThunk(Number(resumeId)));
    }, [dispatch, resumeId]);

    // ── Sync server → form ──────────────────────────────────────────────────
    useEffect(() => {
        reset(toFormValues(items));
    }, [items, reset]);

    // ── Toast feedback ──────────────────────────────────────────────────────
    useEffect(() => {
        if (mutateSucceeded) {
            toast.success("Project saved successfully.");
            dispatch(resetMutateStatus());
        }
        if (mutateFailed) {
            toast.error(errorMessage || "Unable to save project.");
            dispatch(resetMutateStatus());
        }
    }, [mutateSucceeded, mutateFailed, errorMessage, dispatch]);

    const getNumericResumeId = useCallback(() => {
        const numericResumeId = Number(resumeId);

        if (!resumeId || Number.isNaN(numericResumeId)) {
            toast.error("Resume ID is missing or invalid. Please reload the page.");
            return null;
        }

        return numericResumeId;
    }, [resumeId]);

    const saveProject = useCallback(
        async (rowData) => {
            const { id, ...projectData } = rowData;

            if (id) {
                await dispatch(updateProjectThunk({ id, projectData })).unwrap();
                return;
            }

            const numericResumeId = getNumericResumeId();
            if (numericResumeId === null) return;

            await dispatch(
                createProjectThunk({
                    resumeId: numericResumeId,
                    projectData,
                })
            ).unwrap();
        },
        [dispatch, getNumericResumeId]
    );

    const saveAllProjects = useCallback(
        async ({ projects }) => {
            try {
                for (const project of projects) {
                    await saveProject(project);
                }
            } catch {
                /* handled by toast effect */
            }
        },
        [saveProject]
    );

    useEffect(() => {
        const unregister = registerSaveAction(
            "projects",
            handleSubmit(saveAllProjects, () => {
                toast.error("Please fix the highlighted project fields before saving.");
            })
        );

        return unregister;
    }, [handleSubmit, registerSaveAction, saveAllProjects]);

    // ── Handlers ────────────────────────────────────────────────────────────
    const handleSaveRow = async (index) => {
        const isValid = await trigger(`projects.${index}`);
        if (!isValid) {
            toast.error("Please fix the highlighted project fields before saving.");
            return;
        }

        const rowData = getValues(`projects.${index}`);

        try {
            await saveProject(rowData);
        } catch {
            /* handled by toast effect */
        }
    };

    const handleRemoveRow = async (index) => {
        const dbId = getValues(`projects.${index}.id`);
        if (dbId) {
            try {
                await dispatch(deleteProjectThunk(dbId)).unwrap();
            } catch {
                return;
            }
        }
        remove(index);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24 text-sm text-zinc-500">
                Loading projects...
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
            {/* ── Card shell ─────────────────────────────────────────────── */}
            <div className="border border-zinc-800 bg-zinc-950 shadow-xl">

                {/* ── Header ───────────────────────────────────────────── */}
                <div className="border-b border-zinc-800 px-8 py-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                                Resume Section
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                                <FolderGit2 size={20} className="text-fuchsia-400" />
                                <h2 className="text-xl font-bold text-white">Projects</h2>
                            </div>
                            <p className="mt-1 text-sm text-zinc-500">
                                Showcase your portfolio projects with your role, impact, and technology.
                            </p>
                        </div>
                        <motion.div whileTap={{ scale: 0.97 }}>
                            <Button type="button" onClick={() => append(EMPTY_PROJECT)}>
                                <Plus size={15} />
                                Add Project
                            </Button>
                        </motion.div>
                    </div>
                </div>

                {/* ── Body ─────────────────────────────────────────────── */}
                <div className="space-y-4 p-8">
                    <AnimatePresence>
                        {fields.length === 0 ? (
                            <EmptyState onAdd={() => append(EMPTY_PROJECT)} />
                        ) : (
                            fields.map((field, index) => (
                                <ProjectRow
                                    key={field.id}
                                    index={index}
                                    register={register}
                                    errors={errors}
                                    control={control}
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

// ─────────────────────────────────────────────────────────────────────────────
// Project row
// ─────────────────────────────────────────────────────────────────────────────
const ProjectRow = ({ index, register, errors, onSave, onRemove, control, isMutating }) => {
    const currentlyWorking = useWatch({ control, name: `projects.${index}.currently_working` });
    const rowErrors = errors.projects?.[index] ?? {};

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className=" border border-zinc-800 bg-zinc-900/60 p-6"
        >
            {/* ── Row 1: Title + Role ─────────────────────────────────── */}
            <div className="grid gap-5 md:grid-cols-2">
                <Field label="Project Title" required error={rowErrors.title}>
                    <Input
                        id={`projects-${index}-title`}
                        placeholder="AI Resume Builder"
                        {...register(`projects.${index}.title`)}
                    />
                </Field>

                <Field label="Role" error={rowErrors.role}>
                    <Input
                        id={`projects-${index}-role`}
                        placeholder="Frontend Engineer"
                        {...register(`projects.${index}.role`)}
                    />
                </Field>
            </div>

            {/* ── Row 2: Technologies ─────────────────────────────────── */}
            <div className="mt-5">
                <Field
                    label="Technologies"
                    required
                    hint="Comma-separated  e.g. React, Node.js, PostgreSQL"
                    error={rowErrors.technologies}
                >
                    <Input
                        id={`projects-${index}-technologies`}
                        placeholder="React, TypeScript, Django, PostgreSQL"
                        {...register(`projects.${index}.technologies`)}
                    />
                </Field>
            </div>

            {/* ── Row 3: GitHub URL + Live Demo URL ───────────────────── */}
            <div className="mt-5 grid gap-5 md:grid-cols-2">
                <Field label="GitHub URL" error={rowErrors.github_url}>
                    <div className="relative">
                        <Input
                            id={`projects-${index}-github_url`}
                            className="pl-9"
                            placeholder="https://github.com/you/repo"
                            {...register(`projects.${index}.github_url`)}
                        />
                    </div>
                </Field>

                <Field label="Live Demo URL" error={rowErrors.live_demo_url}>
                    <div className="relative">
                        <Globe size={16} className="absolute left-3 top-3.5 text-zinc-500" />
                        <Input
                            id={`projects-${index}-live_demo_url`}
                            className="pl-9"
                            placeholder="https://myproject.com"
                            {...register(`projects.${index}.live_demo_url`)}
                        />
                    </div>
                </Field>
            </div>

            {/* ── Row 4: Dates + Currently Working ───────────────────── */}
            <div className="mt-5 grid gap-5 md:grid-cols-3">
                <Field label="Start Date" error={rowErrors.start_date}>
                    <Input
                        id={`projects-${index}-start_date`}
                        type="date"
                        {...register(`projects.${index}.start_date`)}
                    />
                </Field>

                <Field label="End Date" error={rowErrors.end_date}>
                    <Input
                        id={`projects-${index}-end_date`}
                        type="date"
                        disabled={currentlyWorking}
                        {...register(`projects.${index}.end_date`)}
                    />
                </Field>

                <div className="flex flex-col justify-end">
                    <label
                        htmlFor={`projects-${index}-currently_working`}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3"
                    >
                        <Checkbox
                            id={`projects-${index}-currently_working`}
                            {...register(`projects.${index}.currently_working`)}
                        />
                        <span className="text-sm text-zinc-300">Currently working</span>
                    </label>
                </div>
            </div>

            {/* ── Row 5: Description ─────────────────────────────────── */}
            <div className="mt-5">
                <Field label="Description" error={rowErrors.description}>
                    <Textarea
                        id={`projects-${index}-description`}
                        rows={4}
                        placeholder="Describe the project, your contributions, and the outcome…"
                        {...register(`projects.${index}.description`)}
                    />
                </Field>
            </div>

            {/* ── Row 6: Toggles ─────────────────────────────────────── */}
            {/* <div className="mt-5 flex flex-wrap gap-3">
                <label
                    htmlFor={`projects-${index}-is_featured`}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5"
                >
                    <Checkbox
                        id={`projects-${index}-is_featured`}
                        {...register(`projects.${index}.is_featured`)}
                    />
                    <Star size={14} className="text-amber-400" />
                    <span className="text-sm text-zinc-300">Featured</span>
                </label>

                <label
                    htmlFor={`projects-${index}-is_visible`}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5"
                >
                    <Checkbox
                        id={`projects-${index}-is_visible`}
                        {...register(`projects.${index}.is_visible`)}
                    />
                    <Eye size={14} className="text-sky-400" />
                    <span className="text-sm text-zinc-300">Visible on resume</span>
                </label>

                <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5">
                    <span className="text-sm text-zinc-500">Display Order</span>
                    <Input
                        id={`projects-${index}-display_order`}
                        type="number"
                        min={0}
                        className="h-7 w-16 border-0 bg-transparent p-0 text-center text-sm text-white focus:ring-0"
                        {...register(`projects.${index}.display_order`, { valueAsNumber: true })}
                    />
                </div>
            </div> */}

            {/* ── Actions ────────────────────────────────────────────── */}
            <div className="mt-6 flex justify-end gap-3 border-t border-zinc-800 pt-5">
                <Button
                    type="button"
                    variant="destructive"
                    disabled={isMutating}
                    onClick={onRemove}
                >
                    <Trash2 size={15} />
                    Remove
                </Button>

                <Button type="button" disabled={isMutating} onClick={onSave}>
                    {isMutating ? "Saving…" : "Save"}
                </Button>
            </div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Labeled field wrapper — shows required asterisk and optional hint text. */
const Field = ({ label, required, hint, error, children }) => (
    <div>
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
        </p>
        {hint && <p className="mb-1.5 text-xs text-zinc-600">{hint}</p>}
        {children}
        {error && <p className="mt-1 text-xs text-red-400">{error.message}</p>}
    </div>
);

const EmptyState = ({ onAdd }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-xl border border-dashed border-zinc-800 p-14 text-center"
    >
        <FolderGit2 size={44} className="mx-auto text-zinc-700" />
        <h3 className="mt-4 text-lg font-semibold text-white">No Projects Yet</h3>
        <p className="mt-2 text-sm text-zinc-500">
            Add your portfolio projects — include links, technologies, and results.
        </p>
        <Button type="button" className="mt-6" onClick={onAdd}>
            <Plus size={15} />
            Add Project
        </Button>
    </motion.div>
);

export default ProjectsSection;

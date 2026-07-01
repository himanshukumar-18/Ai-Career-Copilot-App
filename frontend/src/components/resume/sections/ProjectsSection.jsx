import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Link, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Label from "../../ui/Label";
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
import {
    selectProjectList,
    selectIsProjectsLoading,
    selectIsProjectsMutating,
    selectProjectsMutateSucceeded,
    selectProjectsMutateFailed,
    selectProjectError,
} from "../../../features/projects/projectSelectors";

const EMPTY_PROJECT = {
    title: "",
    company: "",
    role: "",
    start_date: "",
    end_date: "",
    is_current: false,
    link: "",
    description: "",
};

const toFormValues = (items) => ({
    projects:
        items?.length > 0
            ? items.map((item) => ({ ...EMPTY_PROJECT, ...item }))
            : [EMPTY_PROJECT],
});

const ProjectsSection = () => {
    const dispatch = useDispatch();

    const items = useSelector(selectProjectList) ?? [];
    const isLoading = useSelector(selectIsProjectsLoading);
    const isMutating = useSelector(selectIsProjectsMutating);
    const mutateSucceeded = useSelector(selectProjectsMutateSucceeded);
    const mutateFailed = useSelector(selectProjectsMutateFailed);
    const errorMessage = useSelector(selectProjectError);

    const {
        control,
        register,
        reset,
        trigger,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(projectsFormSchema),
        defaultValues: { projects: [EMPTY_PROJECT] },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "projects",
    });

    useEffect(() => {
        dispatch(getProjectsThunk());
    }, [dispatch]);

    useEffect(() => {
        reset(toFormValues(items));
    }, [items, reset]);

    useEffect(() => {
        if (mutateSucceeded) toast.success("Project saved successfully.");
        if (mutateFailed) toast.error(errorMessage || "Unable to save project.");
    }, [mutateSucceeded, mutateFailed, errorMessage]);

    const handleAddProject = () => append(EMPTY_PROJECT);

    const handleSaveRow = async (index) => {
        const isValid = await trigger(`projects.${index}`);
        if (!isValid) return;

        const rowData = getValues(`projects.${index}`);
        const { id, ...projectData } = rowData;

        try {
            if (id) {
                await dispatch(updateProjectThunk({ id, projectData })).unwrap();
            } else {
                await dispatch(createProjectThunk(projectData)).unwrap();
            }
        } catch {
            /* handled by slice effects */
        }
    };

    const handleRemoveRow = async (index, rowId) => {
        if (rowId) {
            try {
                await dispatch(deleteProjectThunk(rowId)).unwrap();
                remove(index);
            } catch {
                /* handled by slice effects */
            }
        } else {
            remove(index);
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 shadow-xl">
                <div className="border-b border-zinc-800 px-8 py-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-fuchsia-500/10">
                            <Briefcase className="text-fuchsia-400" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Projects</h2>
                            <p className="mt-1 text-sm text-zinc-400">
                                Add your key projects, contributions, and results.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 p-8">
                    <AnimatePresence>
                        {fields.length === 0 ? (
                            <EmptyState onAdd={handleAddProject} />
                        ) : (
                            fields.map((field, index) => (
                                <ProjectRow
                                    key={field.id}
                                    index={index}
                                    rowId={field.id}
                                    register={register}
                                    errors={errors}
                                    control={control}
                                    isMutating={isMutating}
                                    onSave={() => handleSaveRow(index)}
                                    onRemove={(rowId) => handleRemoveRow(index, rowId)}
                                />
                            ))
                        )}
                    </AnimatePresence>

                    <motion.div whileTap={{ scale: 0.98 }}>
                        <Button type="button" variant="outline" className="w-full" onClick={handleAddProject}>
                            <Plus size={16} />
                            Add Project
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
};

const ProjectRow = ({ index, rowId, register, errors, onSave, onRemove, control }) => {
    const isCurrent = control._formValues?.projects?.[index]?.is_current ?? false;
    const rowErrors = errors.projects?.[index] ?? {};

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
        >
            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-6">
                    <Field label="Project Name" error={rowErrors.title}>
                        <Input id={`projects-${index}-title`} placeholder="AI Resume Builder" {...register(`projects.${index}.title`)} />
                    </Field>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Field label="Company" error={rowErrors.company}>
                            <Input id={`projects-${index}-company`} placeholder="Acme Corp" {...register(`projects.${index}.company`)} />
                        </Field>

                        <Field label="Role" error={rowErrors.role}>
                            <Input id={`projects-${index}-role`} placeholder="Frontend Engineer" {...register(`projects.${index}.role`)} />
                        </Field>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Field label="Start Date" error={rowErrors.start_date}>
                            <Input id={`projects-${index}-start_date`} type="date" {...register(`projects.${index}.start_date`)} />
                        </Field>

                        <Field label="End Date" error={rowErrors.end_date}>
                            <Input id={`projects-${index}-end_date`} type="date" disabled={isCurrent} {...register(`projects.${index}.end_date`)} />
                        </Field>
                    </div>

                    <Field label="Project Link" error={rowErrors.link}>
                        <div className="relative">
                            <Link size={18} className="absolute left-3 top-3 text-zinc-500" />
                            <Input id={`projects-${index}-link`} className="pl-10" placeholder="https://..." {...register(`projects.${index}.link`)} />
                        </div>
                    </Field>
                </div>

                <div className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">Project Description</p>
                        <Textarea id={`projects-${index}-description`} rows={6} placeholder="Describe the project, your contributions, and the outcome." {...register(`projects.${index}.description`)} />
                        {rowErrors.description && <p className="mt-1 text-sm text-red-500">{rowErrors.description.message}</p>}
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
                        <Checkbox id={`projects-${index}-is_current`} {...register(`projects.${index}.is_current`)} />
                        <Label htmlFor={`projects-${index}-is_current`} className="mb-0 text-sm text-zinc-300">Current project</Label>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <motion.div whileTap={{ scale: 0.97 }}>
                    <Button type="button" variant="destructive" onClick={() => onRemove(rowId)}>
                        <Trash2 size={16} />
                        Remove
                    </Button>
                </motion.div>

                <motion.div whileTap={{ scale: 0.97 }}>
                    <Button type="button" onClick={onSave}>
                        Save
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
};

const Field = ({ label, error, children }) => (
    <div>
        <Label>{label}</Label>
        {children}
        {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
);

const EmptyState = ({ onAdd }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-dashed border-zinc-700 p-12 text-center">
        <Briefcase size={48} className="mx-auto text-zinc-600" />
        <h3 className="mt-4 text-xl font-semibold text-white">No Projects Added</h3>
        <p className="mt-2 text-sm text-zinc-500">Showcase your portfolio projects with your role, impact, and technology.</p>
        <Button type="button" variant="outline" className="mt-6" onClick={onAdd}>
            <Plus size={16} />
            Add Project
        </Button>
    </motion.div>
);

export default ProjectsSection

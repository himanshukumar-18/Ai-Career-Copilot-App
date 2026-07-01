import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Label from "../../ui/Label";
import Select from "../../ui/Select";

import { skillsFormSchema } from "../../../lib/validations/skillsSchema";

const LEVEL_OPTIONS = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert",
    "Master",
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

const SkillsSection = ({ resume }) => {
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

    useEffect(() => {
        reset(toFormValues(resume?.skills ?? []));
    }, [resume, reset]);

    const handleAddSkill = () => append(EMPTY_SKILL);

    const handleSaveRow = async (index) => {
        const isValid = await trigger(`skills.${index}`);
        if (!isValid) return;

        toast.success("Skill saved successfully.");
        getValues(`skills.${index}`);
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
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                            <Sparkles className="text-emerald-400" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Skills</h2>
                            <p className="mt-1 text-sm text-zinc-400">
                                Manage the most important skills recruiters need to see.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 p-8">
                    <AnimatePresence>
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
                                    className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
                                >
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <Field label="Skill" error={errors.skills?.[index]?.name}>
                                            <Input
                                                id={`skills-${index}-name`}
                                                placeholder="React"
                                                {...register(`skills.${index}.name`)}
                                            />
                                        </Field>

                                        <Field label="Level" error={errors.skills?.[index]?.level}>
                                            <Select
                                                id={`skills-${index}-level`}
                                                defaultValue=""
                                                {...register(`skills.${index}.level`)}
                                            >
                                                <option value="" disabled>
                                                    Select level
                                                </option>
                                                {LEVEL_OPTIONS.map((level) => (
                                                    <option key={level} value={level}>
                                                        {level}
                                                    </option>
                                                ))}
                                            </Select>
                                        </Field>
                                    </div>

                                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                                        <Button type="button" variant="destructive" onClick={() => remove(index)}>
                                            <Trash2 size={16} />
                                            Remove
                                        </Button>
                                        <Button type="button" onClick={() => handleSaveRow(index)}>
                                            Save
                                        </Button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>

                    <motion.div whileTap={{ scale: 0.98 }}>
                        <Button type="button" variant="outline" className="w-full" onClick={handleAddSkill}>
                            <Plus size={16} />
                            Add Skill
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.section>
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
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-xl border border-dashed border-zinc-700 p-12 text-center"
    >
        <Sparkles size={48} className="mx-auto text-zinc-600" />
        <h3 className="mt-4 text-xl font-semibold text-white">No Skills Added</h3>
        <p className="mt-2 text-sm text-zinc-500">
            Add your strongest skills to make your resume stand out.
        </p>
        <Button type="button" variant="outline" className="mt-6" onClick={onAdd}>
            <Plus size={16} />
            Add Skill
        </Button>
    </motion.div>
);

export default SkillsSection;

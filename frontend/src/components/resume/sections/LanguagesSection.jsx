import { useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, Plus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Label from "../../ui/Label";
import Select from "../../ui/Select";

import { languagesFormSchema } from "../../../lib/validations/languageSchema";
import {
    getLanguagesThunk,
    createLanguageThunk,
    updateLanguageThunk,
    deleteLanguageThunk,
} from "../../../features/language/languageThunk";
import { resetMutateStatus } from "../../../features/language/languageSlice";
import {
    selectLanguageList,
    selectIsLanguageLoading,
    selectIsLanguageMutating,
    selectLanguageMutateSucceeded,
    selectLanguageMutateFailed,
    selectLanguageError,
} from "../../../features/language/languageSelectors";

const EMPTY_LANGUAGE = {
    name: "",
    proficiency: "",
};

const PROFICIENCY_OPTIONS = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "professional", label: "Professional" },
    { value: "native", label: "Native / Bilingual" },
];

const toFormValues = (items) => ({
    languages:
        items.length > 0
            ? items.map((item) => ({ ...EMPTY_LANGUAGE, ...item }))
            : [EMPTY_LANGUAGE],
});

const LanguagesSection = () => {
    const dispatch = useDispatch();
    const { resumeId } = useParams();

    const languages = useSelector(selectLanguageList);
    const isLoading = useSelector(selectIsLanguageLoading);
    const isMutating = useSelector(selectIsLanguageMutating);
    const mutateSucceeded = useSelector(selectLanguageMutateSucceeded);
    const mutateFailed = useSelector(selectLanguageMutateFailed);
    const errorMessage = useSelector(selectLanguageError);

    const {
        control,
        register,
        reset,
        trigger,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(languagesFormSchema),
        defaultValues: { languages: [EMPTY_LANGUAGE] },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "languages",
        keyName: "fieldId",
    });

    useEffect(() => {
        if (resumeId) dispatch(getLanguagesThunk(resumeId));
    }, [dispatch, resumeId]);

    useEffect(() => {
        reset(toFormValues(languages));
    }, [languages, reset]);

    useEffect(() => {
        if (mutateSucceeded) {
            toast.success("Language saved successfully.");
            dispatch(resetMutateStatus());
        }

        if (mutateFailed) {
            toast.error(errorMessage || "Unable to save language.");
            dispatch(resetMutateStatus());
        }
    }, [mutateSucceeded, mutateFailed, errorMessage, dispatch]);

    const handleAddLanguage = () => {
        append(EMPTY_LANGUAGE);
    };

    const handleSaveRow = async (index) => {
        const isValid = await trigger(`languages.${index}`);
        if (!isValid) return;

        const rowData = getValues(`languages.${index}`);
        const { id, ...languageData } = rowData;

        try {
            if (id) {
                await dispatch(
                    updateLanguageThunk({ id, languageData })
                ).unwrap();
            } else {
                await dispatch(createLanguageThunk({ resumeId, languageData })).unwrap();
            }
        } catch {
            // Toast handled by the mutation status effect.
        }
    };

    const handleRemoveRow = async (index, rowId) => {
        if (rowId) {
            try {
                await dispatch(deleteLanguageThunk(rowId)).unwrap();
                remove(index);
            } catch {
                // Toast handled by the mutation status effect.
            }
        } else {
            remove(index);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24 text-zinc-400">
                Loading languages...
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
            <div className="border border-zinc-800 bg-zinc-950 shadow-xl">
                <div className="border-b border-zinc-800 px-8 py-6">
                    <div className="flex items-center gap-3">

                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                                Resume section
                            </p>
                            <h2 className="text-2xl mt-1 font-bold text-white">Languages</h2>
                            <p className="mt-1 text-sm text-zinc-400">
                                Showcase the languages you can communicate in professionally.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 p-8">
                    <div>
                        {fields.length === 0 ? (
                            <EmptyState onAdd={handleAddLanguage} />
                        ) : (
                            fields.map((field, index) => (
                                <LanguageRow
                                    key={field.fieldId}
                                    index={index}
                                    rowId={field.id}
                                    register={register}
                                    errors={errors}
                                    isMutating={isMutating}
                                    onSave={() => handleSaveRow(index)}
                                    onRemove={() => handleRemoveRow(index, field.id)}
                                />
                            ))
                        )}
                    </div>

                    <motion.div whileTap={{ scale: 0.98 }}>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={handleAddLanguage}
                        >
                            <Plus size={16} />
                            Add Language
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
};

const LanguageRow = ({
    index,
    rowId,
    register,
    errors,
    isMutating,
    onSave,
    onRemove,
}) => {
    const rowErrors = errors.languages?.[index] ?? {};

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="border border-zinc-800 bg-zinc-900 p-6"
        >
            <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                <div className="space-y-6">
                    <Field id={`language-${index}-name`} label="Language Name" error={rowErrors.name}>
                        <Input
                            id={`language-${index}-name`}
                            placeholder="English"
                            {...register(`languages.${index}.name`)}
                        />
                    </Field>

                    <Field id={`language-${index}-proficiency`} label="Proficiency Level" error={rowErrors.proficiency}>
                        <Select
                            id={`language-${index}-proficiency`}
                            defaultValue=""
                            {...register(`languages.${index}.proficiency`)}
                        >
                            <option value="" disabled>
                                Select proficiency
                            </option>
                            {PROFICIENCY_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                    </Field>
                </div>

                <div className="border border-zinc-800 bg-zinc-950 p-4 text-sm leading-6 text-zinc-400">
                    Select the level that best represents your professional
                    working proficiency.
                </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
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
                        {isMutating ? "Saving..." : rowId ? "Save" : "Save"}
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
};

const Field = ({ id, label, error, children }) => (
    <div>
        <Label htmlFor={id}>{label}</Label>
        {children}
        {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
);

const EmptyState = ({ onAdd }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-xl border border-dashed border-zinc-700 bg-zinc-900/80 p-14 text-center"
    >
        <Globe size={48} className="mx-auto text-zinc-600" />
        <h3 className="mt-5 text-xl font-semibold text-white">No Languages Added</h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
            Show recruiters the languages you can speak, read and write.
        </p>
        <motion.div whileTap={{ scale: 0.98 }} className="mt-8 inline-flex w-full justify-center sm:w-auto">
            <Button type="button" variant="outline" onClick={onAdd}>
                <Plus size={16} />
                Add Language
            </Button>
        </motion.div>
    </motion.div>
);

export default LanguagesSection;

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Award, Link, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Label from "../../ui/Label";
import { certificationsFormSchema } from "../../../lib/validations/certificationSchema";

import {
    getCertificationsThunk,
    updateCertificationsThunk,
} from "../../../features/resumeCertifications/resumeCertificationsThunk";
import { resetSaveStatus } from "../../../features/resumeCertifications/resumeCertificationsSlice";
import {
    selectCertifications,
    selectIsCertificationsLoading,
    selectIsCertificationsSaving,
    selectCertificationsSaveSucceeded,
    selectCertificationsSaveFailed,
    selectCertificationsError,
} from "../../../features/resumeCertifications/resumeCertificationsSelectors";

const EMPTY_CERTIFICATION = {
    name: "",
    issuer: "",
    issue_date: "",
    expiry_date: "",
    credential_id: "",
    credential_url: "",
};

/** Maps API certification records onto the form's known field shape. */
const toFormValues = (items) => ({
    certifications:
        items.length > 0
            ? items.map((item) => ({ ...EMPTY_CERTIFICATION, ...item }))
            : [EMPTY_CERTIFICATION],
});

const CertificationsSection = () => {
    const dispatch = useDispatch();
    const { resumeId } = useParams();

    const items = useSelector(selectCertifications);
    const isLoading = useSelector(selectIsCertificationsLoading);
    const isSaving = useSelector(selectIsCertificationsSaving);
    const saveSucceeded = useSelector(selectCertificationsSaveSucceeded);
    const saveFailed = useSelector(selectCertificationsSaveFailed);
    const errorMessage = useSelector(selectCertificationsError);

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm({
        resolver: zodResolver(certificationsFormSchema),
        defaultValues: { certifications: [EMPTY_CERTIFICATION] },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "certifications",
    });

    // Fetch certifications on mount / resumeId change.
    useEffect(() => {
        if (resumeId) {
            dispatch(getCertificationsThunk(resumeId));
        }
    }, [dispatch, resumeId]);

    // Sync fetched certifications into the form once available.
    useEffect(() => {
        reset(toFormValues(items));
    }, [items, reset]);

    // Surface save result as a toast, then clear the transient status.
    useEffect(() => {
        if (saveSucceeded) {
            toast.success("Certifications updated successfully.");
            dispatch(resetSaveStatus());
        }
        if (saveFailed) {
            toast.error(errorMessage || "Unable to update certifications.");
            dispatch(resetSaveStatus());
        }
    }, [saveSucceeded, saveFailed, errorMessage, dispatch]);

    const onSubmit = async (data) => {
        try {
            await dispatch(
                updateCertificationsThunk({
                    resumeId,
                    certifications: data.certifications,
                })
            ).unwrap();
            // Success toast handled by the effect above once saveSucceeded flips.
        } catch {
            // Error toast handled by the effect above once saveFailed flips.
        }
    };

    const handleAddCertification = () => {
        append(EMPTY_CERTIFICATION);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24 text-zinc-400">
                Loading certifications...
            </div>
        );
    }

    return (
        <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-zinc-800 bg-zinc-950"
        >
            {/* Header */}
            <div className="border-b border-zinc-800 px-8 py-6">
                <div className="flex items-center gap-3">
                    <Award className="text-yellow-500" size={24} />
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            Certifications
                        </h2>
                        <p className="mt-1 text-sm text-zinc-400">
                            Showcase your certifications and professional credentials.
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Body */}
                <div className="space-y-6 p-8">
                    {fields.length === 0 ? (
                        <EmptyState onAdd={handleAddCertification} />
                    ) : (
                        <AnimatePresence>
                            {fields.map((field, index) => (
                                <motion.div
                                    key={field.id}
                                    layout
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
                                >
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <Field
                                            id={`cert-${index}-name`}
                                            label="Certification Name"
                                            error={errors.certifications?.[index]?.name}
                                        >
                                            <Input
                                                id={`cert-${index}-name`}
                                                placeholder="AWS Certified Solutions Architect"
                                                {...register(`certifications.${index}.name`)}
                                            />
                                        </Field>

                                        <Field
                                            id={`cert-${index}-issuer`}
                                            label="Issuing Organization"
                                            error={errors.certifications?.[index]?.issuer}
                                        >
                                            <Input
                                                id={`cert-${index}-issuer`}
                                                placeholder="Amazon Web Services"
                                                {...register(`certifications.${index}.issuer`)}
                                            />
                                        </Field>

                                        <Field
                                            id={`cert-${index}-issue_date`}
                                            label="Issue Date"
                                            error={errors.certifications?.[index]?.issue_date}
                                        >
                                            <Input
                                                id={`cert-${index}-issue_date`}
                                                type="date"
                                                {...register(`certifications.${index}.issue_date`)}
                                            />
                                        </Field>

                                        <Field
                                            id={`cert-${index}-expiry_date`}
                                            label="Expiration Date"
                                            error={errors.certifications?.[index]?.expiry_date}
                                        >
                                            <Input
                                                id={`cert-${index}-expiry_date`}
                                                type="date"
                                                {...register(`certifications.${index}.expiry_date`)}
                                            />
                                        </Field>

                                        <Field
                                            id={`cert-${index}-credential_id`}
                                            label="Credential ID"
                                            error={errors.certifications?.[index]?.credential_id}
                                        >
                                            <Input
                                                id={`cert-${index}-credential_id`}
                                                placeholder="ABC-123456"
                                                {...register(`certifications.${index}.credential_id`)}
                                            />
                                        </Field>

                                        <Field
                                            id={`cert-${index}-credential_url`}
                                            label="Credential URL"
                                            error={errors.certifications?.[index]?.credential_url}
                                        >
                                            <div className="relative">
                                                <Link
                                                    size={18}
                                                    className="absolute left-3 top-3 text-zinc-500"
                                                />
                                                <Input
                                                    id={`cert-${index}-credential_url`}
                                                    className="pl-10"
                                                    placeholder="https://..."
                                                    {...register(`certifications.${index}.credential_url`)}
                                                />
                                            </div>
                                        </Field>
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash2 size={16} />
                                            Remove
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddCertification}
                        className="w-full"
                    >
                        <Plus size={16} />
                        Add Certification
                    </Button>
                </div>

                {/* Footer */}
                <div className="flex justify-end border-t border-zinc-800 px-8 py-6">
                    <motion.div whileTap={{ scale: 0.98 }}>
                        <Button type="submit" disabled={isSaving || !isDirty}>
                            {isSaving ? "Saving..." : "Save Certifications"}
                        </Button>
                    </motion.div>
                </div>
            </form>
        </motion.section>
    );
};

/** Pairs a label, its input, and a validation message. */
const Field = ({ id, label, error, children }) => (
    <div>
        <Label htmlFor={id}>{label}</Label>
        {children}
        {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
);

/** Shown when there are no certifications yet. */
const EmptyState = ({ onAdd }) => (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-700 py-12 text-center">
        <Award className="text-zinc-600" size={32} />
        <p className="text-sm text-zinc-400">
            No certifications added yet.
        </p>
        <Button type="button" variant="outline" onClick={onAdd}>
            <Plus size={16} />
            Add your first certification
        </Button>
    </div>
);

export default CertificationsSection;
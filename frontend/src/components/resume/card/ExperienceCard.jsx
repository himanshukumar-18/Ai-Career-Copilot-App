import { motion } from "framer-motion";
import {
    Building2,
    CalendarDays,
    MapPin,
    Trash2,
    Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import Button from "../../ui/Button";
import Checkbox from "../../ui/Checkbox";
import Input from "../../ui/Input";
import Label from "../../ui/Label";
import Textarea from "../../ui/Textarea";

import { experiencesFormSchema } from "../../../lib/validations/experienceSchema";
import { addExperience, editExperience, removeExperience } from "../../../features/experience/experienceThunk";
import { selectRowStatus, selectRowError } from "../../../features/experience/experienceSelectors";

// Single-item schema pulled from the array schema
const experienceItemSchema = experiencesFormSchema.shape.experiences.element;

/**
 * One experience entry. Handles its own save (create/update) and delete.
 * @param {Object} props
 * @param {Object} props.experience - Experience data (may be a blank draft)
 * @param {boolean} [props.isNew] - True if this card hasn't been saved yet
 * @param {(savedItem: Object) => void} [props.onSaved] - Called after a successful create
 * @param {() => void} [props.onCancelNew] - Called to discard an unsaved draft
 */
const ExperienceCard = ({ experience, isNew = false, onSaved, onCancelNew }) => {
    const dispatch = useDispatch();

    const rowStatus = useSelector((state) => selectRowStatus(state, experience.id));
    const rowError = useSelector((state) => selectRowError(state, experience.id));

    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors, isDirty },
    } = useForm({
        resolver: zodResolver(experienceItemSchema),
        defaultValues: {
            company: experience.company || "",
            position: experience.position || "",
            employment_type: experience.employment_type || "",
            location: experience.location || "",
            start_date: experience.start_date || "",
            end_date: experience.end_date || "",
            is_current: experience.is_current || false,
            description: experience.description || "",
            responsibilities: experience.responsibilities || "",
        },
    });

    const isCurrent = watch("is_current");
    const isSaving = rowStatus === "pending";

    /** Save this card — create if new, update if existing */
    const onSubmit = async (data) => {
        try {
            if (isNew) {
                const created = await dispatch(addExperience(data)).unwrap();
                toast.success("Experience added");
                onSaved?.(created);
            } else {
                await dispatch(
                    editExperience({ id: experience.id, experienceData: data })
                ).unwrap();
                toast.success("Experience updated");
            }
        } catch (err) {
            // rowError is already set in the slice; just show a toast
            const message = typeof err === "string" ? err : err?.message;
            toast.error(message || "Failed to save experience");
        }
    };

    /** Delete this card from the backend */
    const handleDelete = async () => {
        if (isNew) {
            onCancelNew?.();
            return;
        }
        try {
            await dispatch(removeExperience(experience.id)).unwrap();
            toast.success("Experience removed");
        } catch (err) {
            const message = typeof err === "string" ? err : err?.message;
            toast.error(message || "Failed to delete experience");
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
        >
            {rowError && (
                <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                    {rowError}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <Label htmlFor={`company-${experience.id}`}>Company</Label>
                    <div className="relative">
                        <Building2
                            size={18}
                            className="absolute left-3 top-3 text-zinc-500"
                        />
                        <Input
                            id={`company-${experience.id}`}
                            className="pl-10"
                            placeholder="Google"
                            {...register("company")}
                        />
                    </div>
                    {errors.company && (
                        <p className="mt-1 text-xs text-red-400">
                            {errors.company.message}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor={`position-${experience.id}`}>Position</Label>
                    <Input
                        id={`position-${experience.id}`}
                        placeholder="Software Engineer"
                        {...register("position")}
                    />
                    {errors.position && (
                        <p className="mt-1 text-xs text-red-400">
                            {errors.position.message}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor={`employment_type-${experience.id}`}>
                        Employment Type
                    </Label>
                    <Input
                        id={`employment_type-${experience.id}`}
                        placeholder="Full-time"
                        {...register("employment_type")}
                    />
                </div>

                <div>
                    <Label htmlFor={`location-${experience.id}`}>Location</Label>
                    <div className="relative">
                        <MapPin
                            size={18}
                            className="absolute left-3 top-3 text-zinc-500"
                        />
                        <Input
                            id={`location-${experience.id}`}
                            className="pl-10"
                            placeholder="Bangalore, India"
                            {...register("location")}
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor={`start_date-${experience.id}`}>Start Date</Label>
                    <div className="relative">
                        <CalendarDays
                            size={18}
                            className="absolute left-3 top-3 text-zinc-500"
                        />
                        <Input
                            id={`start_date-${experience.id}`}
                            type="date"
                            className="pl-10"
                            {...register("start_date")}
                        />
                    </div>
                    {errors.start_date && (
                        <p className="mt-1 text-xs text-red-400">
                            {errors.start_date.message}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor={`end_date-${experience.id}`}>End Date</Label>
                    <div className="relative">
                        <CalendarDays
                            size={18}
                            className="absolute left-3 top-3 text-zinc-500"
                        />
                        <Input
                            id={`end_date-${experience.id}`}
                            type="date"
                            className="pl-10"
                            disabled={isCurrent}
                            {...register("end_date")}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
                <Controller
                    name="is_current"
                    control={control}
                    render={({ field }) => (
                        <Checkbox
                            id={`currentJob-${experience.id}`}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    )}
                />
                <Label htmlFor={`currentJob-${experience.id}`}>
                    I currently work here
                </Label>
            </div>

            <div className="mt-6">
                <Label htmlFor={`description-${experience.id}`}>Description</Label>
                <Textarea
                    id={`description-${experience.id}`}
                    rows={4}
                    placeholder="Briefly describe your role, technologies, and responsibilities."
                    {...register("description")}
                />
            </div>

            <div className="mt-6">
                <Label htmlFor={`responsibilities-${experience.id}`}>
                    Responsibilities / Achievements
                </Label>
                <Textarea
                    id={`responsibilities-${experience.id}`}
                    rows={6}
                    placeholder={`• Developed scalable web applications\n• Improved API performance by 40%\n• Led a team of 5 developers`}
                    {...register("responsibilities")}
                />
            </div>

            <div className="mt-8 flex items-center justify-end gap-3">
                <motion.div whileTap={{ scale: 0.97 }}>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isSaving}
                    >
                        <Trash2 size={16} className="mr-1" />
                        {isNew ? "Cancel" : "Remove"}
                    </Button>
                </motion.div>

                <motion.div whileTap={{ scale: 0.97 }}>
                    <Button
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSaving || (!isNew && !isDirty)}
                    >
                        {isSaving && (
                            <Loader2 size={16} className="mr-2 animate-spin" />
                        )}
                        {isNew ? "Save" : "Update"}
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ExperienceCard;
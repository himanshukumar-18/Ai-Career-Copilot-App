import { motion } from "framer-motion";
import {
    Building2,
    CalendarDays,
    MapPin,
    Trash2,
    Loader2,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../../ui/Button";
import Checkbox from "../../ui/Checkbox";
import Input from "../../ui/Input";
import Label from "../../ui/Label";
import Textarea from "../../ui/Textarea";

import { experienceSchema } from "../../../lib/validations/experienceSchema";
import {
    selectRowStatus,
    selectRowError,
} from "../../../features/experience/experienceSelectors";

/**
 * One experience entry. Builds form data and hands saving/deleting off to
 * the parent (ExperienceSection) via onSave/onDelete — it does not dispatch
 * anything itself. This mirrors the EducationSection/EducationCard pattern
 * used elsewhere in the app.
 *
 * @param {Object} props
 * @param {Object} props.experience - Experience data (may be a blank draft with a localId)
 * @param {string} [props.resumeId] - Resume this card belongs to (display/context only)
 * @param {boolean} [props.isNew] - True if this card hasn't been saved yet
 * @param {boolean} [props.isSaving] - True while a save is in flight for a new card
 * @param {(formData: Object) => void} props.onSave - Called with form data on Save/Update
 * @param {() => void} props.onDelete - Called to remove/delete this card
 * @param {() => void} [props.onCancelNew] - Called to discard an unsaved draft
 */
const ExperienceCard = ({
    experience,
    isNew = false,
    isSaving = false,
    onSave,
    onDelete,
    onCancelNew,
}) => {
    // New drafts don't have a real id yet — fall back to localId so every
    // field/label in this card still gets a stable, unique identifier.
    const fieldKey = experience.id ?? experience.localId;

    // Once a card has a real id (i.e. it's been saved), the slice tracks
    // its own edit/delete status by id. Drafts (isNew) don't have an id
    // yet, so their "saving" state comes from the isSaving prop instead
    // (driven by addStatus in the parent).
    const rowStatus = useSelector((state) =>
        selectRowStatus(state, experience.id)
    );
    const rowError = useSelector((state) =>
        selectRowError(state, experience.id)
    );

    const isRowBusy = !isNew && rowStatus === "pending";
    const isBusy = isSaving || isRowBusy;

    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors, isDirty },
    } = useForm({
        resolver: zodResolver(experienceSchema),
        defaultValues: {
            company: experience.company || "",
            position: experience.position || "",
            employment_type: experience.employment_type || "full_time",
            location: experience.location || "",
            start_date: experience.start_date || "",
            end_date: experience.end_date || "",
            currently_working: experience.currently_working || false,
            description: experience.description || "",
        },
    });

    const isCurrentlyWorking = watch("currently_working");

    const onSubmit = (formData) => {
        onSave?.(formData);
    };

    const handleDelete = () => {
        if (isNew) {
            onCancelNew?.();
            return;
        }

        onDelete?.();
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="border border-zinc-800 bg-zinc-900 p-6"
        >
            {rowError && (
                <div className="mb-4 border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                    {rowError}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <Label htmlFor={`company-${fieldKey}`}>Company</Label>
                    <div className="relative">
                        <Building2
                            size={18}
                            className="absolute left-3 top-3 text-zinc-500"
                        />
                        <Input
                            id={`company-${fieldKey}`}
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
                    <Label htmlFor={`position-${fieldKey}`}>Position</Label>
                    <Input
                        id={`position-${fieldKey}`}
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
                    <Label htmlFor={`employment_type-${fieldKey}`}>
                        Employment Type
                    </Label>
                    <Input
                        id={`employment_type-${fieldKey}`}
                        placeholder="Full-time"
                        {...register("employment_type")}
                    />
                </div>

                <div>
                    <Label htmlFor={`location-${fieldKey}`}>Location</Label>
                    <div className="relative">
                        <MapPin
                            size={18}
                            className="absolute left-3 top-3 text-zinc-500"
                        />
                        <Input
                            id={`location-${fieldKey}`}
                            className="pl-10"
                            placeholder="Bangalore, India"
                            {...register("location")}
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor={`start_date-${fieldKey}`}>Start Date</Label>
                    <div className="relative">
                        <CalendarDays
                            size={18}
                            className="absolute left-3 top-3 text-zinc-500"
                        />
                        <Input
                            id={`start_date-${fieldKey}`}
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
                    <Label htmlFor={`end_date-${fieldKey}`}>End Date</Label>
                    <div className="relative">
                        <CalendarDays
                            size={18}
                            className="absolute left-3 top-3 text-zinc-500"
                        />
                        <Input
                            id={`end_date-${fieldKey}`}
                            type="date"
                            className="pl-10"
                            disabled={isCurrentlyWorking}
                            {...register("end_date")}
                        />
                    </div>
                    {errors.end_date && (
                        <p className="mt-1 text-xs text-red-400">
                            {errors.end_date.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
                <Controller
                    name="currently_working"
                    control={control}
                    render={({ field }) => (
                        <Checkbox
                            id={`currentJob-${fieldKey}`}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    )}
                />
                <Label htmlFor={`currentJob-${fieldKey}`}>
                    I currently work here
                </Label>
            </div>

            <div className="mt-6">
                <Label htmlFor={`description-${fieldKey}`}>Description</Label>
                <Textarea
                    id={`description-${fieldKey}`}
                    rows={4}
                    placeholder={`• Developed scalable web applications\n• Improved API performance by 40%\n• Led a team of 5 developers`}
                    {...register("description")}
                />
            </div>

            <div className="mt-8 flex items-center justify-end gap-3">
                <motion.div whileTap={{ scale: 0.97 }}>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isBusy}
                    >
                        <Trash2 size={16} className="mr-1" />
                        {isNew ? "Cancel" : "Remove"}
                    </Button>
                </motion.div>

                <motion.div whileTap={{ scale: 0.97 }}>
                    <Button
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isBusy || (!isNew && !isDirty)}
                    >
                        {isBusy && (
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
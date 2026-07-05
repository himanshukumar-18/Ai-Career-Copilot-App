import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BriefcaseBusiness, Loader2, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import Button from "../../ui/Button";
import ExperienceCard from "../card/ExperienceCard";

import { fetchExperiences } from "../../../features/experience/experienceThunk";
import { clearExperienceError } from "../../../features/experience/experienceSlice";
import {
    selectExperiences,
    selectExperienceStatus,
    selectExperienceError,
} from "../../../features/experience/experienceSelectors";

let draftCounter = 0;
/** Makes a unique id for a new draft card, even if two are added in the same millisecond. */
const makeDraftId = () => {
    draftCounter += 1;
    return `draft-${Date.now()}-${draftCounter}`;
};

/**
 * Work experience section. Loads saved experiences from the backend
 * and lets the user add, edit, or remove entries one at a time.
 */
const ExperienceSection = () => {
    const dispatch = useDispatch();

    const experiences = useSelector(selectExperiences);
    const status = useSelector(selectExperienceStatus);
    const error = useSelector(selectExperienceError);

    // Blank cards the user is filling in but hasn't saved yet
    const [drafts, setDrafts] = useState([]);

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchExperiences());
        }
    }, [dispatch, status]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearExperienceError());
        }
    }, [error, dispatch]);

    /** Add a blank draft card to the bottom of the list */
    const handleAddDraft = () => {
        setDrafts((prev) => [
            ...prev,
            {
                localId: makeDraftId(),
                company: "",
                position: "",
                employment_type: "",
                location: "",
                start_date: "",
                end_date: "",
                is_current: false,
                description: "",
                responsibilities: "",
            },
        ]);
    };

    /** Remove a draft card, whether saved or cancelled */
    const removeDraft = (localId) => {
        setDrafts((prev) => prev.filter((d) => d.localId !== localId));
    };

    const isLoading = status === "pending" && experiences.length === 0;
    const isEmpty = !isLoading && experiences.length === 0 && drafts.length === 0;

    return (
        <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full"
        >
            <div className="border border-zinc-800 bg-zinc-950">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <BriefcaseBusiness
                            className="text-zinc-500"
                            size={18}
                            aria-hidden="true"
                        />
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Experience
                            </h2>
                            <p className="mt-1 text-xs text-zinc-500">
                                Roles that shaped how you work.
                            </p>
                        </div>
                    </div>

                    <motion.div whileTap={{ scale: 0.97 }}>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddDraft}
                            disabled={isLoading}
                            className="h-9 px-4 text-xs uppercase tracking-[0.1em]"
                        >
                            <Plus size={14} />
                            Add role
                        </Button>
                    </motion.div>
                </div>

                {/* Body */}
                <div className="space-y-5 p-5 sm:p-6">
                    {isLoading && (
                        <div className="flex items-center justify-center py-16 text-sm text-zinc-500">
                            <Loader2 size={20} className="mr-2 animate-spin" />
                            Loading experiences...
                        </div>
                    )}

                    <AnimatePresence>
                        {isEmpty ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="border border-dashed border-zinc-700 py-16 text-center"
                            >
                                <BriefcaseBusiness
                                    size={40}
                                    className="mx-auto text-zinc-700"
                                    aria-hidden="true"
                                />
                                <h3 className="mt-4 text-sm font-semibold text-zinc-300">
                                    No experience added
                                </h3>
                                <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-zinc-500">
                                    Add your professional work experience to highlight your
                                    career journey.
                                </p>
                            </motion.div>
                        ) : (
                            <>
                                {experiences.map((experience) => (
                                    <ExperienceCard key={experience.id} experience={experience} />
                                ))}

                                {drafts.map((draft) => (
                                    <ExperienceCard
                                        key={draft.localId}
                                        experience={draft}
                                        isNew
                                        onSaved={() => removeDraft(draft.localId)}
                                        onCancelNew={() => removeDraft(draft.localId)}
                                    />
                                ))}
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.section>
    );
};

export default ExperienceSection;
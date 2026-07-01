import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BriefcaseBusiness, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import Button from "../../ui/Button";
import ExperienceCard from "../card/ExperienceCard";

import {
    fetchExperiences,
    clearExperienceError,
    selectExperiences,
    selectExperienceStatus,
    selectExperienceError,
} from "@/features/experience/experienceSlice";

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
                localId: `draft-${Date.now()}`,
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 shadow-xl">
                {/* Header */}
                <div className="border-b border-zinc-800 px-8 py-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                            <BriefcaseBusiness className="text-blue-500" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                Work Experience
                            </h2>
                            <p className="mt-1 text-sm text-zinc-400">
                                Showcase your professional work experience and career
                                achievements.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="space-y-6 p-8">
                    {isLoading && (
                        <div className="flex items-center justify-center py-16 text-zinc-500">
                            <Loader2 size={24} className="mr-2 animate-spin" />
                            Loading experiences...
                        </div>
                    )}

                    <AnimatePresence>
                        {isEmpty ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="rounded-xl border border-dashed border-zinc-700 py-16 text-center"
                            >
                                <BriefcaseBusiness
                                    size={48}
                                    className="mx-auto text-zinc-600"
                                />
                                <h3 className="mt-5 text-xl font-semibold text-white">
                                    No Experience Added
                                </h3>
                                <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
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

                    <motion.div whileTap={{ scale: 0.98 }}>
                        <Button type="button" onClick={handleAddDraft}>
                            Add Experience
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
};

export default ExperienceSection;
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BriefcaseBusiness, Loader2, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import Button from "../../ui/Button";
import ExperienceCard from "../card/ExperienceCard";

import {
    addExperience,
    editExperience,
    fetchExperiences,
    removeExperience,
} from "../../../features/experience/experienceThunk";

import {
    clearAddError,
    clearExperienceError,
} from "../../../features/experience/experienceSlice";

import {
    selectAddExperienceError,
    selectAddExperienceStatus,
    selectExperienceError,
    selectExperiences,
    selectExperienceStatus,
} from "../../../features/experience/experienceSelectors";

let draftCounter = 0;

const createDraft = () => {
    draftCounter += 1;

    return {
        localId: `draft-${Date.now()}-${draftCounter}`,
        company: "",
        position: "",
        employment_type: "full_time",
        location: "",
        start_date: "",
        end_date: "",
        currently_working: false,
        description: "",
        display_order: 0,
    };
};

const ExperienceSection = () => {
    const dispatch = useDispatch();
    const { resumeId } = useParams();

    const experiences = useSelector(selectExperiences);
    const fetchStatus = useSelector(selectExperienceStatus);
    const fetchError = useSelector(selectExperienceError);
    const addStatus = useSelector(selectAddExperienceStatus);
    const addError = useSelector(selectAddExperienceError);

    const [drafts, setDrafts] = useState([]);

    const isLoading =
        fetchStatus === "pending" && experiences.length === 0;

    const isEmpty =
        !isLoading &&
        experiences.length === 0 &&
        drafts.length === 0;

    // Fails loudly in the console the moment the route param is wrong,
    // instead of quietly sending NaN/null to the API later.
    useEffect(() => {
        if (resumeId && Number.isNaN(Number(resumeId))) {
            // eslint-disable-next-line no-console
            console.error(
                "ExperienceSection: resumeId from the URL is not a valid number:",
                resumeId
            );
        }
    }, [resumeId]);

    useEffect(() => {
        if (resumeId) {
            dispatch(fetchExperiences(resumeId));
        }
    }, [dispatch, resumeId]);

    useEffect(() => {
        if (!fetchError) return;

        toast.error(fetchError);
        dispatch(clearExperienceError());
    }, [dispatch, fetchError]);

    useEffect(() => {
        if (!addError) return;

        toast.error(addError);
        dispatch(clearAddError());
    }, [addError, dispatch]);

    const removeDraft = (localId) => {
        setDrafts((current) =>
            current.filter((draft) => draft.localId !== localId)
        );
    };

    const addDraft = () => {
        if (!resumeId) {
            toast.error("Resume ID is missing.");
            return;
        }

        setDrafts((current) => [...current, createDraft()]);
    };

    const normalizePayload = (formData) => ({
        company: formData.company.trim(),
        position: formData.position.trim(),
        employment_type: formData.employment_type || "full_time",
        location: formData.location?.trim() || "",
        start_date: formData.start_date,
        end_date: formData.currently_working
            ? null
            : formData.end_date || null,
        currently_working: Boolean(formData.currently_working),
        description: formData.description?.trim() || "",
        display_order: Number(formData.display_order || 0),
    });

    const saveExperience = async (item, formData) => {
        const numericResumeId = Number(resumeId);

        // Guard: never let a missing or malformed resumeId reach the API.
        // Number(undefined) is NaN, and NaN silently turns into `null`
        // when JSON.stringify runs on the request body — which used to
        // cause a confusing 500 on the backend instead of a clear error
        // here where it's actually easy to diagnose.
        if (!resumeId || Number.isNaN(numericResumeId)) {
            toast.error(
                "Resume ID is missing or invalid. Please reload the page."
            );
            // eslint-disable-next-line no-console
            console.error(
                "ExperienceSection: resumeId from useParams() is invalid:",
                resumeId
            );
            return;
        }

        const payload = normalizePayload(formData);

        try {
            if (item.id) {
                await dispatch(
                    editExperience({
                        id: item.id,
                        payload,
                    })
                ).unwrap();

                toast.success("Experience updated.");
                return;
            }

            await dispatch(
                addExperience({
                    ...payload,
                    resume: numericResumeId,
                })
            ).unwrap();

            removeDraft(item.localId);
            toast.success("Experience added.");
        } catch (error) {
            toast.error(
                error?.message ||
                error ||
                "Unable to save experience."
            );
        }
    };

    const deleteExperience = async (item) => {
        if (!item.id) {
            removeDraft(item.localId);
            return;
        }

        try {
            await dispatch(removeExperience(item.id)).unwrap();
            toast.success("Experience removed.");
        } catch (error) {
            toast.error(
                error?.message ||
                error ||
                "Unable to remove experience."
            );
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full"
        >
            <div className="border border-zinc-800 bg-zinc-950">
                <header className="flex flex-col gap-4 border-b border-zinc-800 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center border border-zinc-800 bg-black text-zinc-400">
                            <BriefcaseBusiness size={15} />
                        </span>

                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                                Resume section
                            </p>

                            <h2 className="mt-1 text-xl font-semibold text-white">
                                Experience
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500">
                                Add jobs, internships, freelance work, and
                                relevant professional experience.
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={addDraft}
                        disabled={isLoading || addStatus === "pending"}
                        className="h-10 shrink-0 px-4 text-xs"
                    >
                        <Plus size={15} />
                        Add experience
                    </Button>
                </header>

                <div className="space-y-5 p-5 sm:p-6">
                    {isLoading && (
                        <div className="flex min-h-56 items-center justify-center gap-3 text-sm text-zinc-500">
                            <Loader2 size={18} className="animate-spin" />
                            Loading experiences...
                        </div>
                    )}

                    <AnimatePresence initial={false}>
                        {isEmpty && (
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                className="border border-dashed border-zinc-700 px-5 py-16 text-center"
                            >
                                <BriefcaseBusiness
                                    size={38}
                                    className="mx-auto text-zinc-700"
                                />

                                <h3 className="mt-4 text-sm font-semibold text-zinc-300">
                                    No experience added yet
                                </h3>

                                <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-zinc-500">
                                    Add your work history to show recruiters
                                    your responsibilities and impact.
                                </p>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addDraft}
                                    className="mt-5 h-9 px-4 text-xs"
                                >
                                    <Plus size={14} />
                                    Add your first role
                                </Button>
                            </motion.div>
                        )}

                        {experiences.map((experience) => (
                            <ExperienceCard
                                key={experience.id}
                                experience={experience}
                                resumeId={resumeId}
                                onSave={(formData) =>
                                    saveExperience(experience, formData)
                                }
                                onDelete={() =>
                                    deleteExperience(experience)
                                }
                            />
                        ))}

                        {drafts.map((draft) => (
                            <ExperienceCard
                                key={draft.localId}
                                experience={draft}
                                resumeId={resumeId}
                                isNew
                                isSaving={addStatus === "pending"}
                                onSave={(formData) =>
                                    saveExperience(draft, formData)
                                }
                                onDelete={() => deleteExperience(draft)}
                                onCancelNew={() =>
                                    removeDraft(draft.localId)
                                }
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </motion.section>
    );
};

export default ExperienceSection;
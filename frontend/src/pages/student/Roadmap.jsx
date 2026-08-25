import { useEffect, useState, useMemo } from "react";
import useCareerRoadmap from "../../features/careerRoadmap/useCareerRoadmap";
import CareerRoadmapHeader from "../../components/careerRoadmap/CareerRoadmapHeader";
import CareerRoleSelector from "../../components/careerRoadmap/CareerRoleSelector";
import RoadmapGenerateCard from "../../components/careerRoadmap/RoadmapGenerateCard";
import RoadmapProgressHeader from "../../components/careerRoadmap/RoadmapProgressHeader";
import NextStepCard from "../../components/careerRoadmap/NextStepCard";
import SkillGapAnalysis from "../../components/careerRoadmap/SkillGapAnalysis";
import RoadmapTimeline from "../../components/careerRoadmap/RoadmapTimeline";
import CompleteStepModal from "../../components/careerRoadmap/CompleteStepModal";
import RoadmapSkeleton from "../../components/careerRoadmap/RoadmapSkeleton";
import RoadmapError from "../../components/careerRoadmap/RoadmapError";
import RoadmapEmpty from "../../components/careerRoadmap/RoadmapEmpty";

const Roadmap = () => {
    const {
        roles,
        selectedRoleSlug,
        selectedRole,
        activeProgress,
        nextStepData,

        isRolesLoading,
        isGenerating,
        isProgressLoading,
        isCompleting,

        rolesError,
        generateError,
        progressError,

        fetchRoles,
        selectRole,
        generateAIRoadmap,
        fetchUserProgress,
        completeStep,
        fetchNextStep,
    } = useCareerRoadmap();

    const [modalStep, setModalStep] = useState(null);

    // 1. Initial load: Fetch available career roles
    useEffect(() => {
        fetchRoles().catch(() => {});
    }, [fetchRoles]);

    // 2. Fetch active progress when selected role changes
    useEffect(() => {
        if (selectedRoleSlug) {
            fetchUserProgress(selectedRoleSlug)
                .then(() => {
                    fetchNextStep(selectedRoleSlug).catch(() => {});
                })
                .catch(() => {});
        }
    }, [selectedRoleSlug, fetchUserProgress, fetchNextStep]);

    // Construct map of stepId -> stepProgress status & details for O(1) lookup
    const userStepProgressesMap = useMemo(() => {
        const map = {};
        if (activeProgress?.step_progresses) {
            activeProgress.step_progresses.forEach((sp) => {
                const stepId = sp.step?.id || sp.step;
                if (stepId) {
                    map[stepId] = sp;
                }
            });
        }
        return map;
    }, [activeProgress]);

    const handleGenerate = (roleSlug, force = false) => {
        generateAIRoadmap(roleSlug, force)
            .then(() => {
                fetchNextStep(roleSlug).catch(() => {});
            })
            .catch(() => {});
    };

    const handleConfirmCompleteStep = (stepId, notes) => {
        completeStep(stepId, notes)
            .then(() => {
                setModalStep(null);
                if (selectedRoleSlug) {
                    fetchUserProgress(selectedRoleSlug).catch(() => {});
                }
            })
            .catch(() => {});
    };

    const roadmap = activeProgress?.roadmap;
    const phases = roadmap?.phases || [];
    const skillGap = activeProgress?.skill_gap_analysis || {};

    return (
        <div className="space-y-8 pb-16">
            {/* Header */}
            <CareerRoadmapHeader
                activeRoleTitle={selectedRole?.title}
                onRegenerate={() => selectedRoleSlug && handleGenerate(selectedRoleSlug, true)}
                isGenerating={isGenerating}
            />

            {/* Role Selection */}
            {isRolesLoading ? (
                <RoadmapSkeleton />
            ) : (
                <CareerRoleSelector
                    roles={roles}
                    selectedRoleSlug={selectedRoleSlug}
                    onSelectRole={(slug) => selectRole(slug)}
                    onGenerate={(slug) => handleGenerate(slug, false)}
                    isGenerating={isGenerating}
                    rolesError={rolesError}
                    onRetry={() => fetchRoles().catch(() => {})}
                />
            )}

            {/* AI Generation State */}
            {isGenerating && (
                <RoadmapGenerateCard roleTitle={selectedRole?.title} />
            )}

            {/* Errors */}
            {(generateError || (progressError && progressError.status !== 404)) && (
                <RoadmapError
                    error={generateError || progressError}
                    onRetry={() => selectedRoleSlug && handleGenerate(selectedRoleSlug, true)}
                />
            )}

            {/* Active Roadmap Display */}
            {!isGenerating && activeProgress && roadmap ? (
                <div className="space-y-8">
                    {/* Overall Progress Header */}
                    <RoadmapProgressHeader progress={activeProgress} roadmap={roadmap} />

                    {/* Next Recommended Step Banner */}
                    <NextStepCard
                        nextStepData={nextStepData}
                        onCompleteStep={(step) => setModalStep(step)}
                        isCompleting={isCompleting}
                    />

                    {/* Skill Gap Diagnostic */}
                    <SkillGapAnalysis skillGap={skillGap} />

                    {/* Phase Accordion Timeline */}
                    <RoadmapTimeline
                        phases={phases}
                        userStepProgressesMap={userStepProgressesMap}
                        onCompleteStep={(step) => setModalStep(step)}
                        isCompleting={isCompleting}
                    />
                </div>
            ) : (
                !isGenerating && !isProgressLoading && progressError?.status === 404 && (
                    <RoadmapEmpty onSelectRole={(slug) => handleGenerate(slug, false)} />
                )
            )}

            {/* Step Completion Modal */}
            <CompleteStepModal
                isOpen={!!modalStep}
                step={modalStep}
                onClose={() => setModalStep(null)}
                onConfirm={handleConfirmCompleteStep}
                isSubmitting={isCompleting}
            />
        </div>
    );
};

export default Roadmap;
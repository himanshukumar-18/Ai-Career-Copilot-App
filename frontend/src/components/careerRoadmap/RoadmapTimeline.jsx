import RoadmapPhaseCard from "./RoadmapPhaseCard";

const RoadmapTimeline = ({
    phases = [],
    userStepProgressesMap = {},
    onCompleteStep,
    isCompleting,
}) => {
    if (!phases.length) {
        return (
            <div className="border border-zinc-800 bg-[var(--surface)] p-8 text-center text-sm text-zinc-500">
                No roadmap phases found. Please generate a personalized roadmap above.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                    <h3 className="text-lg font-bold uppercase tracking-wider text-white">
                        Learning Phases & Steps
                    </h3>
                    <p className="text-xs text-zinc-400">
                        Sequential milestone progression mapped by AI mentor.
                    </p>
                </div>
                <span className="font-mono text-xs text-zinc-500">
                    {phases.length} Phases Total
                </span>
            </div>

            <div className="space-y-6">
                {phases.map((phase) => (
                    <RoadmapPhaseCard
                        key={phase.id}
                        phase={phase}
                        userStepProgressesMap={userStepProgressesMap}
                        onCompleteStep={onCompleteStep}
                        isCompleting={isCompleting}
                    />
                ))}
            </div>
        </div>
    );
};

export default RoadmapTimeline;

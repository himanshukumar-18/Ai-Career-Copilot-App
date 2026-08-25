const RoadmapSkeleton = () => {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-32 border border-zinc-800 bg-[var(--surface)] p-6">
                <div className="h-6 w-1/3 bg-zinc-800 mb-4"></div>
                <div className="h-4 w-2/3 bg-zinc-800"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-28 border border-zinc-800 bg-[var(--surface)] p-4"></div>
                <div className="h-28 border border-zinc-800 bg-[var(--surface)] p-4"></div>
                <div className="h-28 border border-zinc-800 bg-[var(--surface)] p-4"></div>
            </div>

            <div className="h-64 border border-zinc-800 bg-[var(--surface)] p-6"></div>
        </div>
    );
};

export default RoadmapSkeleton;

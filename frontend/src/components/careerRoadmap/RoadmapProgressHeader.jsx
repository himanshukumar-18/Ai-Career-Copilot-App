import { Award, Clock, BookOpen, Layers } from "lucide-react";

const RoadmapProgressHeader = ({ progress, roadmap }) => {
    if (!progress || !roadmap) return null;

    const percentage = Number(progress.completion_percentage || 0);
    const totalPhases = roadmap.total_phases || roadmap.phases?.length || 0;

    return (
        <div className="border border-zinc-800 bg-[var(--surface)] p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                        {roadmap.career_role?.title || "Career Path"}
                    </span>
                    <h2 className="text-xl font-bold uppercase tracking-wider text-white">
                        {roadmap.title}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-xs text-zinc-400 max-w-2xl">
                        {roadmap.description}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:shrink-0">
                    <div className="border border-zinc-800 bg-zinc-900/60 p-3 text-center">
                        <span className="text-[10px] font-mono uppercase text-zinc-500">Progress</span>
                        <div className="mt-1 text-lg font-bold text-red-400">{percentage}%</div>
                    </div>
                    <div className="border border-zinc-800 bg-zinc-900/60 p-3 text-center">
                        <span className="text-[10px] font-mono uppercase text-zinc-500">Phases</span>
                        <div className="mt-1 text-lg font-bold text-white">{totalPhases}</div>
                    </div>
                    <div className="border border-zinc-800 bg-zinc-900/60 p-3 text-center">
                        <span className="text-[10px] font-mono uppercase text-zinc-500">Status</span>
                        <div className="mt-1 text-xs font-bold uppercase text-emerald-400">
                            {progress.status?.replace("_", " ")}
                        </div>
                    </div>
                    <div className="border border-zinc-800 bg-zinc-900/60 p-3 text-center">
                        <span className="text-[10px] font-mono uppercase text-zinc-500">Version</span>
                        <div className="mt-1 font-mono text-xs font-bold text-zinc-300">
                            {roadmap.version || "1.0"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
                <div className="mb-2 flex justify-between font-mono text-xs text-zinc-400">
                    <span>Overall Mastery Progress</span>
                    <span className="text-red-400 font-bold">{percentage}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-900 overflow-hidden border border-zinc-800">
                    <div
                        className="h-full bg-red-600 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default RoadmapProgressHeader;

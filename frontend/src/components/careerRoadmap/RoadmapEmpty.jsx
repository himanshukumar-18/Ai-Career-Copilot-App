import { Sparkles, MapPin } from "lucide-react";

const RoadmapEmpty = ({ onSelectRole }) => {
    return (
        <div className="flex flex-col items-center justify-center border border-zinc-800 bg-[var(--surface)] p-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center border border-red-500/30 bg-red-500/10 text-red-500">
                <MapPin className="h-8 w-8" />
            </div>
            <h3 className="mt-6 text-xl font-bold uppercase tracking-wider text-white">
                No Active Career Roadmap Selected
            </h3>
            <p className="mt-2 max-w-md text-xs text-zinc-400">
                Select your target career goal above to synthesize your AI-personalized learning roadmap and skill gap analysis.
            </p>
        </div>
    );
};

export default RoadmapEmpty;

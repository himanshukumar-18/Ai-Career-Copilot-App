import { AlertTriangle, RefreshCw } from "lucide-react";

const RoadmapError = ({ error, onRetry }) => {
    const message = error?.message || "Failed to load career roadmap data.";

    return (
        <div className="flex flex-col items-center justify-center border border-red-500/30 bg-red-500/5 p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center border border-red-500/40 bg-red-500/10 text-red-500">
                <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold uppercase tracking-wider text-white">
                Roadmap Generation Error
            </h3>
            <p className="mt-2 max-w-md text-xs text-zinc-400">
                {message}
            </p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-6 flex items-center gap-2 border border-red-500 bg-red-600 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-500"
                >
                    <RefreshCw className="h-4 w-4" />
                    <span>Try Again</span>
                </button>
            )}
        </div>
    );
};

export default RoadmapError;

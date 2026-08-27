import { useNavigate } from "react-router-dom";
import { FolderGit2, ArrowUpRight, Code2 } from "lucide-react";

const RoadmapProjectCard = ({ projectTitle, techStack = [], difficulty = "Intermediate" }) => {
    const navigate = useNavigate();

    return (
        <div className="border border-red-500/30 bg-red-500/5 p-4 transition-colors hover:border-red-500/60">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-red-400">
                    <FolderGit2 className="h-4 w-4" />
                    <span className="font-mono text-[10px] uppercase tracking-widest">
                        Project-Lab Benchmark
                    </span>
                </div>
                <span className="border border-zinc-800 bg-zinc-900 px-2 py-0.5 font-mono text-[10px] uppercase text-zinc-400">
                    {difficulty}
                </span>
            </div>

            <h5 className="mt-2 text-sm font-bold text-white">
                {projectTitle}
            </h5>

            {techStack.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                    {techStack.map((tech, idx) => (
                        <span
                            key={idx}
                            className="border border-zinc-800 bg-zinc-900 px-2 py-0.5 font-mono text-[10px] text-zinc-400"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            )}

            <button
                onClick={() => navigate("/project-lab")}
                className="mt-4 flex w-full items-center justify-center gap-2 border border-red-500/40 bg-red-600/20 py-2 text-xs font-bold uppercase tracking-wider text-red-300 transition-colors hover:bg-red-600 hover:text-white"
            >
                <span>Execute in Project-Lab</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
        </div>
    );
};

export default RoadmapProjectCard;

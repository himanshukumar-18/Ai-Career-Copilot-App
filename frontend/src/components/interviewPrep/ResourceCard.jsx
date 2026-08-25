import React from "react";
import { ExternalLink, BookOpen, Video, FileText, Code } from "lucide-react";

const getResourceIcon = (type) => {
    switch (type) {
        case "video":
            return <Video size={14} className="text-red-400" />;
        case "course":
        case "tutorial":
            return <BookOpen size={14} className="text-blue-400" />;
        case "practice_platform":
            return <Code size={14} className="text-green-400" />;
        default:
            return <FileText size={14} className="text-[var(--accent-light)]" />;
    }
};

const ResourceCard = ({ resource }) => {
    const { title, url, provider, resource_type, is_free, difficulty } = resource;

    return (
        <div className="border border-[var(--border)] bg-[var(--background)] p-4 hover:border-white/40 transition-all flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-[var(--text-muted)]">
                        {getResourceIcon(resource_type)}
                        {provider || "Official Docs"}
                    </span>
                    <div className="flex items-center gap-2">
                        {is_free && (
                            <span className="text-[9px] font-mono text-[var(--success)] bg-[var(--success)]/10 px-1.5 py-0.5 border border-[var(--success)]/20 uppercase">
                                Free
                            </span>
                        )}
                        <span className="text-[9px] font-mono text-[var(--text-muted)] border border-[var(--border)] px-1.5 py-0.5 uppercase">
                            {difficulty}
                        </span>
                    </div>
                </div>

                <h4 className="text-sm font-bold text-white mb-2 line-clamp-2 leading-snug">
                    {title}
                </h4>
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex justify-end">
                <a
                    href={url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono text-[var(--accent-light)] hover:text-white uppercase tracking-wider transition-colors"
                >
                    <span>Access Resource</span>
                    <ExternalLink size={12} />
                </a>
            </div>
        </div>
    );
};

export default ResourceCard;

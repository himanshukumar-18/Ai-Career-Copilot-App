import { CalendarDays, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const ResumeStatus = ({
    template = "Modern",
    updatedAt,
}) => {
    const lastUpdated = updatedAt
        ? formatDistanceToNow(new Date(updatedAt), {
            addSuffix: true,
        })
        : "Recently";

    return (
        <div className="space-y-4">
            {/* Template */}
            <div className="flex items-center gap-2 text-sm text-zinc-400">
                <FileText
                    size={16}
                    className="text-zinc-500"
                />

                <span className="truncate">
                    {template} Template
                </span>
            </div>

            {/* Last Updated */}
            <div className="flex items-center gap-2 text-sm text-zinc-400">
                <CalendarDays
                    size={16}
                    className="text-zinc-500"
                />

                <span>
                    Updated {lastUpdated}
                </span>
            </div>
        </div>
    );
};

export default ResumeStatus;
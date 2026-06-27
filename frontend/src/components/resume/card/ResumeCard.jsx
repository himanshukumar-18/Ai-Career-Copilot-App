import { motion } from "framer-motion";
import { FileText } from "lucide-react";

import ResumeActionMenu from "./ResumeActionsMenu";
import ResumeBadge from "./ResumeBadge";
import ResumeProgress from "./ResumeProgress";
import ResumeStatus from "./ResumeStatus";

const ResumeCard = ({
    resume,

    onEdit,
    onDelete,
    onDuplicate,
    onPublish,
    onUnpublish,
    onSetDefault,
}) => {
    return (
        <motion.div
            layout
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="
        group
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-950
        p-6
        transition-all
        duration-300
        hover:border-red-600/40
      "
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                        <div
                            className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-zinc-800
                bg-zinc-900
              "
                        >
                            <FileText
                                size={20}
                                className="text-red-500"
                            />
                        </div>

                        <div className="min-w-0">
                            <h3
                                className="
                  truncate
                  text-lg
                  font-semibold
                  text-white
                "
                            >
                                {resume.title}
                            </h3>

                            <p className="mt-1 text-sm text-zinc-500">
                                Professional Resume
                            </p>
                        </div>
                    </div>
                </div>

                <ResumeActionMenu
                    resume={resume}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                    onPublish={onPublish}
                    onUnpublish={onUnpublish}
                    onSetDefault={onSetDefault}
                />
            </div>

            {/* Badges */}
            <div className="mt-6 flex flex-wrap gap-2">
                <ResumeBadge>
                    {resume.template || "Modern"}
                </ResumeBadge>

                {resume.is_default && (
                    <ResumeBadge variant="primary">
                        Default
                    </ResumeBadge>
                )}

                {resume.is_published ? (
                    <ResumeBadge variant="success">
                        Published
                    </ResumeBadge>
                ) : (
                    <ResumeBadge variant="warning">
                        Draft
                    </ResumeBadge>
                )}
            </div>

            {/* Status */}
            <div className="mt-6">
                <ResumeStatus
                    template={resume.template}
                    updatedAt={resume.updated_at}
                />
            </div>

            {/* Progress */}
            <div className="mt-6">
                <ResumeProgress
                    value={resume.completion_percentage || 0}
                />
            </div>
        </motion.div>
    );
};

export default ResumeCard;
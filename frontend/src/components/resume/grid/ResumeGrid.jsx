import { motion, AnimatePresence } from "framer-motion";

import ResumeCard from "../card/ResumeCard";

const ResumeGrid = ({
    resumes = [],
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
            className="
        grid
        grid-cols-1
        gap-6

        md:grid-cols-2

        xl:grid-cols-3

        2xl:grid-cols-4
      "
        >
            <AnimatePresence mode="popLayout">
                {resumes.map((resume) => (
                    <motion.div
                        key={resume.id}
                        layout
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{
                            duration: 0.25,
                        }}
                    >
                        <ResumeCard
                            resume={resume}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onDuplicate={onDuplicate}
                            onPublish={onPublish}
                            onUnpublish={onUnpublish}
                            onSetDefault={onSetDefault}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
};

export default ResumeGrid;
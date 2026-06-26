import { motion } from "framer-motion";

const SkeletonCard = () => (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
            <div className="space-y-3">
                <div className="h-5 w-40 animate-pulse rounded bg-zinc-800" />
                <div className="h-4 w-24 animate-pulse rounded bg-zinc-900" />
            </div>

            <div className="h-9 w-9 animate-pulse rounded-lg bg-zinc-900" />
        </div>

        {/* Progress */}
        <div className="mt-8">
            <div className="mb-2 flex items-center justify-between">
                <div className="h-3 w-24 animate-pulse rounded bg-zinc-900" />
                <div className="h-3 w-10 animate-pulse rounded bg-zinc-900" />
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-900">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-zinc-700" />
            </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between">
            <div className="space-y-2">
                <div className="h-3 w-24 animate-pulse rounded bg-zinc-900" />
                <div className="h-3 w-16 animate-pulse rounded bg-zinc-900" />
            </div>

            <div className="h-7 w-20 animate-pulse rounded-full bg-zinc-900" />
        </div>
    </div>
);

const ResumeSkeleton = ({ count = 6 }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="
        grid
        grid-cols-1
        gap-6

        md:grid-cols-2

        xl:grid-cols-3

        2xl:grid-cols-4
      "
        >
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </motion.div>
    );
};

export default ResumeSkeleton;
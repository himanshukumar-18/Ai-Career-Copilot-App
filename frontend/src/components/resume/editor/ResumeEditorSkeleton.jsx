import { motion } from "framer-motion";

const Skeleton = ({ className = "" }) => (
    <div className={`animate-pulse bg-zinc-800 ${className}`} />
);

const ResumeEditorSkeleton = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen bg-zinc-950"
        >
            {/* Header */}
            <div className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950">
                <div className="mx-auto flex h-20 max-w-[1800px] items-center justify-between px-6">
                    <div className="space-y-3">
                        <Skeleton className="h-6 w-56" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex gap-3">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </div>

            {/* Layout */}
            <div className="mx-auto flex max-w-[1800px] gap-6 p-6">

                {/* Sidebar */}
                <aside className="hidden w-80 border border-zinc-800 bg-zinc-950 p-6 lg:block">
                    <Skeleton className="mb-4 h-4 w-36" />
                    <Skeleton className="mb-2 h-2 w-full" />
                    <Skeleton className="mb-8 h-2 w-3/4" />
                    <Skeleton className="mb-6 h-10 w-full" />
                    <div className="space-y-2">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <Skeleton key={i} className="h-11 w-full" />
                        ))}
                    </div>
                </aside>

                {/* Editor */}
                <main className="flex-1 border border-zinc-800 bg-zinc-950 p-8">
                    <Skeleton className="mb-8 h-8 w-72" />
                    <div className="space-y-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i}>
                                <Skeleton className="mb-2 h-3 w-36" />
                                <Skeleton className="h-11 w-full" />
                            </div>
                        ))}
                    </div>
                    <div className="mt-10 flex justify-end">
                        <Skeleton className="h-11 w-36" />
                    </div>
                </main>

                {/* Preview */}
                <aside className="hidden w-[420px] border border-zinc-800 bg-zinc-950 xl:block">
                    <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-28" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-9 w-9" />
                            <Skeleton className="h-9 w-10" />
                            <Skeleton className="h-9 w-9" />
                            <Skeleton className="h-9 w-9" />
                        </div>
                    </div>
                    <div className="p-6">
                        <Skeleton className="h-[680px] w-full" />
                    </div>
                </aside>

            </div>
        </motion.div>
    );
};

export default ResumeEditorSkeleton;
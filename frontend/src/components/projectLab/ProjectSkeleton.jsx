import React from "react";
import Skeleton from "../ui/Skeleton";

export const ProjectSkeleton = ({ count = 6 }) => {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, idx) => (
                <div
                    key={idx}
                    className="flex flex-col justify-between border border-[var(--border)] bg-[var(--surface)] p-5"
                >
                    <div>
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-16" />
                        </div>
                        <Skeleton className="mt-4 h-6 w-3/4" />
                        <Skeleton className="mt-3 h-4 w-full" />
                        <Skeleton className="mt-1.5 h-4 w-5/6" />
                        <div className="mt-4 flex gap-2">
                            <Skeleton className="h-5 w-14" />
                            <Skeleton className="h-5 w-14" />
                            <Skeleton className="h-5 w-14" />
                        </div>
                    </div>
                    <div className="mt-6 border-t border-[var(--border)] pt-4">
                        <div className="mb-4 flex items-center justify-between">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-12" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-9 flex-1" />
                            <Skeleton className="h-9 w-10" />
                            <Skeleton className="h-9 w-10" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProjectSkeleton;

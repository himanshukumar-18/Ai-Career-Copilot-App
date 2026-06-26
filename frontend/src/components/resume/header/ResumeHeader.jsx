import { Search, Plus } from "lucide-react";
import { motion } from "framer-motion";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const ResumeHeader = ({
    searchTerm,
    setSearchTerm,
    onCreateResume,
    totalResumes = 0,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-8"
        >
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 backdrop-blur-sm p-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    {/* Left */}
                    <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                            Resume Builder
                        </p>

                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
                            Manage Your Resumes
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
                            Create, edit, organize and manage your professional resumes from
                            one place.
                        </p>

                        <div className="mt-5 inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2">
                            <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">
                                Total Resumes
                            </span>

                            <span className="ml-3 rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
                                {totalResumes}
                            </span>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="flex w-full flex-col gap-4 lg:w-auto lg:min-w-[420px]">
                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                            />

                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search resumes..."
                                className="pl-11"
                            />
                        </div>

                        <Button
                            onClick={onCreateResume}
                            className="flex w-full items-center justify-center gap-2"
                        >
                            <Plus size={18} />

                            <span>Create Resume</span>
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ResumeHeader;
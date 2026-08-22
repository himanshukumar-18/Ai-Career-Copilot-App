import React, { useState, useEffect } from "react";
import { Search, X, Filter, ArrowUpDown } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";

export const ProjectFilters = ({ filters = {}, onFilterChange, onReset }) => {
    const [searchTerm, setSearchTerm] = useState(filters.search || "");

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== (filters.search || "")) {
                onFilterChange({ search: searchTerm });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, filters.search, onFilterChange]);

    const handleStatusChange = (e) => {
        onFilterChange({ status: e.target.value });
    };

    const handleDifficultyChange = (e) => {
        onFilterChange({ difficulty: e.target.value });
    };

    const handleOrderingChange = (e) => {
        onFilterChange({ ordering: e.target.value });
    };

    const hasActiveFilters =
        Boolean(filters.status) ||
        Boolean(filters.difficulty) ||
        Boolean(filters.search) ||
        filters.ordering !== "-updated_at";

    return (
        <div className="border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                    <Input
                        type="text"
                        placeholder="Search projects by title, stack, or notes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-8"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Status Filter */}
                    <div className="flex items-center gap-1.5">
                        <Filter className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                        <select
                            value={filters.status || ""}
                            onChange={handleStatusChange}
                            className="h-11 border border-[var(--border)] bg-[var(--background)] px-3 font-mono text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                        >
                            <option value="">All Statuses</option>
                            <option value="not_started">Not Started</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    {/* Difficulty Filter */}
                    <select
                        value={filters.difficulty || ""}
                        onChange={handleDifficultyChange}
                        className="h-11 border border-[var(--border)] bg-[var(--background)] px-3 font-mono text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                    >
                        <option value="">All Difficulties</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>

                    {/* Ordering Filter */}
                    <div className="flex items-center gap-1.5">
                        <ArrowUpDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                        <select
                            value={filters.ordering || "-updated_at"}
                            onChange={handleOrderingChange}
                            className="h-11 border border-[var(--border)] bg-[var(--background)] px-3 font-mono text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                        >
                            <option value="-updated_at">Recently Updated</option>
                            <option value="-created_at">Newest First</option>
                            <option value="estimated_hours">Hours: Low to High</option>
                            <option value="-estimated_hours">Hours: High to Low</option>
                            <option value="title">Title (A-Z)</option>
                        </select>
                    </div>

                    {/* Reset Button */}
                    {hasActiveFilters && (
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setSearchTerm("");
                                onReset();
                            }}
                            className="h-11 px-3 text-xs"
                        >
                            Reset
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectFilters;

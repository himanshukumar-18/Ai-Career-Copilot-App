import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
    Briefcase,
    Plus,
    Search,
    Edit3,
    Trash2,
    Loader2,
    AlertCircle,
    X,
} from "lucide-react";
import { toast } from "sonner";

import Panel from "../../components/ui/Panel";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import {
    fetchAdminCareerRolesThunk,
    createAdminCareerRoleThunk,
    updateAdminCareerRoleThunk,
    deleteAdminCareerRoleThunk,
} from "../../features/admin/adminThunk";
import { selectAdminCareerRoles, selectAdminIsLoading } from "../../features/admin/adminSelectors";

const AdminCareerRoles = () => {
    const dispatch = useDispatch();

    const roles = useSelector(selectAdminCareerRoles);
    const isLoading = useSelector(selectAdminIsLoading);

    const [searchQuery, setSearchQuery] = useState("");
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [deletingRoleId, setDeletingRoleId] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({ mode: "onTouched" });

    useEffect(() => {
        dispatch(fetchAdminCareerRolesThunk({ search: searchQuery }));
    }, [dispatch, searchQuery]);

    const handleOpenCreateModal = () => {
        setEditingRole(null);
        reset({
            title: "",
            slug: "",
            category: "Software Engineering",
            description: "",
            demand_level: "High",
            avg_salary_range: "$80,000 - $130,000",
        });
        setCreateModalOpen(true);
    };

    const handleOpenEditModal = (role) => {
        setEditingRole(role);
        setValue("title", role.title);
        setValue("slug", role.slug);
        setValue("category", role.category || "Software Engineering");
        setValue("description", role.description || "");
        setValue("demand_level", role.demand_level || "High");
        setValue("avg_salary_range", role.avg_salary_range || "");
        setCreateModalOpen(true);
    };

    const onSubmitForm = async (data) => {
        if (editingRole) {
            const res = await dispatch(updateAdminCareerRoleThunk({ id: editingRole.id, data }));
            if (updateAdminCareerRoleThunk.fulfilled.match(res)) {
                toast.success("Career role updated successfully.");
                setCreateModalOpen(false);
                dispatch(fetchAdminCareerRolesThunk());
            } else {
                toast.error("Failed to update career role.");
            }
        } else {
            const res = await dispatch(createAdminCareerRoleThunk(data));
            if (createAdminCareerRoleThunk.fulfilled.match(res)) {
                toast.success("Career role created successfully.");
                setCreateModalOpen(false);
                dispatch(fetchAdminCareerRolesThunk());
            } else {
                toast.error("Failed to create career role.");
            }
        }
    };

    const handleDeleteRole = async () => {
        if (!deletingRoleId) return;
        const res = await dispatch(deleteAdminCareerRoleThunk(deletingRoleId));
        if (deleteAdminCareerRoleThunk.fulfilled.match(res)) {
            toast.success("Career role deleted.");
            dispatch(fetchAdminCareerRolesThunk());
        } else {
            toast.error("Failed to delete career role.");
        }
        setDeletingRoleId(null);
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Header */}
            <div className="border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-semibold">
                            Curriculum & Taxonomy
                        </span>
                    </div>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
                        Career Roles & Roadmaps Config
                    </h1>

                    <p className="mt-1 text-xs text-[var(--text-muted)] font-mono">
                        Create and curate career domain roles, demand levels, and learning roadmaps.
                    </p>
                </div>

                <Button
                    onClick={handleOpenCreateModal}
                    className="h-10 px-4 font-mono text-xs uppercase tracking-[0.15em] flex items-center gap-2"
                >
                    <Plus size={16} />
                    <span>Create Career Role</span>
                </Button>
            </div>

            {/* Search Bar */}
            <Panel className="p-4">
                <div className="relative max-w-md">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <Input
                        type="text"
                        placeholder="Search career roles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 font-mono text-xs"
                    />
                </div>
            </Panel>

            {/* Roles Table */}
            <Panel className="p-0 overflow-hidden">
                {isLoading && roles.length === 0 ? (
                    <div className="py-16 text-center">
                        <Loader2 size={24} className="animate-spin text-[var(--accent)] mx-auto mb-2" />
                        <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">
                            Loading Career Roles...
                        </p>
                    </div>
                ) : roles.length === 0 ? (
                    <div className="py-16 text-center space-y-2">
                        <Briefcase size={32} className="text-[var(--text-muted)] mx-auto" />
                        <p className="font-mono text-sm font-semibold text-white">No Career Roles Found</p>
                        <p className="font-mono text-xs text-[var(--text-muted)]">
                            No career roles configured. Click "Create Career Role" to add one.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[var(--border)] bg-[var(--surface)]/50 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                                    <th className="py-3 px-4">Title / Slug</th>
                                    <th className="py-3 px-4">Category</th>
                                    <th className="py-3 px-4">Demand</th>
                                    <th className="py-3 px-4">Salary Range</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[var(--border)]/60 font-mono text-xs">
                                {roles.map((role) => (
                                    <tr key={role.id} className="hover:bg-[var(--surface)]/30 transition-colors">
                                        <td className="py-3.5 px-4">
                                            <span className="font-semibold text-white block">{role.title}</span>
                                            <span className="text-[10px] text-[var(--text-muted)] font-mono">{role.slug}</span>
                                        </td>

                                        <td className="py-3.5 px-4 text-[var(--text-secondary)]">
                                            {role.category || "General"}
                                        </td>

                                        <td className="py-3.5 px-4">
                                            <span className="border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase">
                                                {role.demand_level || "High"}
                                            </span>
                                        </td>

                                        <td className="py-3.5 px-4 text-[var(--text-muted)] text-[11px]">
                                            {role.avg_salary_range || "-"}
                                        </td>

                                        <td className="py-3.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenEditModal(role)}
                                                    className="p-1.5 border border-[var(--border)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--text-primary)] transition-colors"
                                                    title="Edit Career Role"
                                                >
                                                    <Edit3 size={14} />
                                                </button>

                                                <button
                                                    onClick={() => setDeletingRoleId(role.id)}
                                                    className="p-1.5 border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors"
                                                    title="Delete Career Role"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Panel>

            {/* Create / Edit Modal */}
            {createModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-lg border border-[var(--border)] bg-[var(--background)] p-6 space-y-5 font-sans relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setCreateModalOpen(false)}
                            className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-white p-1"
                        >
                            <X size={20} />
                        </button>

                        <div className="border-b border-[var(--border)] pb-3">
                            <h2 className="text-lg font-bold text-white">
                                {editingRole ? "Edit Career Role" : "Create Career Role"}
                            </h2>
                            <p className="font-mono text-xs text-[var(--text-muted)]">
                                Configure role details for student roadmap enrollment.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 font-mono text-xs">
                            <div>
                                <label className="block mb-1 uppercase tracking-wider text-[var(--text-secondary)]">
                                    Role Title *
                                </label>
                                <Input
                                    placeholder="Python Backend Developer"
                                    {...register("title", { required: "Role title is required." })}
                                />
                                {errors.title && <p className="mt-1 text-red-500 text-[11px]">{errors.title.message}</p>}
                            </div>

                            <div>
                                <label className="block mb-1 uppercase tracking-wider text-[var(--text-secondary)]">
                                    Role Slug *
                                </label>
                                <Input
                                    placeholder="python-backend-developer"
                                    {...register("slug", { required: "Slug is required." })}
                                />
                                {errors.slug && <p className="mt-1 text-red-500 text-[11px]">{errors.slug.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block mb-1 uppercase tracking-wider text-[var(--text-secondary)]">
                                        Category
                                    </label>
                                    <Input placeholder="Software Engineering" {...register("category")} />
                                </div>

                                <div>
                                    <label className="block mb-1 uppercase tracking-wider text-[var(--text-secondary)]">
                                        Demand Level
                                    </label>
                                    <Input placeholder="High" {...register("demand_level")} />
                                </div>
                            </div>

                            <div>
                                <label className="block mb-1 uppercase tracking-wider text-[var(--text-secondary)]">
                                    Average Salary Range
                                </label>
                                <Input placeholder="$90,000 - $140,000" {...register("avg_salary_range")} />
                            </div>

                            <div>
                                <label className="block mb-1 uppercase tracking-wider text-[var(--text-secondary)]">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    className="w-full bg-[var(--surface)] border border-[var(--border)] p-2.5 text-white font-sans text-xs focus:outline-none focus:border-[var(--accent)]"
                                    placeholder="Overview of expectations, skill stack, and industry demand..."
                                    {...register("description")}
                                />
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setCreateModalOpen(false)}
                                    className="px-4 py-2 border border-[var(--border)] text-[var(--text-muted)] hover:text-white uppercase tracking-wider"
                                >
                                    Cancel
                                </button>
                                <Button type="submit" className="h-9 px-4 uppercase tracking-wider">
                                    {editingRole ? "Save Changes" : "Create Role"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            {deletingRoleId && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-md border border-[var(--border)] bg-[var(--background)] p-6 space-y-4 font-sans">
                        <h3 className="text-lg font-bold text-white tracking-tight">Delete Career Role?</h3>
                        <p className="font-mono text-xs text-[var(--text-muted)] leading-relaxed">
                            Are you sure you want to delete this career role? This action cannot be undone.
                        </p>

                        <div className="pt-3 flex items-center justify-end gap-3 font-mono text-xs">
                            <button
                                onClick={() => setDeletingRoleId(null)}
                                className="px-4 py-2 border border-[var(--border)] text-[var(--text-muted)] hover:text-white uppercase tracking-wider"
                            >
                                Cancel
                            </button>
                            <Button onClick={handleDeleteRole} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white uppercase tracking-wider">
                                Confirm Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCareerRoles;

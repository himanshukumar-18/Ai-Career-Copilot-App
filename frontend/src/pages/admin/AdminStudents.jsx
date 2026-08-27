import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Users,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Eye,
    Power,
    Loader2,
    AlertCircle,
    UserCheck,
    X,
} from "lucide-react";
import { toast } from "sonner";

import Panel from "../../components/ui/Panel";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import {
    fetchAdminStudentsThunk,
    fetchAdminStudentDetailThunk,
    toggleAdminStudentActiveThunk,
} from "../../features/admin/adminThunk";
import {
    selectAdminStudents,
    selectAdminStudentsPagination,
    selectAdminSelectedStudent,
    selectAdminIsLoading,
    selectAdminIsError,
    selectAdminMessage,
} from "../../features/admin/adminSelectors";

const AdminStudents = () => {
    const dispatch = useDispatch();

    const students = useSelector(selectAdminStudents);
    const pagination = useSelector(selectAdminStudentsPagination);
    const selectedStudent = useSelector(selectAdminSelectedStudent);
    const isLoading = useSelector(selectAdminIsLoading);
    const isError = useSelector(selectAdminIsError);
    const message = useSelector(selectAdminMessage);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [confirmToggleModalOpen, setConfirmToggleModalOpen] = useState(false);
    const [studentToToggle, setStudentToToggle] = useState(null);

    useEffect(() => {
        dispatch(
            fetchAdminStudentsThunk({
                search: searchQuery,
                status: statusFilter !== "all" ? statusFilter : undefined,
            })
        );
    }, [dispatch, searchQuery, statusFilter]);

    const handleInspectStudent = async (studentId) => {
        await dispatch(fetchAdminStudentDetailThunk(studentId));
        setDetailModalOpen(true);
    };

    const handleOpenConfirmToggle = (student) => {
        setStudentToToggle(student);
        setConfirmToggleModalOpen(true);
    };

    const handleConfirmToggle = async () => {
        if (!studentToToggle) return;
        const res = await dispatch(toggleAdminStudentActiveThunk(studentToToggle.id));
        if (toggleAdminStudentActiveThunk.fulfilled.match(res)) {
            toast.success(res.payload.message || "Student status updated.");
            dispatch(
                fetchAdminStudentsThunk({
                    search: searchQuery,
                    status: statusFilter !== "all" ? statusFilter : undefined,
                })
            );
        } else {
            toast.error("Failed to update student status.");
        }
        setConfirmToggleModalOpen(false);
        setStudentToToggle(null);
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Header */}
            <div className="border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-semibold">
                            User Governance
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-wider border border-[var(--border)] px-2 py-0.5 text-[var(--text-muted)]">
                            RBAC ACTIVE
                        </span>
                    </div>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
                        Student Account Management
                    </h1>

                    <p className="mt-1 text-xs text-[var(--text-muted)] font-mono">
                        Inspect registered students, verify credentials, manage accounts, and monitor progress.
                    </p>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <Panel className="p-4 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-md">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                        <Input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 font-mono text-xs"
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1 font-mono text-xs border border-[var(--border)] p-1 bg-[var(--background)]">
                        {[
                            { key: "all", label: "All Students" },
                            { key: "active", label: "Active" },
                            { key: "deactivated", label: "Deactivated" },
                            { key: "unverified", label: "Unverified" },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setStatusFilter(tab.key)}
                                className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${
                                    statusFilter === tab.key
                                        ? "bg-[var(--surface)] text-white font-bold border-l-2 border-[var(--accent)]"
                                        : "text-[var(--text-muted)] hover:text-white"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </Panel>

            {/* Error Alert */}
            {isError && (
                <div className="border border-red-500/50 bg-red-500/10 p-4 font-mono text-xs text-red-400">
                    <AlertCircle size={16} className="inline mr-2" />
                    <span>{message || "Failed to load student list."}</span>
                </div>
            )}

            {/* Students Table / Mobile Cards */}
            <Panel className="p-0 overflow-hidden">
                {isLoading && students.length === 0 ? (
                    <div className="py-16 text-center">
                        <Loader2 size={24} className="animate-spin text-[var(--accent)] mx-auto mb-2" />
                        <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">
                            Querying Student Accounts Database...
                        </p>
                    </div>
                ) : students.length === 0 ? (
                    <div className="py-16 text-center space-y-2">
                        <Users size={32} className="text-[var(--text-muted)] mx-auto" />
                        <p className="font-mono text-sm font-semibold text-white">No Students Found</p>
                        <p className="font-mono text-xs text-[var(--text-muted)]">
                            No student records match the search query or status filter.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[var(--border)] bg-[var(--surface)]/50 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                                        <th className="py-3 px-4">Student</th>
                                        <th className="py-3 px-4">Email</th>
                                        <th className="py-3 px-4">Role</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4">Joined</th>
                                        <th className="py-3 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-[var(--border)]/60 font-mono text-xs">
                                    {students.map((student) => (
                                        <tr key={student.id} className="hover:bg-[var(--surface)]/30 transition-colors">
                                            <td className="py-3.5 px-4">
                                                <span className="font-semibold text-white block">
                                                    {student.full_name || "Student"}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4 text-[var(--text-secondary)]">
                                                {student.email}
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span className="border border-[var(--border)] px-2 py-0.5 text-[10px] text-[var(--text-muted)] uppercase">
                                                    {student.role || "STUDENT"}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-2">
                                                    {student.is_active ? (
                                                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                                                            <CheckCircle2 size={12} /> Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-[11px] text-red-400">
                                                            <XCircle size={12} /> Deactivated
                                                        </span>
                                                    )}

                                                    {student.is_verified && (
                                                        <span className="text-[9px] uppercase tracking-wider text-blue-400 border border-blue-500/30 px-1.5 py-0.5">
                                                            Verified
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4 text-[var(--text-muted)] text-[11px]">
                                                {student.date_joined ? new Date(student.date_joined).toLocaleDateString() : "-"}
                                            </td>

                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleInspectStudent(student.id)}
                                                        className="p-1.5 border border-[var(--border)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--text-primary)] transition-colors"
                                                        title="Inspect Student Profile & Stats"
                                                    >
                                                        <Eye size={14} />
                                                    </button>

                                                    <button
                                                        onClick={() => handleOpenConfirmToggle(student)}
                                                        className={`p-1.5 border transition-colors ${
                                                            student.is_active
                                                                ? "border-red-500/40 text-red-400 hover:bg-red-500/10"
                                                                : "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                                                        }`}
                                                        title={student.is_active ? "Deactivate Account" : "Activate Account"}
                                                    >
                                                        <Power size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Stacked Card View */}
                        <div className="md:hidden divide-y divide-[var(--border)]">
                            {students.map((student) => (
                                <div key={student.id} className="p-4 space-y-3 font-mono text-xs">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-bold text-white text-sm">{student.full_name || "Student"}</p>
                                            <p className="text-[var(--text-muted)] text-xs">{student.email}</p>
                                        </div>

                                        {student.is_active ? (
                                            <span className="text-emerald-400 text-[10px] border border-emerald-500/30 px-2 py-0.5">
                                                ACTIVE
                                            </span>
                                        ) : (
                                            <span className="text-red-400 text-[10px] border border-red-500/30 px-2 py-0.5">
                                                DEACTIVATED
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]/50 text-[11px]">
                                        <span className="text-[var(--text-muted)]">
                                            Joined: {student.date_joined ? new Date(student.date_joined).toLocaleDateString() : "-"}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                onClick={() => handleInspectStudent(student.id)}
                                                className="h-8 px-2.5 font-mono text-[10px] uppercase tracking-wider"
                                            >
                                                Inspect
                                            </Button>

                                            <button
                                                onClick={() => handleOpenConfirmToggle(student)}
                                                className={`h-8 px-2.5 border font-mono text-[10px] uppercase tracking-wider ${
                                                    student.is_active ? "border-red-500/50 text-red-400" : "border-emerald-500/50 text-emerald-400"
                                                }`}
                                            >
                                                {student.is_active ? "Disable" : "Enable"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </Panel>

            {/* Student Detail Modal */}
            {detailModalOpen && selectedStudent && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-xl border border-[var(--border)] bg-[var(--background)] p-6 space-y-6 font-sans relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setDetailModalOpen(false)}
                            className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-white p-1"
                        >
                            <X size={20} />
                        </button>

                        <div className="border-b border-[var(--border)] pb-4">
                            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">
                                Student Dossier Inspection
                            </span>
                            <h2 className="text-xl font-bold text-white mt-1">{selectedStudent.full_name}</h2>
                            <p className="font-mono text-xs text-[var(--text-muted)]">{selectedStudent.email}</p>
                        </div>

                        {/* Profile Info */}
                        <div className="space-y-3 font-mono text-xs">
                            <p className="uppercase tracking-[0.15em] text-[var(--text-muted)] font-semibold text-[10px]">
                                Profile Metadata
                            </p>

                            <div className="p-3 border border-[var(--border)] bg-[var(--surface)]/30 space-y-2">
                                <div>
                                    <span className="text-[var(--text-muted)] text-[10px] uppercase block">Headline</span>
                                    <span className="text-white font-semibold">{selectedStudent.profile?.headline || "Not provided"}</span>
                                </div>

                                <div>
                                    <span className="text-[var(--text-muted)] text-[10px] uppercase block">Career Goal</span>
                                    <span className="text-[var(--text-secondary)]">{selectedStudent.profile?.career_goal || "Not specified"}</span>
                                </div>

                                <div>
                                    <span className="text-[var(--text-muted)] text-[10px] uppercase block">Location</span>
                                    <span className="text-[var(--text-secondary)]">{selectedStudent.profile?.location || "Not specified"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Usage Stats */}
                        <div className="space-y-3 font-mono text-xs">
                            <p className="uppercase tracking-[0.15em] text-[var(--text-muted)] font-semibold text-[10px]">
                                Platform Activity Stats
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="p-3 border border-[var(--border)] bg-[var(--surface)] text-center">
                                    <p className="text-2xl font-bold text-white font-mono">{selectedStudent.stats?.resumes_count || 0}</p>
                                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Resumes</p>
                                </div>

                                <div className="p-3 border border-[var(--border)] bg-[var(--surface)] text-center">
                                    <p className="text-2xl font-bold text-white font-mono">{selectedStudent.stats?.roadmaps_count || 0}</p>
                                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Roadmaps</p>
                                </div>

                                <div className="p-3 border border-[var(--border)] bg-[var(--surface)] text-center">
                                    <p className="text-2xl font-bold text-white font-mono">{selectedStudent.stats?.projects_count || 0}</p>
                                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Projects</p>
                                </div>

                                <div className="p-3 border border-[var(--border)] bg-[var(--surface)] text-center">
                                    <p className="text-2xl font-bold text-white font-mono">{selectedStudent.stats?.interviews_count || 0}</p>
                                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Interviews</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <Button
                                onClick={() => setDetailModalOpen(false)}
                                className="h-9 px-4 font-mono text-xs uppercase tracking-wider"
                            >
                                Close Dossier
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Activate / Deactivate Modal */}
            {confirmToggleModalOpen && studentToToggle && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-md border border-[var(--border)] bg-[var(--background)] p-6 space-y-4 font-sans">
                        <h3 className="text-lg font-bold text-white tracking-tight">
                            {studentToToggle.is_active ? "Deactivate Student Account?" : "Activate Student Account?"}
                        </h3>

                        <p className="font-mono text-xs text-[var(--text-muted)] leading-relaxed">
                            Are you sure you want to {studentToToggle.is_active ? "deactivate" : "activate"} the account for{" "}
                            <span className="text-white font-bold">{studentToToggle.email}</span>?
                            {studentToToggle.is_active
                                ? " Deactivating will prevent the student from logging in."
                                : " Activating will restore full platform access."}
                        </p>

                        <div className="pt-3 flex items-center justify-end gap-3 font-mono text-xs">
                            <button
                                onClick={() => setConfirmToggleModalOpen(false)}
                                className="px-4 py-2 border border-[var(--border)] text-[var(--text-muted)] hover:text-white transition-colors uppercase tracking-wider"
                            >
                                Cancel
                            </button>

                            <Button
                                onClick={handleConfirmToggle}
                                className={`px-4 py-2 font-mono text-xs uppercase tracking-wider ${
                                    studentToToggle.is_active ? "bg-red-600 hover:bg-red-700 text-white" : ""
                                }`}
                            >
                                Confirm {studentToToggle.is_active ? "Deactivation" : "Activation"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStudents;

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchResumes,
  duplicateResume,
  publishResume,
  unpublishResume,
  setDefaultResume,
} from "../../features/resume/resumeThunk";
import {
  selectResumes,
  selectResumeLoading,
  selectResumeError,
} from "../../features/resume/resumeSelectors";
import ResumeHeader from "../../components/resume/header/ResumeHeader";
import ResumeGrid from "../../components/resume/grid/ResumeGrid";
import ResumeSkeleton from "../../components/resume/grid/ResumeSkeleton";
import ResumeEmptyState from "../../components/resume/empty/ResumeEmptyState";
import CreateResumeModal from "../../components/resume/modal/CreateResumeModal";
import EditResumeModal from "../../components/resume/modal/EditResumeModal";
import DeleteResumeModal from "../../components/resume/modal/DeleteResumeModal";
import useDebounce from "@/hooks/useDebounce";

const Resume = () => {
  const dispatch = useDispatch();

  // ===============================
  // Redux State
  // ===============================

  const resumes = useSelector(selectResumes);       // ✅ use proper selector, not raw slice
  const loading = useSelector(selectResumeLoading);
  const error = useSelector(selectResumeError);

  // ===============================
  // Local State
  // ===============================

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResume, setSelectedResume] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

  // ===============================
  // Initial Fetch
  // ===============================

  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  // ===============================
  // Filtered Resumes
  // ===============================

  const filteredResumes = useMemo(() => {
    if (!Array.isArray(resumes)) return [];           // ✅ guard against non-array state

    const keyword = debouncedSearch.trim().toLowerCase();

    if (!keyword) return resumes;

    return resumes.filter((r) =>
      r.title.toLowerCase().includes(keyword)
    );
  }, [resumes, debouncedSearch]);

  // ===============================
  // Modal Handlers
  // ===============================

  const handleCreateResume = () => setCreateModalOpen(true);

  const handleEditResume = (resume) => {
    setSelectedResume(resume);
    setEditModalOpen(true);
  };

  const handleDeleteResume = (resume) => {
    setSelectedResume(resume);
    setDeleteModalOpen(true);
  };

  const handleCloseCreateModal = () => setCreateModalOpen(false);

  const handleCloseEditModal = () => {
    setSelectedResume(null);
    setEditModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setSelectedResume(null);
    setDeleteModalOpen(false);
  };

  // ===============================
  // Resume Actions
  // ===============================

  const handleDuplicateResume = (resume) => dispatch(duplicateResume(resume.id));
  const handlePublishResume = (resume) => dispatch(publishResume(resume.id));
  const handleUnpublishResume = (resume) => dispatch(unpublishResume(resume.id));
  const handleSetDefaultResume = (resume) => dispatch(setDefaultResume(resume.id));

  // ===============================
  // Derived UI flags
  // ===============================

  const hasResumes = Array.isArray(resumes) && resumes.length > 0;
  const hasResults = filteredResumes.length > 0;
  // ===============================
  // Render
  // ===============================

  return (
    <motion.main
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto w-full relative"
    >
      {/* Header */}
      <ResumeHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        totalResumes={filteredResumes.length}
        onCreateResume={handleCreateResume}
      />

      {/* Error State */}
      {error && (
        <div className="border border-red-900 bg-red-950/30 p-5">
          <h3 className="text-lg font-semibold text-red-400">
            Unable to load resumes
          </h3>
          <p className="mt-2 text-sm text-zinc-400">{error}</p>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && <ResumeSkeleton count={6} />}

      {/* No search match */}
      {!loading && !error && hasResumes && !hasResults && (
        <div className="border border-zinc-800 bg-zinc-950 p-10 text-center">
          <h3 className="text-xl font-semibold text-white">
            No matching resumes
          </h3>
          <p className="mt-2 text-zinc-400">
            Try a different search keyword.
          </p>
        </div>
      )}

      {/* Empty State — no resumes at all */}
      {!loading && !error && !hasResumes && (
        <ResumeEmptyState onCreateResume={handleCreateResume} />
      )}

      {/* Resume Grid */}
      {!loading && !error && hasResults && (
        <ResumeGrid
          resumes={filteredResumes}
          onEdit={handleEditResume}
          onDelete={handleDeleteResume}
          onDuplicate={handleDuplicateResume}
          onPublish={handlePublishResume}
          onUnpublish={handleUnpublishResume}
          onSetDefault={handleSetDefaultResume}
        />
      )}

      {/* Modals */}
      <CreateResumeModal
        open={createModalOpen}
        onOpenChange={handleCloseCreateModal}
      />

      <EditResumeModal
        open={editModalOpen}
        onOpenChange={handleCloseEditModal}
        resume={selectedResume}
      />

      <DeleteResumeModal
        open={deleteModalOpen}
        onOpenChange={handleCloseDeleteModal}
        resume={selectedResume}
      />
    </motion.main>
  );
};

export default Resume;

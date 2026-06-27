import { useEffect, useMemo, useState, useCallback } from "react";
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
  selectResumeLoading,
  selectResumeError,
} from "../../features/resume/resumeSelectors";
import  ResumeHeader  from "../../components/resume/header/ResumeHeader"
import  ResumeGrid  from "../../components/resume/grid/ResumeGrid"
import  ResumeSkeleton  from "../../components/resume/grid/ResumeSkeleton"
import  ResumeEmptyState  from "../../components/resume/empty/ResumeEmptyState"
import  CreateResumeModal from "../../components/resume/modal/CreateResumeModal";
import  EditResumeModal  from "../../components/resume/modal/EditResumeModal";
import  DeleteResumeModal  from "../../components/resume/modal/DeleteResumeModal";
import useDebounce from "@/hooks/useDebounce";

// for debug
// const Resume = () => {
//   console.log("Resume page rendered");

//   const dispatch = useDispatch();
//   console.log("Dispatch OK");

//   const resumes = useSelector(selectResumes);
//   console.log("Resumes:", resumes);

//   const loading = useSelector(selectResumeLoading);
//   console.log("Loading:", loading);

//   const error = useSelector(selectResumeError);
//   console.log("Error:", error);

//   return <div>Resume Page Loaded</div>;
// };


const Resume = () => {
  const dispatch = useDispatch();

  
  // ===============================
  // Redux State
  // ===============================
  
  const resume = useSelector((state) => state.resume);
  
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
  // Search
  // ===============================

  const filteredResumes = useMemo(() => {
    const keyword = debouncedSearch.trim().toLowerCase();

    if (!keyword) return resume;

    return resume.filter((resume) =>
      resume.title.toLowerCase().includes(keyword)
    );
  }, [resume, debouncedSearch]);

  // ===============================
  // Modal Handlers
  // ===============================

  const handleCreateResume = useCallback(() => {
    setCreateModalOpen(true);
  }, []);

  const handleEditResume = useCallback((resume) => {
    setSelectedResume(resume);
    setEditModalOpen(true);
  }, []);

  const handleDeleteResume = useCallback((resume) => {
    setSelectedResume(resume);
    setDeleteModalOpen(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setCreateModalOpen(false);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setSelectedResume(null);
    setEditModalOpen(false);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setSelectedResume(null);
    setDeleteModalOpen(false);
  }, []);

  // ===============================
  // Resume Actions
  // ===============================

  const handleDuplicateResume = async (resume) => {
    await dispatch(
      duplicateResume(resume.id)
    );
  };

  const handlePublishResume = async (resume) => {
    await dispatch(
      publishResume(resume.id)
    );
  };

  const handleUnpublishResume = async (resume) => {
    await dispatch(
      unpublishResume(resume.id)
    );
  };

  const handleSetDefaultResume = async (resume) => {
    await dispatch(
      setDefaultResume(resume.id)
    );
  };

  if (!loading && resume.length > 0 && filteredResumes.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-10 text-center">
        <h3 className="text-xl font-semibold text-white">
          No matching resumes
        </h3>

        <p className="mt-2 text-zinc-400">
          Try a different search keyword.
        </p>
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="
        mx-auto
        w-full
        max-w-7xl
        space-y-8
        px-4
        py-8

        sm:px-6

        lg:px-8
      "
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
        <div
          className="
      rounded-2xl
      border
      border-red-900
      bg-red-950/30
      p-5
    "
        >
          <h3 className="text-lg font-semibold text-red-400">
            Unable to load resumes
          </h3>

          <p className="mt-2 text-sm text-zinc-400">
            {error}
          </p>
        </div>
      )}

      {/* Loading */}

      {loading && (
        <ResumeSkeleton count={6} />
      )}

      {/* Empty State */}

      {!loading &&
        !error &&
        filteredResumes.length === 0 && (
          <ResumeEmptyState
            onCreateResume={handleCreateResume}
          />
        )}

      {/* Resume Grid */}

      {!loading &&
        !error &&
        filteredResumes.length > 0 && (
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

      {/* Sprint 3:
          Create Modal
          Edit Modal
          Delete Modal
      */}

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
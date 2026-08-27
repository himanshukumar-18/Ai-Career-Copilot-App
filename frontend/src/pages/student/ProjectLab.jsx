import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import useProjectLab from "../../hooks/useProjectLab";
import ProjectLabHeader from "../../components/projectLab/ProjectLabHeader";
import ProjectFilters from "../../components/projectLab/ProjectFilters";
import ProjectGrid from "../../components/projectLab/ProjectGrid";
import ProjectSkeleton from "../../components/projectLab/ProjectSkeleton";
import ProjectEmpty from "../../components/projectLab/ProjectEmpty";
import ProjectPagination from "../../components/projectLab/ProjectPagination";
import ProjectGeneratorModal from "../../components/projectLab/ProjectGeneratorModal";
import ProjectDetailModal from "../../components/projectLab/ProjectDetailModal";
import UpdateStatusModal from "../../components/projectLab/UpdateStatusModal";
import DeleteProjectModal from "../../components/projectLab/DeleteProjectModal";

const ProjectLab = () => {
    const {
        myProjects,
        generatedProjects,
        pagination,
        filters,
        stats,
        errors,
        isListLoading,
        isGenerateLoading,
        isSaveLoading,
        isUpdateLoading,
        isDeleteLoading,
        fetchProjects,
        generateProjects,
        saveProject,
        updateProjectStatus,
        deleteProject,
        updateFilters,
        resetAllFilters,
        changePage,
        resetGenerated,
    } = useProjectLab();

    // Modal state
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [detailProject, setDetailProject] = useState(null);
    const [updateProject, setUpdateProject] = useState(null);
    const [deleteProjectTarget, setDeleteProjectTarget] = useState(null);

    // Initial fetch and refetch on filter/page change
    useEffect(() => {
        fetchProjects();
    }, [fetchProjects, filters.status, filters.difficulty, filters.search, filters.ordering, filters.page]);

    // Handle AI project generation
    const handleGenerate = async (payload) => {
        try {
            await generateProjects(payload).unwrap();
            toast.success("AI project suggestions generated!");
        } catch (err) {
            toast.error(typeof err === "string" ? err : "Failed to generate project ideas.");
        }
    };

    // Handle snapshot saving a generated project
    const handleSaveGeneratedProject = async (generatedId) => {
        try {
            await saveProject(generatedId).unwrap();
            toast.success("Project saved to your Project Lab!");
            fetchProjects();
        } catch (err) {
            toast.error(typeof err === "string" ? err : "Failed to save project.");
        }
    };

    // Handle project status update
    const handleUpdateStatusSubmit = async (payload) => {
        try {
            await updateProjectStatus(payload).unwrap();
            toast.success("Project status updated successfully.");
            setUpdateProject(null);
            if (detailProject && detailProject.id === payload.id) {
                setDetailProject((prev) => ({ ...prev, ...payload }));
            }
            fetchProjects();
        } catch (err) {
            toast.error(typeof err === "string" ? err : "Failed to update project.");
        }
    };

    // Handle project deletion
    const handleConfirmDelete = async () => {
        if (!deleteProjectTarget) return;
        try {
            await deleteProject(deleteProjectTarget.id).unwrap();
            toast.success("Project deleted successfully.");
            setDeleteProjectTarget(null);
            if (detailProject && detailProject.id === deleteProjectTarget.id) {
                setDetailProject(null);
            }
            fetchProjects();
        } catch (err) {
            toast.error(typeof err === "string" ? err : "Failed to delete project.");
        }
    };

    // Extract saved generated IDs to display checkmarks in generator modal
    const savedProjectIds = myProjects
        .map((p) => p.source_generation_id)
        .filter(Boolean);

    const isFiltered =
        Boolean(filters.status) ||
        Boolean(filters.difficulty) ||
        Boolean(filters.search) ||
        filters.ordering !== "-updated_at";

    return (
        <div className="space-y-6 pb-12">
            {/* Header with Stats & Generate Trigger */}
            <ProjectLabHeader
                stats={stats}
                onOpenGenerateModal={() => {
                    resetGenerated();
                    setIsGenerateModalOpen(true);
                }}
            />

            {/* Filter Bar */}
            <ProjectFilters
                filters={filters}
                onFilterChange={updateFilters}
                onReset={resetAllFilters}
            />

            {/* Main Content Grid / Loading / Empty */}
            {isListLoading ? (
                <ProjectSkeleton count={6} />
            ) : myProjects.length === 0 ? (
                <ProjectEmpty
                    isFiltered={isFiltered}
                    onOpenGenerateModal={() => {
                        resetGenerated();
                        setIsGenerateModalOpen(true);
                    }}
                    onResetFilters={resetAllFilters}
                />
            ) : (
                <>
                    <ProjectGrid
                        projects={myProjects}
                        onViewDetails={(proj) => setDetailProject(proj)}
                        onUpdateStatus={(proj) => setUpdateProject(proj)}
                        onDelete={(proj) => setDeleteProjectTarget(proj)}
                    />

                    <ProjectPagination
                        pagination={pagination}
                        onPageChange={changePage}
                    />
                </>
            )}

            {/* AI Generator Modal */}
            <ProjectGeneratorModal
                isOpen={isGenerateModalOpen}
                onClose={() => setIsGenerateModalOpen(false)}
                onGenerate={handleGenerate}
                onSaveProject={handleSaveGeneratedProject}
                generatedProjects={generatedProjects}
                isGenerating={isGenerateLoading}
                isSaving={isSaveLoading}
                generateError={errors.generateError}
                savedProjectIds={savedProjectIds}
            />

            {/* Detail View Modal */}
            <ProjectDetailModal
                isOpen={Boolean(detailProject)}
                onClose={() => setDetailProject(null)}
                project={detailProject}
                onOpenUpdateStatusModal={(proj) => setUpdateProject(proj)}
            />

            {/* Update Status Modal */}
            <UpdateStatusModal
                isOpen={Boolean(updateProject)}
                onClose={() => setUpdateProject(null)}
                project={updateProject}
                onUpdate={handleUpdateStatusSubmit}
                isUpdating={isUpdateLoading}
                updateError={errors.updateError}
            />

            {/* Delete Confirmation Modal */}
            <DeleteProjectModal
                isOpen={Boolean(deleteProjectTarget)}
                onClose={() => setDeleteProjectTarget(null)}
                project={deleteProjectTarget}
                onConfirmDelete={handleConfirmDelete}
                isDeleting={isDeleteLoading}
                deleteError={errors.deleteError}
            />
        </div>
    );
};

export default ProjectLab;
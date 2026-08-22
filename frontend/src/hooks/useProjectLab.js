import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    selectMyProjects,
    selectGeneratedProjects,
    selectSelectedProject,
    selectProjectLabPagination,
    selectProjectLabFilters,
    selectProjectLabStatuses,
    selectProjectLabErrors,
    selectProjectStats,
} from "../features/projectLab/projectLabSelectors";
import {
    generateProjectsThunk,
    fetchMyProjectsThunk,
    fetchProjectByIdThunk,
    saveGeneratedProjectThunk,
    updateProjectStatusThunk,
    deleteUserProjectThunk,
} from "../features/projectLab/projectLabThunk";
import {
    setFilters,
    resetFilters,
    setPage,
    clearGeneratedProjects,
    clearSelectedProject,
    clearProjectLabError,
    resetProjectLabStatuses,
} from "../features/projectLab/projectLabSlice";

export const useProjectLab = () => {
    const dispatch = useDispatch();

    const myProjects = useSelector(selectMyProjects);
    const generatedProjects = useSelector(selectGeneratedProjects);
    const selectedProject = useSelector(selectSelectedProject);
    const pagination = useSelector(selectProjectLabPagination);
    const filters = useSelector(selectProjectLabFilters);
    const statuses = useSelector(selectProjectLabStatuses);
    const errors = useSelector(selectProjectLabErrors);
    const stats = useSelector(selectProjectStats);

    const fetchProjects = useCallback(
        (customParams = {}) => {
            const queryParams = {
                ...filters,
                ...customParams,
            };

            // Remove empty keys
            Object.keys(queryParams).forEach((key) => {
                if (queryParams[key] === "" || queryParams[key] === null || queryParams[key] === undefined) {
                    delete queryParams[key];
                }
            });

            return dispatch(fetchMyProjectsThunk(queryParams));
        },
        [dispatch, filters]
    );

    const fetchProjectById = useCallback(
        (id) => dispatch(fetchProjectByIdThunk(id)),
        [dispatch]
    );

    const generateProjects = useCallback(
        (payload) => dispatch(generateProjectsThunk(payload)),
        [dispatch]
    );

    const saveProject = useCallback(
        (generatedProjectId) => dispatch(saveGeneratedProjectThunk(generatedProjectId)),
        [dispatch]
    );

    const updateProjectStatus = useCallback(
        (payload) => dispatch(updateProjectStatusThunk(payload)),
        [dispatch]
    );

    const deleteProject = useCallback(
        (id) => dispatch(deleteUserProjectThunk(id)),
        [dispatch]
    );

    const updateFilters = useCallback(
        (newFilters) => {
            dispatch(setFilters({ ...newFilters, page: 1 }));
        },
        [dispatch]
    );

    const resetAllFilters = useCallback(() => {
        dispatch(resetFilters());
    }, [dispatch]);

    const changePage = useCallback(
        (page) => {
            dispatch(setPage(page));
        },
        [dispatch]
    );

    const resetGenerated = useCallback(() => {
        dispatch(clearGeneratedProjects());
    }, [dispatch]);

    const resetSelected = useCallback(() => {
        dispatch(clearSelectedProject());
    }, [dispatch]);

    const clearError = useCallback(() => {
        dispatch(clearProjectLabError());
    }, [dispatch]);

    const resetStatuses = useCallback(() => {
        dispatch(resetProjectLabStatuses());
    }, [dispatch]);

    return {
        // State
        myProjects,
        generatedProjects,
        selectedProject,
        pagination,
        filters,
        stats,
        statuses,
        errors,

        // Status helpers
        isListLoading: statuses.listStatus === "pending",
        isGenerateLoading: statuses.generateStatus === "pending",
        isDetailLoading: statuses.detailStatus === "pending",
        isSaveLoading: statuses.saveStatus === "pending",
        isUpdateLoading: statuses.updateStatus === "pending",
        isDeleteLoading: statuses.deleteStatus === "pending",

        // Actions
        fetchProjects,
        fetchProjectById,
        generateProjects,
        saveProject,
        updateProjectStatus,
        deleteProject,
        updateFilters,
        resetAllFilters,
        changePage,
        resetGenerated,
        resetSelected,
        clearError,
        resetStatuses,
    };
};

export default useProjectLab;

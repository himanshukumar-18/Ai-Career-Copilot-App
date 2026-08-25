import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchRolesThunk,
    generateAIRoadmapThunk,
    fetchUserProgressThunk,
    completeStepThunk,
    fetchNextStepThunk,
    fetchMyEnrolledRoadmapsThunk,
} from "./careerRoadmapThunk";
import {
    setSelectedRoleSlug,
    clearActiveProgress,
    clearRoadmapErrors,
    resetRoadmapStatuses,
} from "./careerRoadmapSlice";
import {
    selectCareerRoles,
    selectSelectedRoleSlug,
    selectSelectedRoleObj,
    selectActiveProgress,
    selectMyEnrolledRoadmaps,
    selectNextStepData,
    selectRolesStatus,
    selectGenerateStatus,
    selectProgressStatus,
    selectCompleteStatus,
    selectNextStepStatus,
    selectRolesError,
    selectGenerateError,
    selectProgressError,
    selectCompleteError,
} from "./careerRoadmapSelectors";

export const useCareerRoadmap = () => {
    const dispatch = useDispatch();

    const roles = useSelector(selectCareerRoles);
    const selectedRoleSlug = useSelector(selectSelectedRoleSlug);
    const selectedRole = useSelector(selectSelectedRoleObj);
    const activeProgress = useSelector(selectActiveProgress);
    const myEnrolledRoadmaps = useSelector(selectMyEnrolledRoadmaps);
    const nextStepData = useSelector(selectNextStepData);

    const rolesStatus = useSelector(selectRolesStatus);
    const generateStatus = useSelector(selectGenerateStatus);
    const progressStatus = useSelector(selectProgressStatus);
    const completeStatus = useSelector(selectCompleteStatus);
    const nextStepStatus = useSelector(selectNextStepStatus);

    const rolesError = useSelector(selectRolesError);
    const generateError = useSelector(selectGenerateError);
    const progressError = useSelector(selectProgressError);
    const completeError = useSelector(selectCompleteError);

    const fetchRoles = useCallback(() => {
        return dispatch(fetchRolesThunk()).unwrap();
    }, [dispatch]);

    const selectRole = useCallback((slug) => {
        dispatch(setSelectedRoleSlug(slug));
    }, [dispatch]);

    const generateAIRoadmap = useCallback((roleInput, forceRegenerate = false) => {
        return dispatch(
            generateAIRoadmapThunk({
                careerRoleSlug: roleInput,
                customRoleInput: roleInput,
                forceRegenerate,
            })
        ).unwrap();
    }, [dispatch]);

    const fetchUserProgress = useCallback((careerRoleSlug) => {
        return dispatch(fetchUserProgressThunk(careerRoleSlug)).unwrap();
    }, [dispatch]);

    const completeStep = useCallback((stepId, notes = "") => {
        return dispatch(completeStepThunk({ stepId, notes })).unwrap();
    }, [dispatch]);

    const fetchNextStep = useCallback((careerRoleSlug) => {
        return dispatch(fetchNextStepThunk(careerRoleSlug)).unwrap();
    }, [dispatch]);

    const fetchMyEnrolledRoadmaps = useCallback(() => {
        return dispatch(fetchMyEnrolledRoadmapsThunk()).unwrap();
    }, [dispatch]);

    const clearProgress = useCallback(() => {
        dispatch(clearActiveProgress());
    }, [dispatch]);

    const clearErrors = useCallback(() => {
        dispatch(clearRoadmapErrors());
    }, [dispatch]);

    const resetStatuses = useCallback(() => {
        dispatch(resetRoadmapStatuses());
    }, [dispatch]);

    return {
        // State
        roles,
        selectedRoleSlug,
        selectedRole,
        activeProgress,
        myEnrolledRoadmaps,
        nextStepData,

        // Statuses
        rolesStatus,
        generateStatus,
        progressStatus,
        completeStatus,
        nextStepStatus,

        // Boolean status flags
        isRolesLoading: rolesStatus === "pending",
        isGenerating: generateStatus === "pending",
        isProgressLoading: progressStatus === "pending",
        isCompleting: completeStatus === "pending",
        isNextStepLoading: nextStepStatus === "pending",

        // Errors
        rolesError,
        generateError,
        progressError,
        completeError,

        // Actions
        fetchRoles,
        selectRole,
        generateAIRoadmap,
        fetchUserProgress,
        completeStep,
        fetchNextStep,
        fetchMyEnrolledRoadmaps,
        clearProgress,
        clearErrors,
        resetStatuses,
    };
};

export default useCareerRoadmap;

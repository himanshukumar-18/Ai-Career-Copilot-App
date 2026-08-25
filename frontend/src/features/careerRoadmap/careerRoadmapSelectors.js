export const selectCareerRoadmapState = (state) => state.careerRoadmap;

export const selectCareerRoles = (state) => state.careerRoadmap.roles;
export const selectSelectedRoleSlug = (state) => state.careerRoadmap.selectedRoleSlug;

export const selectActiveProgress = (state) => state.careerRoadmap.activeProgress;
export const selectMyEnrolledRoadmaps = (state) => state.careerRoadmap.myEnrolledRoadmaps;
export const selectNextStepData = (state) => state.careerRoadmap.nextStepData;

export const selectRolesStatus = (state) => state.careerRoadmap.rolesStatus;
export const selectGenerateStatus = (state) => state.careerRoadmap.generateStatus;
export const selectProgressStatus = (state) => state.careerRoadmap.progressStatus;
export const selectCompleteStatus = (state) => state.careerRoadmap.completeStatus;
export const selectNextStepStatus = (state) => state.careerRoadmap.nextStepStatus;

export const selectRolesError = (state) => state.careerRoadmap.rolesError;
export const selectGenerateError = (state) => state.careerRoadmap.generateError;
export const selectProgressError = (state) => state.careerRoadmap.progressError;
export const selectCompleteError = (state) => state.careerRoadmap.completeError;

export const selectSelectedRoleObj = (state) => {
    const roles = state.careerRoadmap.roles;
    const slug = state.careerRoadmap.selectedRoleSlug;
    return roles.find((r) => r.slug === slug) || null;
};

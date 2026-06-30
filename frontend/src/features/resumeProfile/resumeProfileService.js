import api from "../../api/axios";

const unwrapApiResponse = (response) =>
    response.data?.data ?? response.data;


//Get Resume Profile
//GET /api/v1/resumes/:resumeId/profile/
export const getResumeProfile = async (
    resumeId
) => {

    const response = await api.get(
        `/resumes/${resumeId}/profile/`
    );

    return unwrapApiResponse(response);
};


//Update Resume Profile
//PATCH /api/v1/resumes/:resumeId/profile/
export const updateResumeProfile = async (
    resumeId,
    profileData
) => {

    const response = await api.patch(
        `/resumes/${resumeId}/profile/`,
        profileData
    );

    return unwrapApiResponse(response);
};
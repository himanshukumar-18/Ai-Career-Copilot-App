import api from "../../api/axios";

const getResumeProfile = async (resumeId) => {
    const response = await api.get(`/resumes/${resumeId}/profile/`);
    return response.data;
};

const createResumeProfile = async (resumeId, data) => {
    const response = await api.post(`/resumes/${resumeId}/profile/`, data);
    return response.data;
};

const updateResumeProfile = async (resumeId, data) => {
    const response = await api.patch(`/resumes/${resumeId}/profile/`, data);
    return response.data;
};

const uploadResumePhoto = async (resumeId, photoFile) => {
    const formData = new FormData();
    formData.append("profile_photo", photoFile);

    const response = await api.patch(
        `/resumes/${resumeId}/profile/`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

const resumeProfileService = {
    getResumeProfile,
    createResumeProfile,
    updateResumeProfile,
    uploadResumePhoto,
};

export default resumeProfileService;
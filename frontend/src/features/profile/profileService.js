import api from "../../api/axios";

const unwrapApiResponse = (response) => (
    response.data?.data ?? response.data
);

export const getProfile = async () => {
    const response = await api.get(
        "/profile/me/"
    );

    return unwrapApiResponse(response);
};

export const updateProfile = async (
    profileData
) => {

    const response = await api.patch(
        "/profile/me/",
        profileData
    );

    return unwrapApiResponse(response);
};

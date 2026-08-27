import api from "../../api/axios.js";

const unwrapApiResponse = (response) => (
  response.data?.data ?? response.data
);

export const registerUser = async (userData) => {
  const response = await api.post(
    "/auth/register/",
    userData
  );

  return unwrapApiResponse(response);
};

export const verifyOTP = async (data) => {

  const response = await api.post(
    "/auth/verify-otp/",
    data
  );

  return unwrapApiResponse(response);
};

export const loginUser = async (credentials) => {
  const response = await api.post(
    "/auth/login/",
    credentials
  );
  return unwrapApiResponse(response);
};

export const getMe = async () => {

  const response =
    await api.get(
      "/auth/me/"
    );

  return unwrapApiResponse(response);
};

export const googleLogin =
  async (token) => {

    const response =
      await api.post(
        "/auth/google/",
        {
          token,
        }
      );

    return unwrapApiResponse(response);
  };

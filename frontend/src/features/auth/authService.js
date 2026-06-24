import api from "../../api/axios.js";

export const registerUser = async (userData) => {
  const response = await api.post(
    "/auth/register/",
    userData
  );

  return response.data;
};

export const verifyOTP = async (data) => {

  const response = await api.post(
    "/auth/verify-otp/",
    data
  );

  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post(
    "/auth/login/",
    credentials
  );
  return response.data;
};

export const getMe = async () => {

  const response =
    await api.get(
      "/auth/me/"
    );

  return response.data;
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

    return response.data;
  };
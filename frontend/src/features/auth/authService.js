import api from "../../api/axios.js";

export const registerUser = async (userData) => {
  const response = await api.post(
    "/auth/register/",
    userData
  );

  return response.data;
};

export const loginUser = async (credentials) => {
  console.log("DETAILS:", credentials)
  const response = await api.post(
    "/auth/login/",
    credentials
  );
  return response.data;
};

export const getMe = async (token) => {
  const response = await api.get(
    "/auth/me/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
import api from "../../api/axios.js";

export const registerUser = async (userData) => {
  const response = await api.post(
    "/auth/register/",
    userData
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

export const getMe = async (token) => {
  const response = await api.get(
    "/auth/me/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log(response.data)

  return response.data;
};
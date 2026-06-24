import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {

    const token =
        localStorage.getItem("accessToken");

    const publicRoutes = [
        "/auth/login/",
        "/auth/register/",
        "/auth/verify-otp/",
        "/auth/google/",
    ];

    const isPublic =
        publicRoutes.some(
            (route) =>
                config.url?.includes(route)
        );

    if (token && !isPublic) {
        config.headers.Authorization =
            `Bearer ${token}`;
    }

    return config
});

api.interceptors.response.use(

    (response) => response,

    async (error) => {

        const originalRequest =
            error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {

            originalRequest._retry = true;

            try {

                const refreshToken =
                    localStorage.getItem(
                        "refreshToken"
                    );

                const response =
                    await axios.post(
                        `${import.meta.env.VITE_API_BASE_URL}/auth/token/refresh/`,
                        {
                            refresh: refreshToken,
                        }
                    );

                const newAccessToken =
                    response.data.access;

                localStorage.setItem(
                    "accessToken",
                    newAccessToken
                );

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return api(
                    originalRequest
                );

            } catch {

                localStorage.clear();

                window.location.href =
                    "/login";
            }
        }

        return Promise.reject(
            error
        );
    }
);

export default api;
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Force logout on Unauthorized
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("userRole");
            window.location.href = "/login";
        }

        const serverMessage = error.response?.data?.error?.message;
        const fallbackMessage = error.response?.data?.message || "Lỗi hệ thống không xác định";

        if (serverMessage) {
            // If it's an object (Zod errors), maybe stringify it or pick the first one
            if (typeof serverMessage === "object") {
                error.message = Object.values(serverMessage).flat()?.[0];
            } else {
                error.message = serverMessage;
            }
        } else {
            error.message = fallbackMessage;
        }

        return Promise.reject(error);
    },
);

export default api;

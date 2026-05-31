import axios from "axios";

const api = axios.create({
    baseURL: "https://proyectofinal-topicosweb-farmacia-1.onrender.com/api",
    timeout: 120000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
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
        console.error("API ERROR:", error);
        return Promise.reject(error);
    }
);

export default api;
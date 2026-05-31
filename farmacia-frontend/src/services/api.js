import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    timeout: 120000, // 2 minutos
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// TOKEN
api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// ERRORES
api.interceptors.response.use(

    (response) => response,

    (error) => {

        console.error("API ERROR:", error);

        return Promise.reject(error);
    }
);

export default api;
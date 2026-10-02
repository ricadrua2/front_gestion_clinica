import axios from "axios";

const api = axios.create({
    baseURL: "/api/",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");

    // El login NO necesita token
    if (config.url === "usuarios/login/") {
        return config;
    }

    console.log(
        "ENVIANDO TOKEN:",
        token && token !== "undefined" ? "SI" : "NO"
    );

    if (token && token !== "undefined") {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
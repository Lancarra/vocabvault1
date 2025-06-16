import axios from "axios";

const API_URL = "https://localhost:7271"; // ← твой backend

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

// Добавляем JWT токен из localStorage в каждый запрос
api.interceptors.request.use(config => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

// Обработка ошибок (можно добавить редирект или алерт при 401)
api.interceptors.response.use(
    response => response,
    error => {
        console.error("API error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;

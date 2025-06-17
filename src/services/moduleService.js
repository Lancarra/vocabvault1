// services/moduleService.js
import api from "../api";

export const getAllModules = async () => {
    const response = await api.get("/course-module/get-all-modules");
    return response.data.modules; // 💡 извлекаем именно массив
};


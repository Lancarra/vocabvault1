// services/dashboardService.js
import api from "../api";

export const getAllModules = async () => {
    const response = await api.get("/course-module/get-all-modules");
    return response.data.modules; // 💡 извлекаем именно массив
};

export const createModule = async (name, userId) => {
    const response = await api.post("/course-module/create-module", {
        name: name,
        userId: userId
    });
    return response.data;
};


export const updateModule = async (id, newName, userId) => {
    const response = await api.put("/course-module/update-module", {
        id: id,
        name: newName,
        userId: userId
    });
    return response.data;
};


// Удаление модуля
export const deleteModule = async (id) => {
    const response = await api.delete("/course-module/delete-module", {
        data: { id: id } // axios требует data в теле для DELETE
    });
    return response.data;
};


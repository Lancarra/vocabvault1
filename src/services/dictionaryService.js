import api from "../api";

/* Получить все слова по словарю */
export const getAllDefinitions = async (dictionaryId) => {
    const response = await api.get(`/definition/get-all-definitions/${dictionaryId}`);
    return response.data.definitions || [];
};

/* Создать новое слово */
export const createDefinition = async (newWord) => {
    const response = await api.post("/definition/create-definition", newWord);
    return response.data;
};

/* Обновить слово */
export const updateDefinition = async (id, updatedData) => {
    const payload = { id, ...updatedData };
    console.log("Sending payload:", payload); // для отладки
    const response = await api.put("/definition/update-definition", payload);
    return response.data;
};

/* Удалить слово */
export const deleteDefinition = async (id) => {
    const response = await api.delete("/definition/delete-definition", {
        data: { id },
    });
    return response.data;
};

/* Загрузить картинку (обновить blobId) */
export const uploadDefinitionImage = async (definitionId, file) => {
    const formData = new FormData();
    formData.append("file", file); // обязательно "file"!

    const response = await api.post(`/definition/blob/update/${definitionId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

/* Получить картинку blob по blobId и вернуть blobURL */
export const fetchDefinitionImage = async (blobId) => {
    const response = await api.get(`/definition/blob/get/${blobId}`, {
        responseType: "blob",
    });

    return URL.createObjectURL(response.data); // ✅ даём браузеру blobURL
};

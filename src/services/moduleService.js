import api from "../api";

export const getAllFolders = async (moduleId) => {
    const response = await api.get(`/folder/get-all-folders/${moduleId}`);
    return response.data.folders;
};

export const createFolder = async (name, courseModuleId) => {
    const response = await api.post(`/folder/create-folder`, {
        name,
        courseModuleId
    });
    return response.data;
};

export const updateFolder = async (id, name, courseModuleId, parentFolderId = null) => {
    const payload = {
        id,
        name,
        courseModuleId,
    };

    // Добавляем parentFolderId только если он валидный
    if (parentFolderId && parentFolderId !== "00000000-0000-0000-0000-000000000000") {
        payload.parentFolderId = parentFolderId;
    }

    const response = await api.put(`/folder/update-folder`, payload);
    return response.data;
};


export const deleteFolder = async (id) => {
    const response = await api.delete(`/folder/delete-folder/${id}`);
    return response.data;
};




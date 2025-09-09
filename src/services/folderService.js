import api from '../api';

export const getAllDictionariesInFolder = async (folderId) => {
    const response = await api.get(`/learn-word-dictionary/get-all-dictionaries/${folderId}`);
    return response.data.dictionary || [];
};

export const createDictionary = async (name, parentFolderId) => {
    const response = await api.post(`/learn-word-dictionary/create-dictionary`, {
        name,
        parentFolderId
    });
    return response.data;
};

export const updateDictionary = async (id, name, parentFolderId) => {
    const response = await api.put(`/learn-word-dictionary/update-dictionary`, {
        id,
        name,
        parentFolderId
    });
    return response.data;
};

export const deleteDictionary = async (id) => {
    const response = await api.delete(`/learn-word-dictionary/delete-dictionary`, {
        data: { id } // тело запроса для DELETE
    });
    return response.data;
};

import api from "../api";

/* логин */
export const loginUser = async (email, password) => {
    const response = await api.post("/users/login", {
        email,
        password,
        fromOtherService: true,
        verificationString: "123456",
        googleAuthCode: "",
        googleAuthKey: ""
    });
    return response.data;
};


export const getUserById = async (userId) => {
    const token = localStorage.getItem("jwtToken");
    const { data } = await api.get(`/users/get-user-by-id/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data.username || data.email || `User #${userId}`;
};


/* регистрация */
export const registerUser = async (email, password, username) => {
    const response = await api.post("/users/create-user", {
        email,
        password,
        username,
        blobId: null // по умолчанию null
    });
    return response.data;
};

/* обновить пользователя */
export const updateUser = async (userId, updates) => {
    const response = await api.put("/users/update-user", updates, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response.data;
};

/* Загрузить аватарку (обновить blobId) */
export const uploadUserAvatar = async (userId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`/users/blob/update/${userId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data; // должен вернуться обновлённый пользователь с новым blobId
};

/* Получить blob (аватарку) как URL для <img src="..." /> */
export const fetchAvatarUrl = async (blobId) => {
    const response = await api.put(`/users/blob/get/${blobId}`, null, {
        responseType: "blob"
    });
    return URL.createObjectURL(response.data);
};

/* (опционально) Удалить пользователя вместе с blob */
export const deleteUser = async (userId, blobId) => {
    const response = await api.delete("/users/delete-user", {
        data: {
            userId,
            blobId
        }
    });
    return response.data;
};

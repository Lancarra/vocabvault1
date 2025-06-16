import api from "../api";

/* логин */
export const loginUser = async (email, password) => {
    const response = await api.post("/users/login", {
        email,
        password,
        fromOtherService: true,
        verificationString: "123456", // или лучше взять из .env/config
        googleAuthCode: "",           // если 2FA не включён
        googleAuthKey: ""             // тоже можно пустым
    });
    return response.data; // вернёт { userId, email, token, ... }
};

/* получить юзера по Id */
export const getUserById = async (userId) => {
    const { data } = await api.get(`/users/get-user-by-id/${userId}`);
    return data;   // data = { userId, email }
};

/* регистрация */
export const registerUser = async (email, password) => {
    const { data } = await api.post("/users/create-user", { email, password });
    return data;   // data = { userId }
};

import React from "react";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("jwtToken"));
    const [userId, setUserId] = useState(localStorage.getItem("userId"));

    const login = (newToken, newUserId) => {
        localStorage.setItem("jwtToken", newToken);
        localStorage.setItem("userId", newUserId);
        setToken(newToken);
        setUserId(newUserId);
    };

    const logout = () => {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userId");
        setToken(null);
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ token, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);


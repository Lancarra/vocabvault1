import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const login = async (credentials) => {
        try {
            const res = await axios.post(`${API_URL}/auth/login`, credentials, {
                withCredentials: true,
            });
            setUser(res.data);
            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || "Login failed",
            };
        }
    };

    const register = async (credentials) => {
        try {
            const res = await axios.post(`${API_URL}/register`, credentials, {
                withCredentials: true,
            });
            setUser(res.data);
            return { success: true };
        } catch (err) {
            console.error("Detailed error:", err.response?.data);
            return {
                success: false,
                message:
                    err.response?.data?.errors?.generalErrors?.join("; ") ||
                    err.response?.data?.message ||
                    "Registration failed",
            };
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${API_URL}/auth/logout`, {}, {
                withCredentials: true,
            });
        } catch (err) {
            console.warn("Logout request failed. Possibly already logged out.");
        } finally {
            setUser(null);
            navigate("/"); // если ты ещё не добавила — перенаправление после logout
        }
    };


    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

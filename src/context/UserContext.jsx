import React, { createContext, useEffect, useState } from "react";
import { getUserById, fetchAvatarUrl } from "../services/userService";
import { useAuth } from "./AuthContext";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const { userId } = useAuth();
    const [user, setUser] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);

    const loadUser = async () => {
        if (!userId) return;

        try {
            const userData = await getUserById(userId);
            setUser(userData);

            if (userData.blobId) {
                const url = await fetchAvatarUrl(userData.blobId);
                setAvatarUrl(url);
            } else {
                setAvatarUrl(null); // сброс если удалили
            }
        } catch (err) {
            console.error("Error loading user:", err);
        }
    };

    useEffect(() => {
        loadUser();
    }, [userId]);

    return (
        <UserContext.Provider value={{ user, avatarUrl, refreshUser: loadUser }}>
            {children}
        </UserContext.Provider>
    );
};

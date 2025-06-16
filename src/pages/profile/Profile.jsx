import React from "react";
import { useEffect, useState } from "react";
import { getUserById } from "../../services/userService.js";
import { useAuth } from "../../context/AuthContext.jsx";

const Profile = () => {
    const { userId } = useAuth(); //
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!userId) return;

        getUserById(userId)
            .then(data => {
                console.log("User loaded:", data);
                setUser(data);
            })
            .catch(err => console.error("Get user error:", err.response?.data || err.message));
    }, [userId]);

    if (!user) return <p>Loading...</p>;

    return (
        <div>
            <h2>Profile</h2>
            <p>ID: {user.userId}</p>
            <p>Email: {user.email}</p>
        </div>
    );
};

export default Profile;

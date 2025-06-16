import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserMenu.css";
import ThemeToggle from "../components/ThemeToggle.jsx";

const UserMenu = ({ user, onLogout }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="user-menu">
            {user?.avatar ? (
                <img
                    src={user.avatar}
                    alt="avatar"
                    className="avatar-icon"
                    onClick={() => setOpen(!open)}
                />
            ) : (
                <div className="avatar-icon avatar-placeholder" onClick={() => setOpen(!open)}>
                    {user?.username?.[0]?.toUpperCase() || "U"}
                </div>
            )}

            {open && (
                <div className="dropdown">
                    <div className="dropdown-header">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="avatar" />
                        ) : (
                            <div className="avatar-icon avatar-placeholder">
                                {user?.username?.[0]?.toUpperCase() || "U"}
                            </div>
                        )}
                        <div>
                            <div className="username">{user?.username || "User"}</div>
                            <div className="email">{user?.email || ""}</div>
                        </div>
                    </div>

                    <div
                        className="dropdown-item"
                        onClick={() => {
                            setOpen(false);
                            navigate("/profile");
                        }}
                    >
                        👤 Profile
                    </div>

                    <ThemeToggle />

                    <div
                        className="dropdown-item"
                        onClick={() => {
                            setOpen(false);
                            navigate("/change-password");
                        }}
                    >
                        🔒 Change Password
                    </div>

                    <div className="dropdown-item" onClick={onLogout}>
                        🚪 Logout
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;

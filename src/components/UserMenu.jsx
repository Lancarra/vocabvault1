import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./userMenu.css";
import avatarImg from "../assets/avatar.png";
import { UserContext } from "../context/UserContext";
import ThemeToggle from "./ThemeToggle";
import { User, Lock, LogOut } from "lucide-react";

function UserMenu() {
    const [open, setOpen] = useState(false);
    const menuRef = useRef();
    const navigate = useNavigate();
    const { avatarUrl } = useContext(UserContext);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="user-menu" ref={menuRef}>
            <img
                src={avatarUrl || avatarImg}
                alt="User avatar"
                className="avatar"
                onClick={() => setOpen((prev) => !prev)}
            />
            {open && (
                <div className="dropdown_profile">
                    <button onClick={() => navigate("/profile")}>
                        <User size={18} style={{ marginRight: "8px" }} /> Profile
                    </button>
                    <button onClick={() => navigate("/change-password")}>
                        <Lock size={18} style={{ marginRight: "8px" }} /> Change Password
                    </button>
                    <button className="theme-toggle-button">
                        <ThemeToggle />
                    </button>
                    <button onClick={handleLogout}>
                        <LogOut size={18} style={{ marginRight: "8px" }} /> Logout
                    </button>
                </div>
            )}
        </div>
    );
}

export default UserMenu;

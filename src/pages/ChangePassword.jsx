import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ⬅️ добавляем
import axios from "axios";
import API_URL from "../api";
//import "./ChangePassword.css";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate(); // ⬅️ добавляем навигацию

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            await axios.post(
                `${API_URL}/auth/change-password`,
                { currentPassword, newPassword },
                { withCredentials: true }
            );
            setMessage("Password changed successfully.!");
            setCurrentPassword("");
            setNewPassword("");
        } catch (err) {
            const msg =
                err.response?.data?.errors?.[0] ||
                err.response?.data?.message ||
                "Error changing password.";
            setError(msg);
        }
    };

    return (
        <div className="dashboard-container">
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit} className="form-container">
                <label>
                    Current Password:
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </label>
                <label>
                    New Password:
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Change Password</button>
            </form>

            {message && <p style={{ color: "green" }}>✅ {message}</p>}
            {error && <p style={{ color: "red" }}>❌ {error}</p>}

            {/* ⬇️ Кнопка Назад */}
            <button
                style={{ marginTop: "15px", backgroundColor: "#eee", color: "#333" }}
                onClick={() => navigate("/dashboard")} // ⬅️ теперь идёт на главную
            >
                ← Back to Dashboard
            </button>

        </div>
    );
};

export default ChangePassword;

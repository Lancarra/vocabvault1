import React, { useEffect, useState, useContext } from "react";
import {
    getUserById,
    updateUser,
    uploadUserAvatar
} from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import { UserContext } from "../../context/UserContext";
import "./Profile.css";

const Profile = () => {
    const { userId } = useAuth();
    const { avatarUrl, refreshUser } = useContext(UserContext);

    const [user, setUser] = useState(null);
    const [file, setFile] = useState(null);
    const [editField, setEditField] = useState(null);
    const [formData, setFormData] = useState({ username: "", email: "" });
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!userId) return;
        getUserById(userId)
            .then(data => {
                setUser(data);
                setFormData({ username: data.username || "", email: data.email || "" });
            })
            .catch(err => console.error("Get user error:", err));
    }, [userId]);

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleUpload = async () => {
        if (!file) return;
        try {
            const updatedUser = await uploadUserAvatar(userId, file);
            setUser(updatedUser);
            setFile(null);
            await refreshUser();
        } catch (err) {
            console.error("Upload error:", err);
        }
    };

    const handleSave = async () => {
        const payload = {
            username: formData.username,
            email: formData.email,
            password: "", // обязательное поле
            googleAuthCode: "",
            blobId: user.blobId || ""
        };

        try {
            const updated = await updateUser(userId, payload);
            setUser(updated);
            setEditField(null);
            setMessage("Updated successfully.");

            // ✅ Обновляем localStorage
            const prevUserRaw = localStorage.getItem("user");
            if (prevUserRaw) {
                const prevUser = JSON.parse(prevUserRaw);
                const newUser = {
                    ...prevUser,
                    username: payload.username,
                    email: payload.email
                };
                localStorage.setItem("user", JSON.stringify(newUser));
            }
        } catch (err) {
            console.error("Update error:", err);
            setMessage("Update failed.");
        }
    };


    if (!user) return <p>Loading...</p>;

    return (
        <div className="profile-horizontal-wrapper">
            <div className="profile-left">
                <img src={avatarUrl} className="profile-avatar-img" alt="avatar" />
                <div className="profile-avatar-buttons">
                    <label className="avatar-change-label">
                        📷 Change profile photo
                        <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                    </label>
                    <button
                        className={`upload-button ${file ? "active" : ""}`}
                        onClick={handleUpload}
                        disabled={!file}
                    >
                        Upload
                    </button>
                </div>
            </div>

            <div className="profile-right">
                {["username", "email"].map((field) => (
                    <div key={field} className="profile-field-row">
                        <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                        <div className="field-content">
                            {editField === field ? (
                                <>
                                    <input
                                        type="text"
                                        value={formData[field]}
                                        onChange={(e) =>
                                            setFormData({ ...formData, [field]: e.target.value })
                                        }
                                    />
                                    <div className="field-buttons">
                                        <button onClick={handleSave}>Save</button>
                                        <button onClick={() => setEditField(null)}>Cancel</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span className={field === "email" ? "underlined-text" : ""}>
                                        {user[field] || "Not set"}
                                    </span>
                                    <button className="edit-button" onClick={() => setEditField(field)}>
                                        Edit
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
                {message && <p className="profile-message">{message}</p>}
            </div>
        </div>
    );
};

export default Profile;

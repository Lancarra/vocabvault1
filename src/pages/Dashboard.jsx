import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 импортируем навигатор
import API_URL from "../api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate(); // 👈 инициализируем

    const [dictionaries, setDictionaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newDictName, setNewDictName] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");

    const fetchDictionaries = async () => {
        try {
            const res = await fetch(`${API_URL}/translator/dictionariesforuser`, {
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to fetch dictionaries");
            const data = await res.json();

            const cleanData = Array.isArray(data)
                ? data.filter((d) => d && d.name)
                : [];

            setDictionaries(cleanData);
        } catch (err) {
            console.error("Failed to fetch dictionaries:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newDictName.trim()) return;

        try {
            const res = await fetch(`${API_URL}/translator/dictionaries`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name: newDictName }),
            });

            if (!res.ok) throw new Error("Failed to create dictionary");

            setNewDictName("");
            await fetchDictionaries();
        } catch (err) {
            console.error("Create failed:", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${API_URL}/translator/dictionaries/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to delete dictionary");
            setDictionaries((prev) => prev.filter((d) => d.id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const handleUpdate = async (id) => {
        try {
            const res = await fetch(`${API_URL}/translator/dictionaries/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name: editValue }),
            });

            if (!res.ok) throw new Error("Update failed");

            setDictionaries((prev) =>
                prev.map((d) => (d.id === id ? { ...d, name: editValue } : d))
            );
            setEditingId(null);
            setEditValue("");
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    useEffect(() => {
        fetchDictionaries();
    }, []);

    return (
        <div className="dashboard-container">
            <div className="header">
                <h1>Welcome, {user?.username || "User"}!</h1>
                <button onClick={logout}>Logout</button>
            </div>

            <form onSubmit={handleCreate} className="create-form">
                <input
                    type="text"
                    placeholder="New dictionary name"
                    value={newDictName}
                    onChange={(e) => setNewDictName(e.target.value)}
                />
                <button type="submit">Create</button>
            </form>

            <h2>Your Dictionaries</h2>
            {loading ? (
                <p>Loading...</p>
            ) : dictionaries.length === 0 ? (
                <p>No dictionaries found.</p>
            ) : (
                <ul className="dict-list">
                    {dictionaries.map((dict, index) => (
                        <li key={dict.id || `${dict.name}-${index}`}>
                            {editingId === dict.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                    />
                                    <button onClick={() => handleUpdate(dict.id)}>Save</button>
                                    <button onClick={() => setEditingId(null)}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <span>{dict.name}</span>
                                    <button
                                        onClick={() => {
                                            setEditingId(dict.id);
                                            setEditValue(dict.name);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(dict.id)}>Delete</button>
                                    <button onClick={() => navigate(`/definitions/${dict.id}`)}>
                                        View
                                    </button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dashboard;

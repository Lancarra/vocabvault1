import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../api";

const Definitions = () => {
    const { dictId } = useParams();
    const navigate = useNavigate();

    const [dictionaryName, setDictionaryName] = useState("");
    const [definitions, setDefinitions] = useState([]);
    const [newTerm, setNewTerm] = useState("");
    const [newMeaning, setNewMeaning] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editTerm, setEditTerm] = useState("");
    const [editMeaning, setEditMeaning] = useState("");

    const fetchDictionaryName = async () => {
        try {
            const res = await fetch(`${API_URL}/translator/dictionaries`, {
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to fetch dictionaries");

            const allDictionaries = await res.json();
            const dict = allDictionaries.find((d) => d.id === Number(dictId));

            setDictionaryName(dict?.name || `Dictionary ID: ${dictId}`);
        } catch (err) {
            console.error("Failed to fetch dictionary name:", err);
            setDictionaryName(`Dictionary ID: ${dictId}`);
        }
    };


    const fetchDefinitions = async () => {
        try {
            const res = await fetch(`${API_URL}/translator/definitions`, {
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to fetch definitions");

            const allDefs = await res.json();
            const filtered = allDefs.filter((d) => d.dictionaryId === Number(dictId));
            setDefinitions(filtered);
        } catch (err) {
            console.error("Failed to fetch definitions:", err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newTerm.trim() || !newMeaning.trim()) return;

        try {
            const res = await fetch(`${API_URL}/translator/definitions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    id: 0,
                    word: newTerm,
                    meaning: newMeaning,
                    dictionaryId: Number(dictId),
                }),
            });

            if (!res.ok) throw new Error("Failed to create definition");

            setNewTerm("");
            setNewMeaning("");
            fetchDefinitions();
        } catch (err) {
            console.error("Create failed:", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${API_URL}/translator/definitions/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Delete failed");

            setDefinitions((prev) => prev.filter((d) => d.id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const handleUpdate = async (id) => {
        try {
            const res = await fetch(`${API_URL}/translator/definitions/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    id,
                    word: editTerm,
                    meaning: editMeaning,
                    dictionaryId: Number(dictId),
                }),
            });

            if (!res.ok) throw new Error("Update failed");

            setDefinitions((prev) =>
                prev.map((d) => (d.id === id ? { ...d, word: editTerm, meaning: editMeaning } : d))
            );
            setEditingId(null);
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    useEffect(() => {
        fetchDefinitions();
        fetchDictionaryName();
    }, [dictId]);

    return (
        <div className="definitions-page">
            <button onClick={() => navigate("/dashboard")}>⬅ Back</button>
            <h2>{dictionaryName}</h2>

            <form onSubmit={handleCreate}>
                <input
                    type="text"
                    placeholder="Word / Term"
                    value={newTerm}
                    onChange={(e) => setNewTerm(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Meaning"
                    value={newMeaning}
                    onChange={(e) => setNewMeaning(e.target.value)}
                />
                <button type="submit">Add</button>
            </form>

            <ul>
                {definitions.map((def) => (
                    <li key={def.id}>
                        {editingId === def.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editTerm}
                                    onChange={(e) => setEditTerm(e.target.value)}
                                />
                                <input
                                    type="text"
                                    value={editMeaning}
                                    onChange={(e) => setEditMeaning(e.target.value)}
                                />
                                <button onClick={() => handleUpdate(def.id)}>Save</button>
                                <button onClick={() => setEditingId(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <strong>{def.word}:</strong> {def.meaning}
                                <button
                                    onClick={() => {
                                        setEditingId(def.id);
                                        setEditTerm(def.word);
                                        setEditMeaning(def.meaning);
                                    }}
                                >
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(def.id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Definitions;

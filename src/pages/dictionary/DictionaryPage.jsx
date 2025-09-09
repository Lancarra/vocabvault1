import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    getAllDefinitions,
    createDefinition,
    updateDefinition,
    deleteDefinition,
    uploadDefinitionImage,
    fetchDefinitionImage
} from "../../services/dictionaryService";
import "./dictionary.css";
import AddPhotoIcon from "../../assets/add-photo.png";
import Modal from "../../components/modalWindow/Modal.jsx";

function DictionaryPage() {
    const location = useLocation();
    const { dictionary_id, dictionary_name } = location.state;
    const navigate = useNavigate();

    const [words, setWords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("input");
    const [selectedWord, setSelectedWord] = useState(null);
    const [openDropdownId, setOpenDropdownId] = useState(null);

    const [defaultWord, setDefaultWord] = useState("");
    const [defaultMeaning, setDefaultMeaning] = useState("");

    const [modalImageFile, setModalImageFile] = useState(null);
    const [modalImagePreview, setModalImagePreview] = useState(null);

    const fileInputRef = useRef({});

    useEffect(() => {
        fetchWords();
    }, [dictionary_id]);

    useEffect(() => {
        const closeDropdown = (e) => {
            if (!e.target.closest(".dropdown")) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener("click", closeDropdown);
        return () => document.removeEventListener("click", closeDropdown);
    }, []);

    const fetchWords = async () => {
        setIsLoading(true);
        try {
            const data = await getAllDefinitions(dictionary_id);

            const enrichedWords = await Promise.all(
                data.map(async (word) => {
                    let blobURL = null;
                    if (word.blobId) {
                        try {
                            blobURL = await fetchDefinitionImage(word.blobId);
                        } catch (e) {
                            console.warn(`Не удалось загрузить blobId: ${word.blobId}`);
                        }
                    }
                    return { ...word, blobURL };
                })
            );

            setWords(enrichedWords);
        } catch (err) {
            console.error("Error loading words:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const openCreateModal = () => {
        setModalMode("input");
        setIsModalOpen(true);
        setDefaultWord("");
        setDefaultMeaning("");
        setModalImageFile(null);
        setModalImagePreview(null);
    };

    const openEditModal = (word) => {
        setSelectedWord(word);
        setDefaultWord(word.word);
        setDefaultMeaning(word.meaning);
        setModalMode("edit-word");
        setIsModalOpen(true);
        setModalImageFile(null);
        setModalImagePreview(null);
    };

    const openDeleteModal = (word) => {
        setSelectedWord(word);
        setModalMode("delete");
        setIsModalOpen(true);
    };

    const handleModalFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setModalImageFile(file);
            setModalImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSaveWord = async (modalData) => {
        try {
            let definitionId = null;

            if (modalMode === "input") {
                if (!modalData?.trim()) return;
                await createDefinition({
                    word: modalData,
                    meaning: "",
                    blobURL: "",
                    dictionaryId: dictionary_id,
                });

                const latest = await getAllDefinitions(dictionary_id);
                definitionId = latest.at(-1)?.id;

            } else if (modalMode === "edit-word" && selectedWord) {
                await updateDefinition(selectedWord.id, {
                    word: modalData.word,
                    meaning: modalData.meaning,
                    blobURL: selectedWord.blobURL || "",
                    dictionaryId: dictionary_id,
                });
                definitionId = selectedWord.id;

            } else if (modalMode === "delete" && selectedWord) {
                await deleteDefinition(selectedWord.id);
            }

            if (modalImageFile && definitionId) {
                await uploadDefinitionImage(definitionId, modalImageFile);
            }

            setIsModalOpen(false);
            setSelectedWord(null);
            setDefaultWord("");
            setDefaultMeaning("");
            setModalImageFile(null);
            setModalImagePreview(null);

            await fetchWords();
        } catch (err) {
            console.error("Word action failed:", err);
        }
    };

    const handleFileChange = async (e, definitionId) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            await uploadDefinitionImage(definitionId, file);
            await fetchWords();
        } catch (err) {
            console.error("Upload error:", err);
        }
    };

    return (
        <div className="dictionary-page">
            <div className="container">
                <h2 className="dictionary-heading">
                    Words in dictionary: <span>{dictionary_name ?? "Unknown"}</span>
                </h2>

                <div className="top-bar">
                    <div className="button-group">
                        <button className="create-button" onClick={openCreateModal}>
                            + Add Word
                        </button>
                        <button
                            className="create-button learn-word-button"
                            onClick={() =>
                                navigate("/dashboard/module/folder/dictionary/learnword", {
                                    state: { dictionaryId: dictionary_id },
                                })
                            }
                        >
                            Learn Words
                        </button>
                    </div>
                </div>

                <div className="word-grid">
                    {isLoading ? (
                        "Loading..."
                    ) : (
                        words.map((word) => (
                            <div className="word-row" key={word.id}>
                                <img
                                    src={word.blobURL || AddPhotoIcon}
                                    alt="word icon"
                                    className="word-img"
                                    onClick={() => fileInputRef.current[word.id]?.click()}
                                    style={{ cursor: "pointer" }}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={(el) => (fileInputRef.current[word.id] = el)}
                                    style={{ display: "none" }}
                                    onChange={(e) => handleFileChange(e, word.id)}
                                />

                                <div className="word-content">
                                    <div className="word-text">{word.word}</div>
                                    <div className="divider" />
                                    <div className="word-meaning">{word.meaning || "—"}</div>
                                </div>

                                <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        className="dropdown-toggle"
                                        onClick={() =>
                                            setOpenDropdownId((prev) => (prev === word.id ? null : word.id))
                                        }
                                    >
                                        ⋯
                                    </button>
                                    {openDropdownId === word.id && (
                                        <div className="dropdown-menu">
                                            <button onClick={() => openEditModal(word)}>Edit</button>
                                            <button onClick={() => openDeleteModal(word)}>Delete</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <Modal
                    title={
                        modalMode === "edit-word"
                            ? "Edit Word"
                            : modalMode === "delete"
                                ? "Delete Word"
                                : "Add New Word"
                    }
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setModalImageFile(null);
                        setModalImagePreview(null);
                    }}
                    onSave={handleSaveWord}
                    mode={
                        modalMode === "delete"
                            ? "confirm"
                            : modalMode === "edit-word"
                                ? "edit-word"
                                : "input"
                    }
                    defaultValue={defaultWord}
                    defaultMeaning={defaultMeaning}
                    onFileChange={handleModalFileChange}
                    previewUrl={modalImagePreview}
                />
            </div>
        </div>
    );
}

export default DictionaryPage;

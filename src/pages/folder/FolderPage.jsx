import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    getAllDictionariesInFolder,
    createDictionary,
    updateDictionary,
    deleteDictionary
} from '../../services/folderService';
import folderIcon from '../../assets/dictionary-icon.png';
import './folder.css';
import Modal from '../../components/modalWindow/Modal.jsx';

function FolderPage() {
    const location = useLocation();
    const { folder_id, folder_name } = location.state;

    const [dicts, setDicts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState(null);
    const [selectedDict, setSelectedDict] = useState(null);
    const [openDropdownId, setOpenDropdownId] = useState(null);

    useEffect(() => {
        fetchDictionaries();
    }, [folder_id]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.dropdown')) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchDictionaries = async () => {
        try {
            const data = await getAllDictionariesInFolder(folder_id);
            setDicts(data);
        } catch (err) {
            console.error("Error getting dictionaries:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalOpen = (mode, dict = null) => {
        setModalMode(mode);
        setSelectedDict(dict);
        setIsModalOpen(true);
        setOpenDropdownId(null);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalMode(null);
        setSelectedDict(null);
    };

    const handleSaveModal = async (value) => {
        const trimmed = typeof value === 'string' ? value.trim() : '';

        try {
            if (modalMode === 'create') {
                if (!trimmed) return;
                await createDictionary(trimmed, folder_id);
            } else if (modalMode === 'rename' && selectedDict) {
                if (!trimmed || trimmed === selectedDict.name) return;
                await updateDictionary(selectedDict.id, trimmed, folder_id);
            } else if (modalMode === 'delete' && selectedDict) {
                await deleteDictionary(selectedDict.id);
            }

            await fetchDictionaries();
        } catch (err) {
            console.error('Action failed:', err);
        } finally {
            handleModalClose();
        }
    };

    return (
        <div className="folder-page">
            <div className="container">
                <h2 className="folder-heading">
                    Your dictionaries in folder: <span>{folder_name ?? "Unknown"}</span>
                </h2>

                <div className="top-bar">
                    <button className="create-button" onClick={() => handleModalOpen('create')}>
                        + Create Dictionary
                    </button>
                </div>

                <div className="dictionaries-grid">
                    {isLoading ? (
                        "Loading..."
                    ) : (
                        dicts.map((dict) => (
                            <div className="dictionary-card" key={dict.id}>
                                <Link
                                    to={`/dashboard/module/folder/dictionary`}
                                    state={{ dictionary_id: dict.id, dictionary_name: dict.name }}
                                    className="dictionary-link"
                                >
                                    <img src={folderIcon} alt="dictionary icon" className="dictionary-icon" />
                                    <div className="dictionary-info">
                                        <h3>{dict.name}</h3>
                                        <p>{dict.wordCount || 0} words</p>
                                    </div>
                                </Link>

                                <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        className="dropdown-toggle"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenDropdownId((prevId) => (prevId === dict.id ? null : dict.id));
                                        }}
                                    >
                                        ⋯
                                    </button>
                                    {openDropdownId === dict.id && (
                                        <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                                            <button onClick={() => handleModalOpen('rename', dict)}>Rename</button>
                                            <button onClick={() => handleModalOpen('delete', dict)}>Delete</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <Modal
                    isOpen={isModalOpen}
                    defaultValue={modalMode === 'rename' ? selectedDict?.name : ''}
                    onClose={handleModalClose}
                    onSave={handleSaveModal}
                    title={
                        modalMode === 'rename'
                            ? 'Rename Dictionary'
                            : modalMode === 'create'
                                ? 'Create New Dictionary'
                                : 'Delete Dictionary'
                    }
                    mode={modalMode === 'delete' ? 'confirm' : 'input'}
                    confirmText="Are you sure you want to delete this dictionary?"
                />
            </div>
        </div>
    );
}

export default FolderPage;
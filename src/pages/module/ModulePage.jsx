import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    getAllFolders,
    createFolder,
    updateFolder,
    deleteFolder
} from '../../services/moduleService.js';
import Modal from '../../components/modalWindow/Modal.jsx';
import folderIcon from '../../assets/folder-icon.svg';
import './module.css';

function ModulePage() {
    const { module_id, module_name } = useLocation().state;

    const [folders, setFolders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState(null); // 'create' | 'rename' | 'delete'
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [openDropdownId, setOpenDropdownId] = useState(null);

    useEffect(() => {
        fetchFolders();
    }, [module_id]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.dropdown')) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchFolders = async () => {
        try {
            const data = await getAllFolders(module_id);
            setFolders(data);
        } catch (error) {
            console.error('Error fetching folders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalOpen = (mode, folder = null) => {
        setModalMode(mode);
        setSelectedFolder(folder);
        setIsModalOpen(true);
        setOpenDropdownId(null);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalMode(null);
        setSelectedFolder(null);
    };

    const handleSaveModal = async (value) => {
        const trimmed = typeof value === 'string' ? value.trim() : '';

        try {
            if (modalMode === 'rename' && selectedFolder) {
                if (!trimmed || trimmed === selectedFolder.name) return;
                await updateFolder(selectedFolder.id, trimmed, module_id);
            } else if (modalMode === 'create') {
                if (!trimmed) return;
                await createFolder(trimmed, module_id);
            } else if (modalMode === 'delete' && selectedFolder) {
                await deleteFolder(selectedFolder.id);
            }

            await fetchFolders();
        } catch (error) {
            console.error('Folder action failed:', error);
        } finally {
            handleModalClose();
        }
    };

    return (
        <div className="module-page">
            <div className="container">
                <h2 className="module-greeting">
                    Folders in module: <span>{module_name}</span>
                </h2>

                <div className="top-bar">
                    <button className="create-button" onClick={() => handleModalOpen('create')}>
                        + Create Folder
                    </button>
                </div>

                <div className="folders-grid">
                    {isLoading ? (
                        "Loading..."
                    ) : (
                        folders.map((folder) => (
                            <div className="folder-card" key={folder.id}>
                                <div className="folder-header">
                                    <Link
                                        to={`/dashboard/module/folder`}
                                        state={{ folder_id: folder.id, folder_name: folder.name }}
                                        className="folder-link"
                                    >
                                        <img src={folderIcon} alt="folder" className="folder-icon" />
                                        <div className="folder-info">
                                            <h3>{folder.name}</h3>
                                            <p>{folder.dictionaryCount || 0} dictionaries</p>
                                        </div>
                                    </Link>

                                    <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            className="dropdown-toggle"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenDropdownId((prevId) => prevId === folder.id ? null : folder.id);
                                            }}
                                        >
                                            ⋯
                                        </button>
                                        {openDropdownId === folder.id && (
                                            <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                                                <button onClick={() => handleModalOpen('rename', folder)}>Rename</button>
                                                <button onClick={() => handleModalOpen('delete', folder)}>Delete</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <Modal
                    isOpen={isModalOpen}
                    defaultValue={modalMode === 'rename' ? selectedFolder?.name : ''}
                    onClose={handleModalClose}
                    onSave={handleSaveModal}
                    title={
                        modalMode === 'rename'
                            ? 'Rename Folder'
                            : modalMode === 'create'
                                ? 'Create New Folder'
                                : 'Delete Folder'
                    }
                    mode={modalMode === 'delete' ? 'confirm' : 'input'}
                    confirmText="Are you sure you want to delete this folder?"
                />
            </div>
        </div>
    );
}

export default ModulePage;

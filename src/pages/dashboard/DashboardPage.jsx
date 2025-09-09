import React, { useEffect, useState } from 'react';
import {
    getAllModules,
    createModule,
    updateModule,
    deleteModule
} from '../../services/dashboardService.js';
import { getUserById } from '../../services/userService.js'; // NEW
import { Link } from 'react-router-dom';
import './dashboard.css';
import Modal from '../../components/modalWindow/Modal.jsx';
import FolderVisual from '../../assets/folder-visual.png';

function DashboardPage() {
    const [modules, setModules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    const currentUserId =
        user?.id ?? user?.userId ?? Number(localStorage.getItem("userId"));
    const getDisplayName = (u) =>
        u?.username || (u?.email ? u.email.split("@")[0] : undefined);
    const currentUserName = getDisplayName(user) || "User";

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);
    const [openDropdownId, setOpenDropdownId] = useState(null);

    const [authors, setAuthors] = useState({}); // NEW: { [userId]: "username" }

    useEffect(() => {
        fetchModules();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.dropdown')) setOpenDropdownId(null);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchModules = async () => {
        try {
            const data = await getAllModules();
            setModules(data || []);
            await ensureAuthorsLoaded(data || []); // NEW
        } catch (error) {
            console.error('Error getting modules:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // NEW: докачиваем имена авторов и кэшируем
    const ensureAuthorsLoaded = async (mods) => {
        const ids = Array.from(new Set(mods.map(m => m.userId).filter(Boolean)));
        const need = ids.filter(id => authors[id] === undefined);
        if (need.length === 0) return;

        try {
            const pairs = await Promise.all(
                need.map(async (id) => {
                    try {
                        const u = await getUserById(id);             // ожидаем { id, username, email, ... }
                        const name = u?.username || u?.name || (u?.email ? u.email.split('@')[0] : `User #${id}`);
                        return [id, name];
                    } catch {
                        return [id, `User #${id}`];
                    }
                })
            );
            setAuthors(prev => {
                const next = { ...prev };
                pairs.forEach(([id, name]) => { next[id] = name; });
                return next;
            });
        } catch (e) {
            console.error('Failed to load authors:', e);
        }
    };

    const handleModalOpen = (mode, module = null) => {
        setModalMode(mode);
        setSelectedModule(module);
        setIsModalOpen(true);
        setOpenDropdownId(null);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalMode(null);
        setSelectedModule(null);
    };

    const handleSaveModal = async (value) => {
        const trimmed = typeof value === 'string' ? value.trim() : '';
        try {
            if (modalMode === 'rename') {
                if (!trimmed || trimmed === selectedModule.name) return;
                await updateModule(selectedModule.id, trimmed, selectedModule.userId);
            } else if (modalMode === 'create') {
                if (!trimmed) return;
                const userId = localStorage.getItem("userId");
                if (!userId) throw new Error("userId not found in localStorage");
                await createModule(trimmed, Number(userId));
            } else if (modalMode === 'delete') {
                await deleteModule(selectedModule.id);
            }
            await fetchModules();
        } catch (err) {
            console.error('Action failed:', err);
        } finally {
            handleModalClose();
        }
    };

    return (
        <div className="dashboard-page">
            <div className="container">
                <h2 className="dashboard-greeting">
                    Glad to see you, <span>{currentUserName}</span>! Here are your modules.
                </h2>

                <div className="top-bar">
                    <button className="create-button" onClick={() => handleModalOpen('create')}>
                        + Create Module
                    </button>
                </div>

                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="modules-grid">
                        {modules.map((module) => {
                            // NEW: красивое имя автора
                            const authorName =
                                getDisplayName(module.user) ??
                                module.userName ??
                                (module.userId === currentUserId ? currentUserName : undefined) ??
                                authors[module.userId] ??
                                `User #${module.userId}`;

                            return (
                                <div className="module-card" key={module.id}>
                                    <div className="module-header">
                                        <Link
                                            to={`/dashboard/module`}
                                            state={{ module_id: module.id, module_name: module.name }}
                                            className="module-link"
                                        >
                                            <img src={FolderVisual} alt="icon" className="module-icon" />
                                            <div className="module-info">
                                                <h3>{module.name}</h3>
                                                <p>{module.folderCount || 0} folders; Author: {authorName}</p>
                                            </div>
                                        </Link>

                                        <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                className="dropdown-toggle"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenDropdownId(prev => prev === module.id ? null : module.id);
                                                }}
                                            >
                                                ⋯
                                            </button>
                                            {openDropdownId === module.id && (
                                                <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                                                    <button onClick={() => handleModalOpen('rename', module)}>Rename</button>
                                                    <button onClick={() => handleModalOpen('delete', module)}>Delete</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <Modal
                    isOpen={isModalOpen}
                    defaultValue={modalMode === 'rename' ? selectedModule?.name : ''}
                    onClose={handleModalClose}
                    onSave={handleSaveModal}
                    title={
                        modalMode === 'rename'
                            ? "Rename Module"
                            : modalMode === 'create'
                                ? "Create New Module"
                                : "Delete Module"
                    }
                    mode={modalMode === 'delete' ? 'confirm' : 'input'}
                />
            </div>
        </div>
    );
}

export default DashboardPage;

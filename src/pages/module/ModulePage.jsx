import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import SearchImg from '../../assets/search-img.png'; // адаптируй путь
import './module.css';

function ModulePage() {
    const location = useLocation();
    const { module_id } = location.state;
    const [folders, setFolders] = useState([
        { id: 1, name: "Family" },
        { id: 2, name: "Friends" },
        { id: 3, name: "Work" }
    ]);
    const [isLoading, setIsLoading] = useState();

    const getFolders = async () => {
        try {
            const response = await axios(`http://localhost:7271/folder/get-all-folders/${module_id}`, {
                headers: { 'Content-Type': 'application/json' }
            });
            const folder_data = response.data;
            setFolders(folder_data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        setIsLoading(false);
        // getFolders();
    }, [folders]);

    return (
        <div className="app_layout">
            <header className="header">
                <div className="header-left">
                    <h2 className="logo">Name of project</h2>
                </div>

                <div className="header-center">
                    <div className="search_bar">
                        <img src={SearchImg} alt="search" />
                        <input type="text" placeholder="Search..." />
                    </div>
                </div>

                <div className="header-right">
                    <Link to="/profile" className="profile-btn">Profile</Link>
                </div>
            </header>

            <main className="module-main">
                <div className="module-header">
                    <h1>Your folders are here</h1>
                </div>

                <div className="folder-grid">
                    {isLoading ? "Loading..." : folders.map((folder, index) => (
                        <Link to={`/dashboard/module/folder`} key={index} state={{ folder_id: folder.id }}>
                            <div className="folder-card">
                                <h3>{folder.name}</h3>
                                <p>{folder.dictionaryCount || 0} dictionaries</p>
                            </div>
                        </Link>
                    ))}
                </div>

            </main>
        </div>
    );
}

export default ModulePage;

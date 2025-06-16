import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './dashboard.css'; // ← Подключен твой стиль
import SearchImg from '../../assets/search-img.png';


function DashboardPage() {
    const [modules, setModules] = useState([
        { id: 1, name: 'A1-A2', folderCount: 4, author: 'Admin' },
        { id: 2, name: 'A3-A4', folderCount: 6, author: 'Admin' },
        { id: 3, name: 'B1-B2', folderCount: 3, author: 'Admin' },
        { id: 4, name: 'B2-B2+', folderCount: 5, author: 'Admin' },
        { id: 5, name: 'C1', folderCount: 2, author: 'Admin' },
    ]);
    const [isLoading, setIsLoading] = useState(false);

    // Пример API запроса — пока закомментирован
    // useEffect(() => {
    //     const getModules = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:7271/course-module/get-all-modules', {
    //                 headers: { 'Content-Type': 'application/json' },
    //             });
    //             setModules(response.data);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };
    //     getModules();
    // }, []);

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


            <main className="dashboard-main">
                <div className="dashboard-header">
                    <h1>Your modules are here</h1>
                </div>

                <div className="module-grid">
                    {isLoading ? (
                        "Loading..."
                    ) : (
                        modules.map((module, index) => (
                            <Link
                                to={`/dashboard/module`}
                                key={index}
                                state={{ module_id: module.id }}
                                className="module-card"
                            >
                                <h3>{module.name}</h3>
                                <p>{module.folderCount || 0} folders; {module.author || "Admin"}</p>
                            </Link>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}

export default DashboardPage;

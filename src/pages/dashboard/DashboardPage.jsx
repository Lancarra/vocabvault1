import React, { useEffect, useState } from 'react';
import { getAllModules } from '../../services/moduleService';
import { Link } from 'react-router-dom';
import './dashboard.css';
import FolderVisual from '../../assets/folder-visual.png'; // иконка

function DashboardPage() {
    const [modules, setModules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const userName = 'Alex'; // заглушка

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const data = await getAllModules();
                setModules(data);
            } catch (error) {
                console.error('Error getting modules:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchModules();
    }, []);

    const filteredModules = modules.filter((module) =>
        module.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard-page">
            <div className="container">
                <h2 className="dashboard-greeting">
                    Glad to see you, <span>{userName}</span>! Here are your modules.
                </h2>

                <div className="modules-grid">
                    {filteredModules.map((module, index) => (
                        <Link
                            to={`/dashboard/module`}
                            key={index}
                            state={{ module_id: module.id }}
                            className="module-card"
                        >
                            <img src={FolderVisual} alt="icon" className="module-icon" />
                            <div className="module-info">
                                <h3>{module.name}</h3>
                                <p>{module.folderCount || 0} folders; Author: {module.userId}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;

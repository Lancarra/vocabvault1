import React, {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";
import axios from "axios";
import './folder.css';

function FolderPage() {
    const location = useLocation();
    const {folder_id} = location.state;
    console.log(folder_id);
    const [dicts, setDicts] = useState([
        {
            id:1,
            name: "Parents"
        },
        {
            id:2,
            name: "Children"
        },
        {
            id:3,
            name: "Siblings"
        }
    ])
    const [isLoading, setIsLoading] = useState();

    const getDicts = async () => {
        try {
            const response = await axios(`http://localhost:7271/folder/get-all-folders/${folder_id}`,{
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const dicts_data = response.data;
            setDicts(dicts_data);
            setIsLoading(false)
        }catch (err){
            console.log(err);
        }
    }
    useEffect(() => {
        setIsLoading(false)
        // getDicts();
    }, [dicts]);
    return (
        <div className="folder-main">
            <h1 className="folder-header">Your dictionaries are here</h1>

            <div className="dict-list">
                {isLoading
                    ? "Loading..."
                    : dicts.map((dict, index) => (
                        <Link
                            to={`/dashboard/module/folder/dictionary`}
                            key={index}
                            state={{ dict_id: dict.id }}
                            className="dict-card"
                        >
                            <h3>{dict.name}</h3>
                            <p>{dict.wordCount || 0} words</p> {/* если позже будет количество слов */}
                        </Link>
                    ))}
            </div>
        </div>

    );
}

export default FolderPage;
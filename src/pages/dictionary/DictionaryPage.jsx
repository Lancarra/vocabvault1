import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./dictionary.css";

function DictionaryPage() {
    const location = useLocation();
    const { dict_id } = location.state;
    console.log(dict_id);

    const [words, setWords] = useState([
        {
            id: 1,
            name: "Father",
            description: "A male parent"
        },
        {
            id: 2,
            name: "Mother",
            description: "A female parent"
        },
        {
            id: 3,
            name: "Brother",
            description: "A male sibling"
        }
    ]);
    const [isLoading, setIsLoading] = useState();

    const getWords = async () => {
        try {
            const response = await axios(
                `http://localhost:7271/learn-word-dictionary/get-all-dictionaries/${dict_id}`,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            const words_data = response.data;
            setWords(words_data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        setIsLoading(false);
        // getWords();
    }, [words]);

    return (
        <div className="app_loyout">
            <main>
                <div className="dictionary-main">
                    <h1 className="dictionary-header">Your words are here</h1>
                    <div className="word-list">
                        {
                            isLoading
                                ? "Loading..."
                                : words.map((word, index) => (
                                    <Link
                                        to={`/dashboard/module/folder/dictionary/word`}
                                        key={index}
                                        state={{ word_id: word.id }}
                                        className="word-card"
                                    >
                                        <div className="word-cell icon">📘</div>
                                        <div className="word-cell word">{word.name}</div>
                                        <div className="word-cell definition">{word.definition || "—"}</div>
                                    </Link>
                                ))
                        }
                    </div>
                </div>
            </main>
        </div>
    );
}

export default DictionaryPage;

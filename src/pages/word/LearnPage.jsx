import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAllDefinitions } from "../../services/dictionaryService";
import "./learn.css";

function LearnPage() {
    const location = useLocation();
    const { dictionaryId } = location.state;

    const [definitions, setDefinitions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getAllDefinitions(dictionaryId);
                setDefinitions(data);
            } catch (error) {
                console.error("Error loading definitions:", error);
            }
        }
        fetchData();
    }, [dictionaryId]);

    const current = definitions[currentIndex];

    const goNext = () => {
        setFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % definitions.length);
    };

    const goBack = () => {
        setFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + definitions.length) % definitions.length);
    };

    return (
        <div className="learn-page">
            <div className="card-container">
                <div
                    className={`flip-card ${flipped ? "flipped" : ""}`}
                    onClick={() => setFlipped(!flipped)}
                >
                    <div className="card-face front">
                        {current?.word || "—"}
                    </div>
                    <div className="card-face back">
                        {current?.meaning || "—"}
                    </div>
                </div>
            </div>

            <div className="controls">
                <button onClick={goBack}>← Back</button>
                <span>{currentIndex + 1} / {definitions.length}</span>
                <button onClick={goNext}>Next →</button>
            </div>
        </div>
    );
}

export default LearnPage;

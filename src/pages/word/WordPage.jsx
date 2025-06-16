import React, {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";
import axios from "axios";

function WordPage() {
    const location = useLocation();
    const {word_id} = location.state;
    console.log(word_id);
    const [definitions, setDefinitions] = useState([
        {
            id:1,
            word: "Father",
            meaning: "The father of a child",
            url: "https://www.dictionary.com/browse/father"
        }
    ])
    const [isLoading, setIsLoading] = useState();

    const getDefinitions = async () => {
        try {
            const response = await axios(`http://localhost:7271/definition/get-all-definitions/${word_id}`,{
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const definitions_data = response.data;
            setDefinitions(definitions_data);
            setIsLoading(false)
        }catch (err){
            console.log(err);
        }
    }
    useEffect(() => {
        setIsLoading(false)
        // getDefinitions();
    }, [definitions]);
    return (
        <div className="app_loyout">
            <main>
                <div className="word-list">
                    {
                        isLoading ? "Loading..." : definitions.map((definition, index) => (
                            <div className="word-card" key={index}>
                                <h3>Word: {definition.word}</h3>
                                <h3>Meaning: {definition.meaning}</h3>
                                <a href={definition.url}>URL: {definition.url}</a>
                            </div>
                        ))
                    }
                </div>
            </main>
        </div>
    );
}

export default WordPage;
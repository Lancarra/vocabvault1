import React, { useEffect, useState } from 'react';
import './modal.css';

function Modal({
                   isOpen,
                   onClose,
                   onSave,
                   defaultValue = '',
                   defaultMeaning = '',
                   title = 'Action',
                   confirmText = 'Are you sure you want to delete this item?',
                   mode = 'input', // 'input' | 'edit-word' | 'confirm'
                   onFileChange, //  новый проп
                   previewUrl     //  новый проп
               }) {
    const [inputValue, setInputValue] = useState(defaultValue);
    const [meaningValue, setMeaningValue] = useState(defaultMeaning);

    useEffect(() => {
        setInputValue(defaultValue);
        setMeaningValue(defaultMeaning);
    }, [defaultValue, defaultMeaning, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (mode === 'confirm') {
            onSave();
        } else if (mode === 'edit-word') {
            if (inputValue.trim()) {
                onSave({
                    word: inputValue.trim(),
                    meaning: meaningValue.trim(),
                });
            }
        } else if (mode === 'input') {
            if (inputValue.trim()) {
                onSave(inputValue.trim());
            }
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>{title}</h3>

                {mode === 'input' && (
                    <>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Enter word"
                            autoFocus
                        />
                        <label className="modal-photo-label">
                            Add New Photo
                            <input type="file" accept="image/*" hidden onChange={onFileChange} />
                        </label>
                        {previewUrl && <img src={previewUrl} alt="preview" className="modal-photo-preview" />}
                    </>
                )}

                {mode === 'edit-word' && (
                    <>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Word"
                            autoFocus
                        />
                        <input
                            type="text"
                            value={meaningValue}
                            onChange={(e) => setMeaningValue(e.target.value)}
                            placeholder="Meaning"
                            style={{ marginTop: '12px' }}
                        />
                        <label className="modal-photo-label" style={{ marginTop: '12px' }}>
                            Add New Photo
                            <input type="file" accept="image/*" hidden onChange={onFileChange} />
                        </label>
                        {previewUrl && <img src={previewUrl} alt="preview" className="modal-photo-preview" />}
                    </>
                )}

                {mode === 'confirm' && (
                    <p style={{ marginBottom: '1rem' }}>{confirmText}</p>
                )}

                <div className="modal-actions">
                    <button onClick={handleSave}>
                        {mode === 'confirm' ? 'Yes, Delete' : 'Save'}
                    </button>
                    <button className="cancel" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default Modal;

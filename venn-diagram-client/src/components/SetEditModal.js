import React, { useState, useEffect } from 'react';
import { Dice } from './Dice';

// Helper to get a unique string key for any element
const getElementKey = (element) => {
    if (typeof element === 'object' && element !== null) {
        if ('die1' in element) return `(${element.die1},${element.die2})`;
        return JSON.stringify(element);
    }
    return String(element);
};

// Helper to check if an element exists in a list (handling objects)
const isElementInList = (element, list) => {
    if (!list) return false;
    const key = getElementKey(element);
    return list.some(item => getElementKey(item) === key);
};

// This component is the modal for creating/editing a Set
export const SetEditModal = ({
    isOpen,
    currentSet,
    allElements = [],
    elementType,
    editStatus,
    onClose,
    onSave,
    onDelete
}) => {
    const [setNewName, setSetNewName] = useState('');
    const [setElementMemberships, setSetElementMemberships] = useState({});

    const isCreating = currentSet === null;

    // Sync local state when modal opens
    useEffect(() => {
        if (isOpen) {
            setSetNewName(isCreating ? '' : currentSet.name);
            // currentSet.memberElements is the list we get from the API
            const newMemberships = {};
            allElements.forEach(el => {
                const key = getElementKey(el);
                newMemberships[key] = isCreating ? false : isElementInList(el, currentSet.memberElements);
            });
            setSetElementMemberships(newMemberships);
        }
    }, [isOpen, currentSet, isCreating, allElements]);

    const handleCheckboxChange = (element) => {
        const key = getElementKey(element);
        setSetElementMemberships(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        onSave(currentSet ? currentSet.name : null, setNewName, setElementMemberships);
    };

    const handleDelete = () => {
        onDelete(currentSet.name);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="mb-md">
                    {isCreating ? 'Create New Set' : `Edit Set: ${currentSet.name}`}
                </h2>

                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label className="label">
                            Set Name:
                        </label>
                        <input
                            type="text"
                            value={setNewName}
                            onChange={e => setSetNewName(e.target.value)}
                            placeholder={isCreating ? 'New set name' : ''}
                            className="input"
                        />
                    </div>

                    <h4 className="mt-md mb-sm">Element Membership (Quick Menu):</h4>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        border: '1px solid var(--border)',
                        padding: 'var(--spacing-sm)',
                        borderRadius: 'var(--radius)'
                    }}>
                        {allElements && allElements.length > 0 ? allElements.map((el, idx) => {
                            const key = getElementKey(el);
                            const isDice = elementType === 'DICE_ROLL' && typeof el === 'object' && 'die1' in el;

                            return (
                                <label key={key} className="flex items-center gap-sm" style={{ cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={setElementMemberships[key] || false}
                                        onChange={() => handleCheckboxChange(el)}
                                    />
                                    {isDice ? (
                                        <div className="flex items-center gap-sm">
                                            <Dice die1={el.die1} die2={el.die2} size={20} />
                                            <span className="text-sm text-muted">({el.die1},{el.die2})</span>
                                        </div>
                                    ) : (
                                        <span>{String(el)}</span>
                                    )}
                                </label>
                            );
                        }) : <p className="text-muted">No elements exist. Create an element first.</p>}
                    </div>

                    <div className="flex justify-between mt-lg pt-md" style={{ borderTop: '1px solid var(--border)' }}>
                        <div className="flex gap-sm">
                            <button type="submit" className="btn btn-primary">
                                {isCreating ? 'Create Set' : 'Save Changes'}
                            </button>
                            <button type="button" onClick={onClose} className="btn btn-secondary">
                                Cancel
                            </button>
                        </div>
                        {!isCreating && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="btn btn-danger"
                            >
                                Delete Set
                            </button>
                        )}
                    </div>
                </form>

                {editStatus && (
                    <pre className="mt-md p-sm text-sm" style={{ background: 'var(--bg-hover)', borderRadius: 'var(--radius)' }}>
                        {editStatus}
                    </pre>
                )}
            </div>
        </div>
    );
};
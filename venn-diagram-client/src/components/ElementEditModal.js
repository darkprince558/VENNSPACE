import React, { useState, useEffect } from 'react';
import { Dice } from './Dice';

// This component is the modal for creating/editing an Element
export const ElementEditModal = ({
    isOpen,
    currentElement,
    setNames = [],
    elementType,
    editStatus,
    onClose,
    onSave,
    onDelete
}) => {
    const [elementNewName, setElementNewName] = useState('');
    const [elementSetMemberships, setElementSetMemberships] = useState({});

    const isCreating = currentElement === null;

    // Helper to get display name
    const getDisplayName = (element) => {
        if (!element) return '';
        if (typeof element === 'object' && 'die1' in element) {
            return `(${element.die1},${element.die2})`;
        }
        return String(element);
    };

    // This effect syncs the local state (name, checkboxes) with the props
    // It runs when the modal is opened
    useEffect(() => {
        if (isOpen) {
            setElementNewName(isCreating ? '' : getDisplayName(currentElement.name));
            // currentElement.memberSets is the list we get from the API
            const newMemberships = {};
            setNames.forEach(name => {
                newMemberships[name] = isCreating ? false : currentElement.memberSets.includes(name);
            });
            setElementSetMemberships(newMemberships);
        }
    }, [isOpen, currentElement, isCreating, setNames]);

    const handleCheckboxChange = (setName) => {
        setElementSetMemberships(prev => ({ ...prev, [setName]: !prev[setName] }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        // If it's a dice roll, we probably shouldn't allow renaming via text input easily
        // unless we parse it back. For now, let's assume renaming is for strings.
        // If the user edits the text of a dice roll "(1,2)" to "(3,4)", it might be treated as a string "(3,4)".
        // This is a limitation for now.
        onSave(currentElement ? currentElement.name : null, elementNewName, elementSetMemberships);
    };

    const handleDelete = () => {
        onDelete(currentElement.name);
    };

    if (!isOpen) return null;

    const isDice = elementType === 'DICE_ROLL' && currentElement && typeof currentElement.name === 'object';

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="mb-md flex items-center gap-sm">
                    {isCreating ? 'Create New Element' : 'Edit Element:'}
                    {!isCreating && isDice && (
                        <Dice die1={currentElement.name.die1} die2={currentElement.name.die2} size={30} />
                    )}
                    {!isCreating && !isDice && ` ${currentElement.name}`}
                </h2>

                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label className="label">
                            Element Name:
                        </label>
                        <input
                            type="text"
                            value={elementNewName}
                            onChange={e => setElementNewName(e.target.value)}
                            placeholder={isCreating ? 'New element name' : ''}
                            className="input"
                            disabled={!isCreating && isDice} // Disable renaming for Dice for now to avoid complexity
                        />
                        {!isCreating && isDice && (
                            <p className="text-muted text-sm mt-sm">Renaming dice rolls is not supported yet.</p>
                        )}
                    </div>

                    <h4 className="mt-md mb-sm">Set Membership:</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '200px', overflowY: 'auto' }}>
                        {setNames && setNames.length > 0 ? setNames.map(name => (
                            <label key={name} className="flex items-center gap-sm">
                                <input
                                    type="checkbox"
                                    checked={elementSetMemberships[name] || false}
                                    onChange={() => handleCheckboxChange(name)}
                                />
                                {name}
                            </label>
                        )) : <p className="text-muted">No sets exist.</p>}
                    </div>

                    <div className="flex justify-between mt-lg pt-md" style={{ borderTop: '1px solid var(--border)' }}>
                        <div className="flex gap-sm">
                            <button type="submit" className="btn btn-primary">
                                {isCreating ? 'Create Element' : 'Save Changes'}
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
                                Delete Element
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
import React, { useState, useEffect } from 'react';

// This component is the modal for creating/editing an Element
export const ElementEditModal = ({
                                     isOpen,
                                     currentElement,
                                     setNames,
                                     editStatus,
                                     onClose,
                                     onSave,
                                     onDelete
                                 }) => {
    const [elementNewName, setElementNewName] = useState('');
    const [elementSetMemberships, setElementSetMemberships] = useState({});

    const isCreating = currentElement === null;

    // This effect syncs the local state (name, checkboxes) with the props
    // It runs when the modal is opened
    useEffect(() => {
        if (isOpen) {
            setElementNewName(isCreating ? '' : currentElement.name);
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
        onSave(currentElement ? currentElement.name : null, elementNewName, elementSetMemberships);
    };

    const handleDelete = () => {
        onDelete(currentElement.name);
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0, 0, 0, 0.5)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div style={{ background: 'white', padding: '25px', borderRadius: '8px', width: '90%', maxWidth: '500px' }}>
                <h2 style={{ marginTop: 0 }}>
                    {isCreating ? 'Create New Element' : `Edit Element: ${currentElement.name}`}
                </h2>

                <form onSubmit={handleSave}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>
                            Element Name:
                            <input
                                type="text"
                                value={elementNewName}
                                onChange={e => setElementNewName(e.target.value)}
                                placeholder={isCreating ? 'New element name' : ''}
                                style={{ padding: '5px', marginLeft: '10px', width: 'calc(100% - 120px)' }}
                            />
                        </label>
                    </div>

                    <h4 style={{marginTop: '15px', marginBottom: '10px'}}>Set Membership:</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '200px', overflowY: 'auto' }}>
                        {setNames.length > 0 ? setNames.map(name => (
                            <label key={name}>
                                <input
                                    type="checkbox"
                                    checked={elementSetMemberships[name] || false}
                                    onChange={() => handleCheckboxChange(name)}
                                />
                                {name}
                            </label>
                        )) : <p>No sets exist.</p>}
                    </div>

                    <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
                                {isCreating ? 'Create Element' : 'Save Changes'}
                            </button>
                            <button type="button" onClick={onClose} style={{ marginLeft: '10px', padding: '10px 10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }}>
                                Cancel
                            </button>
                        </div>
                        {!isCreating && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                style={{ padding: '10px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' }}
                            >
                                Delete Element
                            </button>
                        )}
                    </div>
                </form>

                {editStatus && (
                    <pre style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px', marginTop: '15px' }}>
            {editStatus}
          </pre>
                )}
            </div>
        </div>
    );
};